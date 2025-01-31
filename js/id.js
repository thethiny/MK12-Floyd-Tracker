const platformContainer = document.getElementById('platforms');
const platformDescription = document.getElementById('platform-description');
const selectedPlatformText = document.getElementById('selected-platform');
const errorMessage = document.getElementById('error-message');
const loadingOverlay = document.getElementById('loading');
const trackButton = document.getElementById('track');  // Track button element
let selectedPlatform = null;

platforms.forEach(platform => {
    const btn = document.createElement('button');
    btn.classList.add('platform-btn');
    btn.innerHTML = `<img src="${platform.logo}" alt="${platform.name}">`;

    // No need to disable the platform button; it should still be selectable.
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

document.getElementById('track').onclick = async () => {
    const username = document.getElementById('username').value.trim();
    if (!username || !selectedPlatform) return alert('Enter a username and select a platform');
    loadingOverlay.style.display = 'flex';
    try {
        const response = await fetch(`https://thethiny.xyz/mk12/floyd/id?username=${username}&platform=${selectedPlatform.platform_id}`);
        const data = await response.json();
        errorMessage.textContent = response.ok ? `User ID: ${data.user_id}` : `Error: ${data.error}`;
    } catch (error) {
        errorMessage.textContent = 'Request failed, check console.';
        console.error(error);
    } finally {
        loadingOverlay.style.display = 'none';
    }
};

// Add an event listener for the Enter key press to trigger the track button
document.getElementById('username').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent form submission or other default actions
        trackButton.click();  // Trigger the click event on the "Track!" button
    }
});
