document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get("username");
    const userId = urlParams.get("user_id");
    const platform = urlParams.get("platform");

    const floydDataCard = document.getElementById("floyd-data-card");
    const loadingMessage = document.getElementById("loading-message");
    const errorMessage = document.getElementById("error-message");

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

        const parsed = data.data.parsed;

        // Update UI
        document.getElementById("username").textContent = data.user.username;
        document.getElementById("user-id").textContent = `Floyd ID: ${data.user.user_id}`;
        document.getElementById("hydra-username").textContent = `WBID: ${data.user.mk12.hydra_username}`;
        document.getElementById("wins").textContent = parsed.victories;
        document.getElementById("losses").textContent = parsed.losses;

        // Create challenge checkboxes and labels
        const challengeSection = document.querySelector(".challenge-section");

        // Wrap checkboxes and labels in a container
        const checkboxContainer = document.createElement("div");
        checkboxContainer.classList.add("checkbox-container");

        const checkboxGroup = document.createElement("div");
        checkboxGroup.classList.add("checkbox-group");

        const checkboxLabels = document.createElement("div");
        checkboxLabels.classList.add("checkbox-labels");

        for (let i = 1; i <= 10; i++) {
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.disabled = true;
            checkbox.checked = parsed.challenges_checklist[i] || false;
            checkboxGroup.appendChild(checkbox);

            const label = document.createElement("span");
            label.textContent = i;
            checkboxLabels.appendChild(label);
        }

        // Append both checkboxes and labels to the wrapper
        checkboxContainer.appendChild(checkboxGroup);
        checkboxContainer.appendChild(checkboxLabels);
        challengeSection.appendChild(checkboxContainer);


        // Show data card
        floydDataCard.classList.remove("hidden");
    } catch (error) {
        errorMessage.textContent = `Error: ${error.message}`;
        errorMessage.classList.remove("hidden");
    } finally {
        loadingMessage.classList.add("hidden");
    }
});
