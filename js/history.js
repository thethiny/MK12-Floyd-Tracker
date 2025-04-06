const currentHistoryVersion = 2;

document.addEventListener("DOMContentLoaded", function () {
    const historySidebar = document.getElementById("history-sidebar");
    const toggleOutside = document.getElementById("toggle-sidebar-outside");
    const toggleInside = document.getElementById("toggle-sidebar-inside");
    const historyList = document.getElementById("history-list");
    const clearHistoryBtn = document.getElementById("clear-history");

    function toggleSidebar() {
        historySidebar.classList.toggle("open");
    }

    toggleOutside?.addEventListener("click", toggleSidebar);
    toggleInside?.addEventListener("click", toggleSidebar);

    historyList?.addEventListener("click", function (event) {
        const listItem = event.target.closest("li.history-item");
        if (!listItem) return;

        const floydId = listItem.getAttribute("data-id");
        const platformId = listItem.getAttribute("data-platform");
        const username = listItem.querySelector(".history-username")?.textContent?.trim();

        if (username && platformId && floydId) {
            redirectToFloyd(username, platformId, floydId);
        }
    });


    clearHistoryBtn?.addEventListener("click", function () {
        if (confirm("Are you sure you want to clear all history?")) {
            localStorage.removeItem("floydHistory");
            loadHistory(); // Refresh history list
        }
    });

    function addHistory(username, platform, platform_id, floydId) {
        const existingHistory = getHistory();
        const newEntry = { username, platform, platform_id, floydId };
        console.log("Adding", newEntry);

        if (!existingHistory.some(entry =>
            entry.username.toLowerCase() === username.toLowerCase() &&
            entry.platform_id.toLowerCase() === platform_id.toLowerCase()
        )) {
            existingHistory.push(newEntry);
            saveHistory(existingHistory);
            if (historySidebar) {
                loadHistory(); // Refresh the UI
            }
        }
    }

    function saveHistory(history) {
        console.log(`Saving History Version ${currentHistoryVersion}`);
        localStorage.setItem("floydHistory", JSON.stringify(history));
        localStorage.setItem("floydHistoryVersion", JSON.stringify(currentHistoryVersion));
    }

    function getHistory() {
        const storedHistoryVersion = localStorage.getItem("floydHistoryVersion") || 0;
        if (storedHistoryVersion < currentHistoryVersion)
        {
            console.log(`Detected old history version! ${storedHistoryVersion} < ${currentHistoryVersion}`)
            return [];
        }
        const storedHistory = localStorage.getItem("floydHistory");
        return storedHistory ? JSON.parse(storedHistory) : [];
    }


    function loadHistory() {
        historyList.innerHTML = "";
        const history = getHistory();
        console.log("Loading", history);

        if (history.length === 0) {
            historyList.innerHTML = "<li>No history yet</li>";
            return;
        }

        history.forEach((entry, index) => {
            const listItem = document.createElement("li");
            listItem.classList.add("history-item");

            // Container for row layout
            const row = document.createElement("div");
            row.classList.add("history-row");

            // Icon
            const iconDiv = document.createElement("div");
            iconDiv.classList.add("history-icon");
            const platformInfo = platformsMap[entry.platform_id];
            if (platformInfo) {
                const iconImg = document.createElement("img");
                iconImg.src = platformInfo.logo;
                iconImg.alt = platformInfo.name;
                iconImg.classList.add("history-icon-img");
                iconDiv.appendChild(iconImg);
            }

            // Username
            const textDiv = document.createElement("div");
            textDiv.classList.add("history-username");
            textDiv.textContent = entry.username;

            // Remove button
            const removeWrapper = document.createElement("div");
            removeWrapper.classList.add("remove-wrapper");
            removeWrapper.onclick = (e) => {
                e.stopPropagation();
                const newHistory = getHistory();
                newHistory.splice(index, 1);
                saveHistory(newHistory);
                loadHistory();
            };

            const removeBtn = document.createElement("span");
            removeBtn.textContent = "✕";
            removeBtn.classList.add("remove-entry");
            removeWrapper.appendChild(removeBtn);

            // Assemble row
            row.appendChild(iconDiv);
            row.appendChild(textDiv);
            row.appendChild(removeWrapper);

            // Set data attributes & final list item
            listItem.setAttribute("data-id", entry.floydId);
            listItem.setAttribute("data-platform", entry.platform_id);
            listItem.appendChild(row);
            historyList.appendChild(listItem);
        });


    }

    if (historySidebar)
    {
        loadHistory();
    }

    // Expose history functions to global scope so other scripts can use it
    window.addHistory = addHistory;
    window.getHistory = getHistory;
});
