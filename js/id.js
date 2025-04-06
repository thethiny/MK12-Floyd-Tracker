const platformContainer = document.getElementById('platforms');
const platformDescription = document.getElementById('platform-description');
const selectedPlatformText = document.getElementById('selected-platform');
const errorMessage = document.getElementById('error-message');
const loadingOverlay = document.getElementById('loading');
const trackButton = document.getElementById('track');
const externalAuthButton = document.getElementById('login');
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
        externalAuthButton.style.display = "none";
        externalAuthButton.removeAttribute('data-id');
        if (btn.classList.contains('selected')) {
            btn.classList.remove('selected');
            selectedPlatform = null;
            platformDescription.innerHTML = 'Select a platform to see details';
            selectedPlatformText.textContent = 'No platform selected';
            errorMessage.textContent = '';
            trackButton.disabled = true;
        } else {
            document.querySelectorAll('.platform-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedPlatform = platform;
            platformDescription.innerHTML = platform.description.replace("\n", "<br />");
            selectedPlatformText.textContent = `Selected Platform: ${platform.name}`;
            errorMessage.textContent = '';
            trackButton.disabled = platform.enabled ? false : true;
            if (platform.platform_id === "epic") {
                externalAuthButton.style.display = "inline-block";
                externalAuthButton.dataset.id = "auth_eos";
            }
        }
    };


    platformContainer.appendChild(btn);
});

// Track auth button
externalAuthButton.onclick = () => {
    const platformId = externalAuthButton.dataset.id;
    if (!platformId) return; // Safety check

    const currentOrigin = window.location.origin;
    const redirectUri = encodeURIComponent(`${currentOrigin}/auth_redirect`);
    const clientId = "xyza7891Jjdyme00ogto6B3lg0guwyZV";
    const authUrl = `https://www.epicgames.com/id/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=basic_profile&state=${platformId}`;
    window.location.href = authUrl;
};



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
        const response = await fetch(`${config.apiBaseUrl}/id?username=${username}&platform=${selectedPlatform.platform_id}`);

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
