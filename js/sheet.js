// Shared popup: centered dialog on desktop, slide-up sheet on phones
function showSheet(title, content) {
    let dialog = document.getElementById("sheet");
    if (!dialog) {
        dialog = document.createElement("dialog");
        dialog.id = "sheet";
        dialog.className = "sheet";
        dialog.innerHTML = `
            <div class="sheet-header">
                <h2 class="sheet-title"></h2>
                <button class="sheet-close" aria-label="Close">✕</button>
            </div>
            <div class="sheet-body"></div>`;
        dialog.querySelector(".sheet-close").addEventListener("click", () => dialog.close());
        dialog.addEventListener("click", (e) => {
            if (e.target === dialog) dialog.close(); // Backdrop click
        });
        document.body.appendChild(dialog);
    }

    dialog.querySelector(".sheet-title").textContent = title;
    const body = dialog.querySelector(".sheet-body");
    body.replaceChildren();
    if (typeof content === "string") {
        body.innerHTML = content;
    } else {
        body.appendChild(content);
    }

    if (!dialog.open) dialog.showModal();
}

// Clue details as html, shared by the floyd page and the my challenges panel
function buildClueDetails(clue) {
    const fields = [
        ["Requirements", clue.requirements],
        ["Hints", clue.additional],
        ["Character Requirement", clue.character],
        ["Enemy Requirement", clue.enemy],
        ["Round", clue.round],
        ["Floyd Notification", clue.trigger],
    ];
    let html = fields
        .filter(([, value]) => value)
        .map(([label, value]) => `<p><strong>${label}:</strong> ${value}</p>`)
        .join("");
    if (clue.video) {
        html += `<p><a href="${clue.video}" target="_blank">Video Guide</a></p>`;
    }
    return html;
}

function showClue(id) {
    const clue = clues[id - 1];
    showSheet(`${id}: ${clue.name}`, buildClueDetails(clue));
}
