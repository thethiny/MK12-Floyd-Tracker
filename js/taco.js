// Living Towers left to right, the beam sits between slot 2 and 3. Floyd Tower only spawns in slot 4 or 5
const tacoTowerSlots = [
    { x: 55, height: 120 },
    { x: 140, height: 140 },
    { x: 225, height: 125 },
    { x: 375, height: 130 },
    { x: 460, height: 150 },
    { x: 545, height: 165 },
];
const tacoTowerBaseY = 200;
const tacoTowerWidth = 46;

function formatTacoDuration(ms) {
    const totalMinutes = Math.max(0, Math.ceil(ms / 60000));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return hours ? `${hours}h ${minutes}m` : `${minutes}m`;
}

function formatTacoTime(date) {
    return date.toLocaleString([], { weekday: "short", hour: "2-digit", minute: "2-digit" });
}

function buildTacoTowerSvg(slot, isNext, label) {
    const { x, height } = slot;
    const top = tacoTowerBaseY - height;
    const half = tacoTowerWidth / 2;
    const tiers = 4;

    let shapes = `<rect x="${x - half * 0.6}" y="${top}" width="${half * 1.2}" height="${height}"/>`;
    for (let i = 0; i < tiers; i++) {
        const y = top + 12 + (height - 24) * i / tiers;
        shapes += `<polygon points="${x - half},${y + 8} ${x + half},${y + 8} ${x + half * 0.7},${y} ${x - half * 0.7},${y}"/>`;
    }
    shapes += `<polygon points="${x - half * 0.6},${top} ${x + half * 0.6},${top} ${x},${top - 22}"/>`;
    shapes += `<circle class="taco-light" cx="${x}" cy="${top - 4}" r="5"/>`;
    if (label) {
        shapes += `<text class="taco-label" x="${x}" y="${tacoTowerBaseY + 16}">${label}</text>`;
    }

    return `<g class="taco-tower${isNext ? " taco-tower-next" : ""}">${shapes}</g>`;
}

function buildTacoTowersSvg(nextSlotIndex, label) {
    const towers = tacoTowerSlots
        .map((slot, i) => buildTacoTowerSvg(slot, i === nextSlotIndex, i === nextSlotIndex ? label : ""))
        .join("");

    return `<svg class="taco-towers" viewBox="0 0 600 225" role="img" aria-label="Floyd Tower location">
        <defs>
            <linearGradient id="taco-beam-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="white" stop-opacity="0.35"/>
                <stop offset="1" stop-color="white" stop-opacity="0"/>
            </linearGradient>
        </defs>
        <rect class="taco-beam" x="288" y="0" width="24" height="${tacoTowerBaseY}" fill="url(#taco-beam-gradient)"/>
        ${towers}
    </svg>`;
}

function renderTacoTower(container, statusElement, taco) {
    if (!taco.unlocked) {
        container.innerHTML = buildTacoTowersSvg(-1, "");
        statusElement.textContent = "You need to beat Floyd at least once to unlock the Floyd Tower."; // TotalTimesDefeatedFloyd (stat 41) >= 1
        return;
    }

    const start = new Date(taco.start);
    const end = new Date(taco.end);
    container.innerHTML = buildTacoTowersSvg(taco.slot_index, start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));

    // Row 1 is the countdown, row 2 the exact local time
    const countdownRow = document.createElement("span");
    countdownRow.classList.add("taco-countdown");
    const timeRow = document.createElement("span");
    timeRow.classList.add("taco-time");
    statusElement.replaceChildren(countdownRow, timeRow);

    // Tick locally so the countdown stays fresh without refetching
    function updateStatus() {
        const now = new Date();
        if (now >= end) {
            countdownRow.textContent = "Floyd Tower ended";
            timeRow.textContent = "Refresh for the next one";
            clearInterval(timer);
        } else if (now >= start) {
            countdownRow.textContent = `Floyd Tower is up! Ends in ${formatTacoDuration(end - now)}`;
            timeRow.textContent = `Until ${formatTacoTime(end)}`;
        } else {
            countdownRow.textContent = `Next Floyd Tower in ${formatTacoDuration(start - now)}`;
            timeRow.textContent = formatTacoTime(start);
        }
    }

    const timer = setInterval(updateStatus, 30000);
    updateStatus();
}
