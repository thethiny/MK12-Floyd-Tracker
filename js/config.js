const isLocalhost = ["localhost", "127.0.0.1"].some(host => window.location.hostname.includes(host));

const config = {
    apiBaseUrl: isLocalhost ? "http://localhost:8080" : "https://thethiny.xyz/mk12/floyd"
};
