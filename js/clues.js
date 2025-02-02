document.addEventListener("DOMContentLoaded", function () {
    

    const clueList = document.getElementById("clue-items");

    clues.forEach(clue => {
        const li = document.createElement("li");
        li.classList.add("clue-item");

        // Create button for clue name
        const button = document.createElement("button");
        button.classList.add("clue-name");
        button.textContent = `${clue.id}: ${clue.name}`;
        li.appendChild(button);

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
        clueList.appendChild(li);

        // Toggle details on button click
        button.addEventListener("click", function () {
            detailsContainer.classList.toggle("hidden");
        });
    });

    document.querySelectorAll(".clue-name").forEach(button => {
        button.addEventListener("click", function () {
            let details = this.nextElementSibling;
            details.style.display = details.style.display === "block" ? "none" : "block";
        });
    });
});
