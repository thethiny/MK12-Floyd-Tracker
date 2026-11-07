// Pinned challenges, saved on this device so every page can show them
const myChallengesKey = "floyd-my-challenges";
const myChallengesRefreshAfter = 10 * 60 * 1000; // Older pins refetch before showing

function getMyChallenges() {
    try {
        return JSON.parse(localStorage.getItem(myChallengesKey));
    } catch {
        return null;
    }
}

// pinned: { username, platform, userId, online: [{ id, done }], offline: [id], encounters, savedAt, rerolledAt }
function saveMyChallenges(pinned) {
    localStorage.setItem(myChallengesKey, JSON.stringify(pinned));
}

function clearMyChallenges() {
    localStorage.removeItem(myChallengesKey);
}

// Builds the pin from a /data response, keeps track of when the 10 got rerolled (new Floyd encounter)
function buildPin(username, platform, userId, apiData, previous) {
    const { myChallenges, offlineChallenges } = computeMyChallenges(apiData);
    const encounters = apiData.raw["Total Times Encountered Floyd"] ?? 0;
    let rerolledAt = previous ? previous.rerolledAt : null;
    if (previous && previous.encounters !== undefined && previous.encounters !== encounters) {
        rerolledAt = Date.now();
    }
    return { username, platform, userId, online: myChallenges, offline: offlineChallenges, encounters, savedAt: Date.now(), rerolledAt };
}

let myChallengesRefresh = null;

// Refetches the pinned profile when it's older than the refresh window, resolves to the latest pin
function refreshMyChallenges(force = false) {
    const pinned = getMyChallenges();
    if (!pinned) return Promise.resolve(null);
    if (!force && Date.now() - pinned.savedAt < myChallengesRefreshAfter) return Promise.resolve(pinned);
    if (typeof config === "undefined") return Promise.resolve(pinned);

    myChallengesRefresh ??= fetch(`${config.apiBaseUrl}/data?username=${encodeURIComponent(pinned.username)}&platform=${encodeURIComponent(pinned.platform)}&user_id=${encodeURIComponent(pinned.userId)}`)
        .then(response => response.json())
        .then(data => {
            const latest = getMyChallenges();
            if (!data.data || !latest || latest.userId !== pinned.userId) return latest; // Unpinned or replaced meanwhile
            const updated = buildPin(pinned.username, pinned.platform, pinned.userId, data.data, latest);
            saveMyChallenges(updated);
            return updated;
        })
        .catch(() => getMyChallenges())
        .finally(() => myChallengesRefresh = null);
    return myChallengesRefresh;
}

function buildChallengeRows(challenges, onClick) {
    const list = document.createElement("ul");
    list.className = "challenge-list";
    challenges.forEach(({ id, done }) => {
        const item = document.createElement("li");
        item.className = "challenge-row";
        if (done === true) item.classList.add("done");
        if (done === undefined) item.classList.add("untracked");
        item.innerHTML = `<span class="challenge-mark"></span><span class="challenge-id">${id}</span><span class="challenge-name"></span>`;
        item.querySelector(".challenge-name").textContent = clues[id - 1].name;
        item.addEventListener("click", () => onClick(id));
        list.appendChild(item);
    });
    return list;
}

function formatAge(time) {
    const minutes = Math.round((Date.now() - time) / 60000);
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.round(minutes / 60)}h ago`;
    return `${Math.round(minutes / 1440)}d ago`;
}

function renderMyChallengesPanel(pinned, updating) {
    const content = document.createElement("div");
    const info = document.createElement("p");
    info.className = "sheet-note";
    const done = pinned.online.filter(c => c.done).length;
    info.textContent = `${pinned.username} · ${done}/${pinned.online.length} done · ${updating ? "Updating..." : `updated ${formatAge(pinned.savedAt)}`}`;
    content.appendChild(info);

    // New Floyd encounter means a new set of 10
    if (pinned.rerolledAt && Date.now() - pinned.rerolledAt < 24 * 3600 * 1000) {
        const rerolled = document.createElement("p");
        rerolled.className = "sheet-alert";
        rerolled.textContent = "You met Floyd since last time, these are your new challenges.";
        content.appendChild(rerolled);
    }

    // Details open in place of the list, back returns to it
    function openDetails(id) {
        const clue = clues[id - 1];
        const details = document.createElement("div");
        const back = document.createElement("button");
        back.className = "button sheet-back";
        back.textContent = "← Back";
        back.addEventListener("click", () => showMyChallenges());
        details.innerHTML = buildClueDetails(clue);
        details.prepend(back);
        showSheet(`${id}: ${clue.name}`, details);
    }

    content.appendChild(buildChallengeRows(pinned.online, openDetails));

    if (pinned.offline && pinned.offline.length) {
        const offlineTitle = document.createElement("h3");
        offlineTitle.className = "sheet-subtitle";
        offlineTitle.textContent = "Offline";
        content.append(offlineTitle, buildChallengeRows(pinned.offline.map(id => ({ id })), openDetails));
    }

    const actions = document.createElement("div");
    actions.className = "sheet-actions";
    actions.innerHTML = `<a class="button" href="/floyd?username=${encodeURIComponent(pinned.username)}&platform=${encodeURIComponent(pinned.platform)}&user_id=${encodeURIComponent(pinned.userId)}">Open Profile</a>`;
    const unpin = document.createElement("button");
    unpin.className = "button";
    unpin.textContent = "Unpin";
    unpin.addEventListener("click", () => {
        clearMyChallenges();
        document.getElementById("sheet").close();
        updateMyChallengesButton();
        highlightMyClues();
    });
    actions.appendChild(unpin);
    content.appendChild(actions);

    showSheet("My Challenges", content);
}

function showMyChallenges() {
    const pinned = getMyChallenges();
    if (!pinned) return;

    const stale = Date.now() - pinned.savedAt >= myChallengesRefreshAfter;
    renderMyChallengesPanel(pinned, stale);
    if (stale) {
        refreshMyChallenges().then(latest => {
            const dialog = document.getElementById("sheet");
            // Only redraw if the panel is still the one showing
            if (latest && dialog && dialog.open && dialog.querySelector(".sheet-title").textContent === "My Challenges") {
                renderMyChallengesPanel(latest, false);
            }
            highlightMyClues();
        });
    }
}

// Header button only shows once something is pinned
function updateMyChallengesButton() {
    const button = document.querySelector(".my-challenges-button");
    if (button) button.classList.toggle("hidden", !getMyChallenges());
}

// Clues page: mark the pinned ones in the full list
function highlightMyClues() {
    const items = document.querySelectorAll("#clue-items .clue-item");
    if (!items.length) return;
    const pinned = getMyChallenges();
    const ids = new Set(pinned ? [...pinned.online.map(c => c.id), ...(pinned.offline || [])] : []);
    items.forEach((item, index) => {
        item.classList.toggle("mine", ids.has(clues[index].id));
    });
}
