const platformContainer = document.getElementById('platforms');
const platformDescription = document.getElementById('platform-description');
const selectedPlatformText = document.getElementById('selected-platform');
const errorMessage = document.getElementById('error-message');
const loadingOverlay = document.getElementById('loading');
const trackButton = document.getElementById('track');
let selectedPlatform = null;

// Load stored history from localStorage
function getStoredHistory() {
    return JSON.parse(localStorage.getItem("floydHistory")) || [];
}

// Check if a username+platform combo exists in history
function findStoredFloydId(username, platform) {
    const history = getStoredHistory();
    const entry = history.find(item => item.username === username && item.platform === platform);
    return entry ? entry.floydId : null;
}

// Initialize platform buttons
platforms.forEach(platform => {
    const btn = document.createElement('button');
    btn.classList.add('platform-btn');
    btn.innerHTML = `<img src="${platform.logo}" alt="${platform.name}">`;

    btn.onclick = () => {
        document.querySelectorAll('.platform-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedPlatform = platform;
        platformDescription.innerHTML = platform.description;
        selectedPlatformText.textContent = `Selected Platform: ${platform.name}`;
        errorMessage.textContent = '';

        // Disable track button if the selected platform is Xbox or Nintendo Switch
        trackButton.disabled = platform.platform_id === 'xsx' || platform.platform_id === 'nx';
    };

    platformContainer.appendChild(btn);
});

// Track button click event
document.getElementById('track').onclick = async () => {
    const username = document.getElementById('username').value.trim();
    if (!username || !selectedPlatform) return alert('Enter a username and select a platform');

    // Check if the Floyd ID is already stored
    const cachedFloydId = findStoredFloydId(username, selectedPlatform.name);
    if (cachedFloydId) {
        errorMessage.textContent = `User ID (Cached): ${cachedFloydId}`;
        alert(`Floyd ID: ${cachedFloydId}`);
        return;
    }

    // If not cached, fetch from API
    loadingOverlay.style.display = 'flex';

    try {
        const response = await fetch(`https://thethiny.xyz/mk12/floyd/id?username=${username}&platform=${selectedPlatform.platform_id}`);
        const data = await response.json();

        if (response.ok) {
            errorMessage.textContent = `User ID: ${data.user_id}`;
            addHistory(username, selectedPlatform.name, data.user_id); // Store in history
        } else {
            errorMessage.textContent = `Error: ${data.error}`;
        }
    } catch (error) {
        errorMessage.textContent = 'Request failed! Please contact thethiny to fix.';
        console.error(error);
    } finally {
        loadingOverlay.style.display = 'none';
    }
};

// Add Enter key support for tracking
document.getElementById('username').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        trackButton.click();
    }
});
