document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get("username");
    const userId = urlParams.get("user_id");
    const platform = urlParams.get("platform");

    const floydDataCard = document.getElementById("floyd-data-card");
    const profileChallengesCard = document.getElementById("profile-challenges");
    const hintsSection = document.getElementById("hints-section");
    const fatalitiesSection = document.getElementById("fatalities-section");
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
        const response = await fetch(`https://thethiny.xyz/mk12/floyd/data?username=${username}&platform=${platform}&user_id=${userId}`);
        const data = await response.json();

        if (!response.ok || !data.data) {
            throw new Error(data.error || "Invalid response");
        }

        console.log("Full API Response:", data); // Log the full response

        const parsed = data.data.parsed;
        const raw = data.data.raw;
        const meta = data.meta;
        const guessedChallenges = data.data.challenges;
        const floydPlatform = data.user.floyd_platform;

        // Update UI
        document.getElementById("username").textContent = data.user.username;
        // document.getElementById("user-id").textContent = `Floyd ID: ${data.user.user_id}`; // Commented out
        document.getElementById("hydra-username").textContent = `WBID: ${data.user.mk12.hydra_username}`;
        document.getElementById("wins").textContent = parsed.victories;
        document.getElementById("losses").textContent = parsed.losses;
        document.getElementById("floyd-encounters").textContent = `Times Encountered Floyd: ${raw["Total Times Encountered Floyd"]}`;
        // document.getElementById("floyd-last-state").textContent = `Floyd Last Match: ${raw["Floyd Last Battle State"]}`;
        document.getElementById("floyd-matches-till").textContent = `${parsed["next_floyd_clue"]}`;

        const hits = meta.hits.profile;
        const headingContainer = document.getElementById("heading-container");

        trackingH3 = document.createElement("h3");
        trackingH3.textContent = `Tracking Number #${hits}`;
        headingContainer.appendChild(trackingH3);


        let floydPlatformMap = platformsMap[floydPlatform || "wb_network"] || platformsMap["wb_network"];
        document.getElementById("platform-image").setAttribute("src", floydPlatformMap.logo);

        // Create challenge checkboxes and labels
        const challengeSection = document.querySelector(".challenge-section");

        const checkboxContainer = document.createElement("div");
        checkboxContainer.classList.add("checkbox-container");

        const checkboxGroup = document.createElement("div");
        checkboxGroup.classList.add("checkbox-group");


        // const floydChallengesMax = 10;
        const floydChallengesMax = 37;
        const rowLimits = [10, 20, 29, 37];
        let completedChallenges = 0;
        let currentRow = document.createElement("div");
        currentRow.classList.add("checkbox-row");
        for (let i = 1; i <= floydChallengesMax; i++) {
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            // checkbox.disabled = true;
            checkbox.checked = parsed.challenges_checklist[i] || false;
            checkbox.dataset.index = i;
            completedChallenges += checkbox.checked;

            checkbox.onclick = async (e) => {
                e.preventDefault();
                let clue = clues[i-1]
                alert(`${i}: ${clue.name}\n${clue.requirements}${clue.additional? '\n' + clue.additional: ''}`);
            }

            currentRow.appendChild(checkbox);

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
        challengeSection.appendChild(checkboxContainer);

        // Add Profile Challenges
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

        const challenges = [
            { name: "Fatal Finish", key: "fatal_finish" },
            { name: "You Finish Yet???", key: "you_finish_yet" },
            { name: "Inner Beast", key: "inner_beast" },
            { name: "Shaolin Monks", key: "shaolin" },
            { name: "Door Buster", key: "door_buster" },
            { name: "Climb The Pyramid", key: "chapter_15" },
            { name: "Challenge Accepted", key: "tot_points" },
            { name: "Quest Keeper", key: "daily" },
        ];

        allCheckboxes = document.querySelectorAll(".checkbox-group input");
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

        const counterSpan = challengeSection.querySelector('span');
        if (counterSpan) {
            counterSpan.textContent = `Completed: ${completedChallenges} Remaining: ${remaining}`;
        }

        challenges.forEach((challenge, challengeIndex) => {
            const listItem = document.createElement("li");
            listItem.textContent = `${challengeIndex + 30} - ${challenge.name}: ${parsed[challenge.key] || "Incomplete"}`;

            // Click to show description
            listItem.onclick = () => {
                alert(`${challenge.name}: ${challengeDescriptions[challenge.name]}`);
            };

            challengesList.appendChild(listItem);
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

        // Add Fatalities & Animalities
        const fatalitiesList = document.getElementById("fatalities-list");

        if (raw["Floyd Fatalities Tracker"]) {
            Object.entries(raw["Floyd Fatalities Tracker"]).forEach(([character, count]) => {
                const listItem = document.createElement("li");
                listItem.textContent = `Fatalities as ${character}: ${count}`;
                fatalitiesList.appendChild(listItem);
            });
        }

        if (raw["Floyd Animalities Tracker"]) {
            Object.entries(raw["Floyd Animalities Tracker"]).forEach(([character, count]) => {
                const listItem = document.createElement("li");
                listItem.textContent = `Animalities as ${character}: ${count}`;
                fatalitiesList.appendChild(listItem);
            });
        }

        fatalitiesSection.classList.remove("hidden");

        // Show Data Sections
        floydDataCard.classList.remove("hidden");
        kofiSection.classList.remove("hidden");
    } catch (error) {
        errorMessage.textContent = `Error: ${error.message}`;
        errorMessage.classList.remove("hidden");
    } finally {
        loadingMessage.classList.add("hidden");
    }
});
