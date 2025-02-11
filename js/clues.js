function createTwitterEmbed(url) {
    url = url.replace(/x\.com\//, 'twitter.com/');
    const blockquote = document.createElement('blockquote');
    blockquote.innerHTML = `<blockquote class="twitter-tweet" data-media-max-width="560">
    <a href=${url}>Twitter Video</a></blockquote>`

    // If twitter embedder isn't loaded, load it.
    let scriptTag;
    scriptTag = document.getElementById("twitter-embed-class");
    if (!scriptTag)
    {
        scriptTag = document.createElement("script");
        scriptTag.id = "twitter-embed-class";
        scriptTag.src = "https://platform.twitter.com/widgets.js";
        scriptTag.onload = () => console.log("Loaded Twitter Embed Loader!");
        document.body.appendChild(scriptTag); // Must be done after the clues are loaded
    }

    return blockquote;
}

function createTwitchEmbed(url) {
    let videoId = null;
    let type = null;

    // Detect the type and extract videoId accordingly
    if (url.includes('/videos/')) {
        type = 'video';
        videoId = url.match(/twitch\.tv\/videos\/(\d+)/)?.[1] || null;
    } else if (url.includes('/channels/')) {
        type = 'channel';
        const channelName = url.match(/twitch\.tv\/channels\/([^/]+)/)?.[1] || null;
        videoId = channelName ? `channel/${channelName}` : null;
    } else if (url.includes('/collections/')) {
        type = 'collection';
        const collectionName = url.match(/twitch\.tv\/collections\/([^/]+)/)?.[1] || null;
        videoId = collectionName ? `collection/${collectionName}` : null;
    }

    const timeParam = url.match(/\?time=([0-9hms]+)/)?.[1] || null;  // Extract time if available

    const iframe = document.createElement("iframe");
    iframe.innerHTML = `
    <div style="position: relative; width: 100%; padding-top: 56.25%; overflow: hidden;">
        <iframe
        src="https://player.twitch.tv/?${type}=${videoId}&parent=localhost&parent=floydtracker.thethiny.xyz&autoplay=false${timeParam ? '&time=' + timeParam : ''}"
        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
        allowfullscreen>
        </iframe>
    </div>
`;

    return iframe;
}

function createYoutubeEmbed(url) {
    const videoId = url.match(/(?:youtube\.com\/(?:shorts|watch\?v=)|youtu\.be\/)([a-zA-Z0-9_-]+)/)?.[1] || null;
    const timeParam = url.match(/[?&]t=(\d+)/)?.[1] || null;

    
    if (!videoId) return null;  // If no valid video ID, return null
    
    let embedUrl = `https://www.youtube.com/embed/${videoId}${timeParam ? `?start=${timeParam}` : ''}`;

    const iframe = document.createElement("iframe");
    iframe.innerHTML = `
        <div style="position: relative; width: 100%; padding-top: 56.25%; overflow: hidden;">
            <iframe
            src="${embedUrl}"
            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
            title=""
            frameborder="0"
            allowfullscreen>
            </iframe>
        </div>
    `;

    return iframe;
}

document.addEventListener("DOMContentLoaded", function () {
    const clueList = document.getElementById("clue-items");
    const storageKey = `clue-states`;

    // Load saved state
    let savedState = JSON.parse(localStorage.getItem(storageKey)) || {};

    clues.forEach(clue => {
        const li = document.createElement("li");
        li.classList.add("clue-item");

        const buttonParent = document.createElement("div");
        buttonParent.classList.add("clue-parent");
        li.appendChild(buttonParent);

        const button = document.createElement("button");
        button.classList.add("clue-name");
        button.textContent = `${clue.id}: ${clue.name}`;
        button.dataset.state = savedState[clue.id] || "";
        buttonParent.appendChild(button);

        const innerButtonsParent = document.createElement("div");
        innerButtonsParent.classList.add("clue-buttons-container");
        buttonParent.appendChild(innerButtonsParent);

        const detailsContainer = document.createElement("div");
        detailsContainer.classList.add("clue-details", "hidden");

        function parseVideoType(url) {
            if (!url || !url.startsWith('http')) {
                return null;
            }

            if (url.includes('twitter.com')) {
                return 'twitter';
            }

            if (url.includes('x.com')) {
                return 'twitter';
            }

            if (url.includes('twitch.tv')) {
                if (url.includes('/video/')) {
                    return 'twitch video';
                } else if (url.includes('/channel/')) {
                    return 'twitch channel';
                } else if (url.includes('/collection/')) {
                    return 'twitch collection';
                } else {
                    return 'twitch';
                }
            }

            if (url.includes('youtube.com') || url.includes('youtu.be')) {
                return 'youtube';
            }

            return null;
        }


        function addField(label, value, className) {
            if (value) {
                let urlType = parseVideoType(value);
                const field = document.createElement("p");
                field.classList.add(className);
                if (urlType === null)
                    field.innerHTML = `<strong>${label}:</strong> ${value}`;
                else {
                    let embed;
                    switch (urlType) {
                        case "twitter":
                            embed = createTwitterEmbed(value);
                            break;
                        case "twitch":
                            embed = createTwitchEmbed(value);
                            break;
                        case "youtube":
                            embed = createYoutubeEmbed(value);
                            break;
                        default:
                            throw `Invalid type ${urlType}`;
                    }
                    field.innerHTML = `<strong>${label}:</strong><br/>${embed.innerHTML}`;
                }
                detailsContainer.appendChild(field);
            }
        }

        addField("Requirements", clue.requirements, "clue-requirements");
        addField("Hints", clue.additional, "clue-extra-requirements");
        addField("Character Requirement", clue.character, "clue-character");
        addField("Enemy Requirement", clue.enemy, "clue-enemy");
        addField("Round", clue.round, "clue-rounds");
        addField("Floyd Notification", clue.trigger, "clue-trigger");
        addField("Video Guide", clue.video, "clue-video");

        li.appendChild(detailsContainer);

        const actionsContainer = document.createElement("div");
        actionsContainer.classList.add("clue-actions");

        const actions = [
            { icon: "✅", class: "mark-done", state: "done" },
            { icon: "❎", class: "mark-not-working", state: "not-working" },
            { icon: "❓", class: "mark-unsure", state: "unsure" }
        ];

        actions.forEach(({ icon, class: className, state }) => {
            const actionBtn = document.createElement("button");
            actionBtn.classList.add("clue-action", className);
            actionBtn.textContent = icon;
            actionBtn.addEventListener("click", function () {
                if (button.dataset.state === state) {
                    button.dataset.state = "";
                    innerButtonsParent.classList.remove("clue-done", "clue-not-working", "clue-unsure");
                } else {
                    button.dataset.state = state;
                    innerButtonsParent.classList.remove("clue-done", "clue-not-working", "clue-unsure");
                    innerButtonsParent.classList.add(`clue-${state}`);
                }

                // Save state
                savedState[clue.id] = button.dataset.state;
                localStorage.setItem(storageKey, JSON.stringify(savedState));
            });
            actionsContainer.appendChild(actionBtn);
        });

        innerButtonsParent.appendChild(actionsContainer);

        if (button.dataset.state) {
            innerButtonsParent.classList.add(`clue-${button.dataset.state}`);
        }

        button.addEventListener("click", function () {
            let details = this.parentElement.nextElementSibling;
            details.style.display = details.style.display === "block" ? "none" : "block";
        });

        clueList.appendChild(li);
    });

    // Add clear all button
    const clearAllButton = document.createElement("button");
    clearAllButton.textContent = "Clear All";
    clearAllButton.classList.add("clear-all-button");
    clearAllButton.addEventListener("click", function () {
        localStorage.removeItem(storageKey);
        savedState = {};
        document.querySelectorAll(".clue-name").forEach(button => button.dataset.state = "");
        document.querySelectorAll(".clue-buttons-container").forEach(container => {
            container.classList.remove("clue-done", "clue-not-working", "clue-unsure");
        });
    });

    clueList.appendChild(clearAllButton);

    let fullGuideCont = document.getElementById("full-guide-container");
    fullGuideCont.innerHTML = createYoutubeEmbed("https://www.youtube.com/watch?v=JEV3GP5hTqA").innerHTML;
    console.log(fullGuideCont);

});
