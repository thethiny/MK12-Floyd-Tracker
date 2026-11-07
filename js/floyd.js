// Checkbox keeps the state, the label draws the number (::after on inputs breaks in Firefox)
function createChallengeChip(checkbox) {
    const chip = document.createElement("label");
    chip.classList.add("challenge-chip");
    const number = document.createElement("span");
    number.textContent = checkbox.dataset.index;
    chip.append(checkbox, number);
    return chip;
}

const htmlToImageUrl = "https://cdn.jsdelivr.net/npm/html-to-image@1.11.11/dist/html-to-image.js";

function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Copies the top card as a png, falls back to a download where image clipboard isn't supported
async function copyCardImage(card, button, fileName) {
    const options = {
        pixelRatio: 2,
        backgroundColor: getComputedStyle(card).backgroundColor, // Applies to the card itself, not around it
        style: { margin: "0", paddingTop: "56px" }, // Room for the avatar that overlaps the card
        filter: (node) => !(node.classList && (node.classList.contains("card-actions") || node.classList.contains("tracking-badge"))), // Buttons and the lookup counter aren't player info
    };
    const label = button.textContent;
    const flash = (text) => {
        button.textContent = text;
        setTimeout(() => button.textContent = label, 1800);
    };

    if (!window.htmlToImage) {
        flash("Loading...");
        return;
    }

    // Safari needs clipboard.write called right away with a promise, not after an await
    const blobPromise = htmlToImage.toBlob(card, options);
    if (navigator.clipboard && window.ClipboardItem) {
        try {
            await navigator.clipboard.write([new ClipboardItem({ "image/png": blobPromise })]);
            flash("Copied!");
            return;
        } catch (e) {
            console.log("Clipboard image not allowed, downloading instead", e);
        }
    }

    const link = document.createElement("a");
    link.href = URL.createObjectURL(await blobPromise);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
    flash("Saved!");
}

