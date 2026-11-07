// Local and LAN hosts use the dev backend on the same machine, everything else uses production
const isLocalNetwork = /^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(window.location.hostname);

const config = {
    apiBaseUrl: isLocalNetwork ? `http://${window.location.hostname}:8080` : "https://thethiny.com/mk12/floyd"
};
