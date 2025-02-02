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

        function addField(label, value, className) {
            if (value) {
                const field = document.createElement("p");
                field.classList.add(className);
                field.innerHTML = `<strong>${label}:</strong> ${value}`;
                detailsContainer.appendChild(field);
            }
        }

        addField("Requirements", clue.requirements, "clue-requirements");
        addField("Hints", clue.additional, "clue-extra-requirements");
        addField("Character Requirement", clue.character, "clue-character");
        addField("Enemy Requirement", clue.enemy, "clue-enemy");
        addField("Round", clue.round, "clue-rounds");
        addField("Floyd Notification", clue.trigger, "clue-trigger");

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

});
