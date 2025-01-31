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
            alert(`Floyd ID: ${floydId}`);
        }
    });

    clearHistoryBtn.addEventListener("click", function () {
        if (confirm("Are you sure you want to clear all history?")) {
            localStorage.removeItem("floydHistory");
            loadHistory(); // Refresh history list
        }
    });

    function addHistory(username, platform, floydId) {
        const existingHistory = getHistory();
        const newEntry = { username, platform, floydId };
        console.log("Adding", newEntry);

        if (!existingHistory.some(entry => entry.username === username && entry.platform === platform)) {
            existingHistory.push(newEntry);
            saveHistory(existingHistory);
            loadHistory(); // Refresh the UI
        }
    }

    function saveHistory(history) {
        console.log("Saving");
        localStorage.setItem("floydHistory", JSON.stringify(history));
    }

    function getHistory() {
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
            historyList.appendChild(listItem);
        });
    }

    loadHistory();

    // Expose addHistory to global scope so other scripts can use it
    window.addHistory = addHistory;
});
