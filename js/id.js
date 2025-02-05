const platformContainer = document.getElementById('platforms');
const platformDescription = document.getElementById('platform-description');
const selectedPlatformText = document.getElementById('selected-platform');
const errorMessage = document.getElementById('error-message');
const loadingOverlay = document.getElementById('loading');
const trackButton = document.getElementById('track');
let selectedPlatform = null;

// Check if a username+platform combo exists in history
function findStoredFloydId(username, platform) {
    const history = getHistory();
    const entry = history.find(item => item.username === username && item.platform === platform);
    return entry ? entry.floydId : null;
}

// Redirect function
function redirectToFloyd(username, platform, userId) {
    window.location.href = `/floyd?username=${encodeURIComponent(username)}&platform=${encodeURIComponent(platform)}&user_id=${encodeURIComponent(userId)}`;
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

        // Disable track button if the selected platform is disabled
        trackButton.disabled = platform.enabled ? false : true;
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
        redirectToFloyd(username, selectedPlatform.platform_id, cachedFloydId);
        return;
    }

    // If not cached, fetch from API
    loadingOverlay.style.display = 'flex';

    try {
        const response = await fetch(`https://thethiny.xyz/mk12/floyd/id?username=${username}&platform=${selectedPlatform.platform_id}`);

        if (response.status === 503) {
            errorMessage.textContent = 'Service is under maintenance. Please try again soon!';
            return;
        }

        const data = await response.json();

        if (response.ok) {
            addHistory(username, selectedPlatform.name, selectedPlatform.platform_id, data.user_id); // Store in history
            redirectToFloyd(username, selectedPlatform.platform_id, data.user_id);
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
