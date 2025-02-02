document.addEventListener("DOMContentLoaded", function () {
    const clueList = document.getElementById("clue-items");

    clues.forEach(clue => {
        const li = document.createElement("li");
        li.classList.add("clue-item");

        // Create button parent
        const buttonParent = document.createElement("div");
        buttonParent.classList.add("clue-parent");
        li.appendChild(buttonParent);

        // Create button for clue name
        const button = document.createElement("button");
        button.classList.add("clue-name");
        button.textContent = `${clue.id}: ${clue.name}`;
        buttonParent.appendChild(button);

        const innerButtonsParent = document.createElement("div");
        innerButtonsParent.classList.add("clue-buttons-container");
        buttonParent.appendChild(innerButtonsParent);

        // Create details container
        const detailsContainer = document.createElement("div");
        detailsContainer.classList.add("clue-details", "hidden");

        // Helper function to add a field if it exists
        function addField(label, value, className) {
            if (value) {
                const field = document.createElement("p");
                field.classList.add(className);
                field.innerHTML = `<strong>${label}:</strong> ${value}`;
                detailsContainer.appendChild(field);
            }
        }

        // Append only existing fields
        addField("Requirements", clue.requirements, "clue-requirements");
        addField("Extra Requirements", clue.additional, "clue-extra-requirements");
        addField("Character Requirement", clue.character, "clue-character");
        addField("Enemy Requirement", clue.enemy, "clue-enemy");
        addField("Round Requirement", clue.rounds, "clue-rounds");
        addField("Trigger Info", clue.trigger, "clue-trigger");

        li.appendChild(detailsContainer);

        // Action buttons
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
                    if (state === "done") innerButtonsParent.classList.add("clue-done");
                    if (state === "not-working") innerButtonsParent.classList.add("clue-not-working");
                    if (state === "unsure") innerButtonsParent.classList.add("clue-unsure");
                }
            });
            actionsContainer.appendChild(actionBtn);
        });

        innerButtonsParent.appendChild(actionsContainer);

        // Toggle details on button click
        button.addEventListener("click", function () {
            detailsContainer.classList.toggle("hidden");
        });

        clueList.appendChild(li);
    });

    document.querySelectorAll(".clue-name").forEach(button => {
        button.addEventListener("click", function () {
            let details = this.parentElement.nextElementSibling;
            details.style.display = details.style.display === "block" ? "none" : "block";
        });
    });
});
