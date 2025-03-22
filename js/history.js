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

    toggleOutside.addEventListener("click", toggleSidebar);
    toggleInside.addEventListener("click", toggleSidebar);

    historyList.addEventListener("click", function (event) {
        if (event.target.tagName === "LI") {
            const floydId = event.target.getAttribute("data-id");
            const platformId = event.target.getAttribute("data-platform");
            const [username, platformName] = event.target.textContent.split(" - ");
            redirectToFloyd(username, platformId, floydId);
        }
    });

    clearHistoryBtn.addEventListener("click", function () {
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
            loadHistory(); // Refresh the UI
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

        history.forEach(entry => {
            const listItem = document.createElement("li");
            listItem.textContent = `${entry.username} - ${entry.platform}`;
            listItem.setAttribute("data-id", entry.floydId);
            listItem.setAttribute("data-platform", entry.platform_id);
            historyList.appendChild(listItem);
        });
    }

    loadHistory();

    // Expose history functions to global scope so other scripts can use it
    window.addHistory = addHistory;
    window.getHistory = getHistory;
});
