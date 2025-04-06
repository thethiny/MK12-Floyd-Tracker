window.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state") || "";

    const heading = document.getElementById("auth-heading");
    const message = document.getElementById("auth-message");
    const errorMessage = document.getElementById("error-message");

    heading.textContent = "Validating Connection...";
    message.textContent = "Requesting user info from WB Network...";

    if (!code || !state) {
        message.textContent = "Authorization failed.";
        errorMessage.textContent = "Missing authorization code or state.";
        errorMessage.classList.remove("hidden");
        return;
    }

    try {
        const response = await fetch(`${config.apiBaseUrl}/id?username=${encodeURIComponent(code)}&platform=${encodeURIComponent(state)}`);

        if (response.status === 503) {
            message.textContent = "Server under maintenance.";
            errorMessage.textContent = "Please try again soon!";
            errorMessage.classList.remove("hidden");
            return;
        }

        const data = await response.json();

        if (response.ok) {
            const username = data.username; // Assume backend /id returns { username: "...", user_id: "..." }
            const userId = data.user_id;
            const platform = data.platform;

            addHistory(username, state, platform, userId); // Store in history

            window.location.href = `/floyd?username=${encodeURIComponent(username)}&platform=${encodeURIComponent(platform)}&user_id=${encodeURIComponent(userId)}`;
        } else {
            message.textContent = "Authentication failed.";
            errorMessage.textContent = `Error: ${data.error || "Unknown error."}`;
            errorMessage.classList.remove("hidden");
        }
    } catch (error) {
        message.textContent = "Authentication failed.";
        errorMessage.textContent = "Request failed! Please contact thethiny to fix.";
        errorMessage.classList.remove("hidden");
        console.error(error);
    }
});