document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get("username");
    const userId = urlParams.get("user_id");
    const platform = urlParams.get("platform");

    const floydDataCard = document.getElementById("floyd-data-card");
    const profileChallengesCard = document.getElementById("profile-challenges");
    const hintsSection = document.getElementById("hints-section");
    const fatalitiesSection = document.getElementById("fatalities-section");
    const animalitiesSection = document.getElementById("animalities-section");
    const allChallengesSection = document.getElementById("all-challenges-section");
    const tacoSection = document.getElementById("taco-section");
    const loadingMessage = document.getElementById("loading-message");
    const errorMessage = document.getElementById("error-message");

    const kofiSection = document.getElementById("kofi-section");

    if (!username || !userId || !platform) {
        errorMessage.textContent = "Missing required parameters.";
        errorMessage.classList.remove("hidden");
        loadingMessage.classList.add("hidden");
        return;
    }

    try {
        const response = await fetch(`${config.apiBaseUrl}/data?username=${username}&platform=${platform}&user_id=${userId}`);
        const data = await response.json();

        if (!response.ok || !data.data) {
            throw new Error(data.error || "Invalid response");
        }

        console.log("Full API Response:", data); // Log the full response

        const parsed = data.data.parsed;
        const raw = data.data.raw;
        const meta = data.meta;
        const guessedChallenges = data.data.challenges.online !== undefined ? data.data.challenges.online : data.data.challenges;
        const floydPlatform = data.user.floyd_platform;

        // Update UI
        document.getElementById("username").textContent = data.user.username;
        document.getElementById("hydra-username").textContent = `WBID: ${data.user.mk12.hydra_username}`;
        document.getElementById("wins").textContent = parsed.victories;
        document.getElementById("losses").textContent = parsed.losses;
        document.getElementById("floyd-encounters").textContent = raw["Total Times Encountered Floyd"] ?? 0;
        document.getElementById("floyd-matches-till").textContent = `${parsed["next_floyd_clue"]}`;
        document.getElementById("tracking-number").textContent = `#${Number(meta.hits.profile).toLocaleString()}`;

        let floydPlatformMap = platformsMap[floydPlatform || "wb_network"] || platformsMap["wb_network"];
        document.getElementById("platform-image").setAttribute("src", floydPlatformMap.logo);

        const challengeSectionAll = document.querySelector(".challenge-section-all");

        // Your 10 (js/challenges.js)
        const { myChallenges, offlineChallenges: offlineIds, oldFormat } = computeMyChallenges(data.data);

        const myChallengesList = document.getElementById("my-challenges-list");
        const myProgress = document.getElementById("my-progress");
        const progressFill = document.getElementById("progress-fill");
        const offlineChallenges = offlineIds.map(id => ({ id }));

        function renderMyChallenges(offline) {
            const list = offline ? offlineChallenges : myChallenges;
            myChallengesList.replaceChildren(...buildChallengeRows(list, showClue).children);
            if (offline) {
                myProgress.textContent = "Not tracked offline";
                progressFill.style.width = "0%";
            } else {
                const done = list.filter(c => c.done).length;
                myProgress.textContent = `${done}/${list.length} done`;
                progressFill.style.width = `${list.length ? done / list.length * 100 : 0}%`;
            }
        }

        if (myChallenges.length) {
            renderMyChallenges(false);
        } else {
            document.getElementById("my-challenges").classList.add("hidden");
            document.getElementById("no-guess-message").classList.remove("hidden");
        }
        document.getElementById("format-note").classList.toggle("hidden", !oldFormat);

        // Offline only exists for platforms with an offline profile (Steam)
        if (offlineChallenges.length && myChallenges.length) {
            const modeSwitch = document.getElementById("mode-switch");
            modeSwitch.classList.remove("hidden");
            modeSwitch.querySelectorAll("button").forEach(button => {
                button.addEventListener("click", () => {
                    modeSwitch.querySelectorAll("button").forEach(b => b.classList.toggle("active", b === button));
                    renderMyChallenges(button.dataset.mode === "offline");
                });
            });
        }

        // All 37
        const checkboxContainer = document.createElement("div");
        checkboxContainer.classList.add("checkbox-container");

        const checkboxGroup = document.createElement("div");
        checkboxGroup.classList.add("checkbox-group");

        const floydChallengesMax = 37;
        const rowLimits = [10, 20, 29, 37];
        let completedChallenges = 0;
        let currentRow = document.createElement("div");
        currentRow.classList.add("checkbox-row");
        for (let i = 1; i <= floydChallengesMax; i++) {
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = parsed.challenges_checklist[i] || false;
            checkbox.dataset.index = i;
            completedChallenges += checkbox.checked;

            checkbox.onclick = (e) => {
                e.preventDefault();
                showClue(i);
            }

            currentRow.appendChild(createChallengeChip(checkbox));

            if (rowLimits.includes(i)) {
                checkboxGroup.appendChild(currentRow);
                currentRow = document.createElement("div");
                currentRow.classList.add("checkbox-row");
            }
        }
        if (currentRow.children.length > 0) {
            checkboxGroup.appendChild(currentRow);
        }

        checkboxContainer.appendChild(checkboxGroup);
        challengeSectionAll.appendChild(checkboxContainer);

        const allCheckboxes = document.querySelectorAll(".challenge-section-all .checkbox-group input");
        let remaining = 0;

        if (!guessedChallenges || guessedChallenges.length === 0) {
            remaining = 10 - completedChallenges;
        } else {
            for (const i of guessedChallenges) {
                const checkbox = allCheckboxes[i - 1];
                if (!checkbox.checked) {
                    checkbox.classList.add("challenge-inactive");
                    remaining += 1;
                }
            }
        }

        document.getElementById("challenge-counter").textContent = `Completed: ${completedChallenges} Remaining: ${remaining}`;
        allChallengesSection.classList.remove("hidden");

        // Add Profile Challenges (js/challenges.js), swipeable tiles on phones, grid on desktop
        const challengesList = document.getElementById("challenges-list");
        const challengeDescriptions = {
            "Fatal Finish": "Do 1 Fatality with 5 characters",
            "You Finish Yet???": "Do 5 Fatalities with 1 character",
            "Inner Beast": "Do 2 animalities with 1 character",
            "Shaolin Monks": "Klassic Ladder as Liu Kang With Kung Lao Kameo",
            "Door Buster": "Succeed in Baraka's Test Your Might (Chapter 5, Trapped) in Story Mode",
            "Climb The Pyramid": "Replay Chapter 15 and reach the top of the Pyramid",
            "Challenge Accepted": "Earn 20 points from Towers of Time Daily/Weekly Challenges",
            "Quest Keeper": "Complete a Daily Challenge 2 times"
        };
        const challengeKeys = ["fatal_finish", "you_finish_yet", "inner_beast", "shaolin", "door_buster", "chapter_15", "tot_points", "daily"];
        const profileChallenges = computeProfileChallenges(raw);

        profileChallenges.forEach((challenge, challengeIndex) => {
            const tile = document.createElement("li");
            tile.className = "profile-tile";
            tile.classList.toggle("done", challenge.done);
            tile.innerHTML = `<div class="tile-head"><span class="tile-id">${challenge.id}</span><span class="tile-name"></span></div>`;
            tile.querySelector(".tile-name").textContent = challenge.name;
            tile.appendChild(buildSegments(challenge.progress, challenge.target));

            const progress = document.createElement("span");
            progress.className = "tile-progress";
            if (challenge.done) {
                progress.textContent = "Done";
            } else if (challenge.status) {
                progress.textContent = challenge.status;
            } else {
                progress.textContent = `${Math.min(challenge.progress, challenge.target)}/${challenge.target}${challenge.unit ? ` ${challenge.unit}` : ""}`;
            }
            tile.appendChild(progress);

            // Click to show description and the backend's suggestion
            tile.onclick = () => {
                showSheet(`${challenge.id}: ${challenge.name}`, `<p>${challengeDescriptions[challenge.name]}</p><p><strong>Status:</strong> ${parsed[challengeKeys[challengeIndex]] || "Incomplete"}</p>`);
            };

            challengesList.appendChild(tile);
        });

        profileChallengesCard.classList.remove("hidden");

        // Add Hints
        const hintsList = document.getElementById("hints-list");
        data.data.hints.forEach(hint => {
            const listItem = document.createElement("li");
            listItem.textContent = hint;
            hintsList.appendChild(listItem);
        });
        hintsSection.classList.remove("hidden");

        // Add Floyd Tower
        if (data.data.taco_tower) { // Older backends don't send it
            renderTacoTower(document.getElementById("taco-towers-container"), document.getElementById("taco-status"), data.data.taco_tower);
            tacoSection.classList.remove("hidden");
        }

        // Fatalities and Animalities, counted against the profile challenges that need them
        function fillFinishers(tracker, goals, list, section) {
            const goalList = section.querySelector(".finisher-goals");
            goals.forEach(goal => {
                const row = document.createElement("li");
                row.classList.toggle("done", goal.done);
                row.innerHTML = `<span class="goal-name"></span><span class="goal-progress"></span>`;
                row.querySelector(".goal-name").textContent = `${goal.id} ${goal.name}`;
                row.querySelector(".goal-progress").textContent = goal.done ? "Done" : `${Math.min(goal.progress, goal.target)}/${goal.target}${goal.unit ? ` ${goal.unit}` : ""}`;
                row.appendChild(buildSegments(goal.progress, goal.target));
                goalList.appendChild(row);
            });

            const counts = getFinisherCounts(tracker);
            counts.forEach(([character, count]) => {
                const chip = document.createElement("li");
                chip.textContent = `${character} ×${count}`;
                list.appendChild(chip);
            });
            if (!counts.length) {
                const empty = document.createElement("li");
                empty.className = "finisher-empty";
                empty.textContent = "None yet";
                list.appendChild(empty);
            }
            section.classList.remove("hidden");
        }
        fillFinishers(raw["Floyd Fatalities Tracker"], profileChallenges.filter(c => c.id === 30 || c.id === 31), document.getElementById("fatalities-list"), fatalitiesSection);
        fillFinishers(raw["Floyd Animalities Tracker"], profileChallenges.filter(c => c.id === 32), document.getElementById("animalities-list"), animalitiesSection);

        // Pin as mine (js/mychallenges.js), opening the pinned profile again refreshes it
        const pinButton = document.getElementById("pin-mine");
        const current = getMyChallenges();
        if (current && current.userId === userId) {
            saveMyChallenges(buildPin(username, platform, userId, data.data, current));
            pinButton.textContent = "Pinned";
        }
        pinButton.classList.toggle("hidden", !myChallenges.length);
        pinButton.addEventListener("click", () => {
            const previous = getMyChallenges();
            saveMyChallenges(buildPin(username, platform, userId, data.data, previous && previous.userId === userId ? previous : null));
            pinButton.textContent = "Pinned";
            updateMyChallengesButton();
        });

        const copyButton = document.getElementById("copy-image");
        copyButton.addEventListener("click", () => copyCardImage(floydDataCard, copyButton, `floyd-${data.user.username}.png`));

        // Show Data Sections
        floydDataCard.classList.remove("hidden");
        kofiSection.classList.remove("hidden");

        // Preload so the copy click can reach the clipboard without waiting
        loadScript(htmlToImageUrl).catch(() => copyButton.classList.add("hidden"));
    } catch (error) {
        errorMessage.textContent = `Error: ${error.message}`;
        errorMessage.classList.remove("hidden");
    } finally {
        loadingMessage.classList.add("hidden");
    }
});
