// Navigation links configuration
const navLinks = [
    { text: 'Main Menu', href: '/' },
    { text: 'FAQs', href: '/faqs' },
    { text: 'Challenges', href: '/clues' },
    { text: 'Google Spreadsheet', href: 'https://thethiny.xyz/floydsheet', target: '_blank' },
];

// Create and initialize the navbar
function createNavbar() {
    const navbar = document.createElement('nav');
    navbar.className = 'navbar';

    // Create hamburger button
    const hamburger = document.createElement('button');
    hamburger.className = 'hamburger';
    hamburger.setAttribute('aria-label', 'Toggle navigation');

    let link = navLinks.shift(); // Remove first element
    const mainMenuNav = document.createElement("a");
    mainMenuNav.href = link.href;
    mainMenuNav.className = 'nav-link';
    mainMenuNav.textContent = link.text;
    

    // Add hamburger spans
    for (let i = 0; i < 3; i++) {
        const span = document.createElement('span');
        hamburger.appendChild(span);
    }

    // Create nav links container
    const navLinksContainer = document.createElement('div');
    navLinksContainer.className = 'nav-links';

    // Create navigation links
    navLinks.forEach(link => {
        const anchor = document.createElement('a');
        anchor.href = link.href;
        anchor.className = 'nav-link';
        anchor.textContent = link.text;
        if (link.target) {
            anchor.target = link.target;
        }
        navLinksContainer.appendChild(anchor);
    });

    // Add elements to navbar
    navbar.appendChild(hamburger);
    navbar.appendChild(mainMenuNav);
    navbar.appendChild(navLinksContainer);

    // Add click event for hamburger menu
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinksContainer.classList.toggle('active');
    });

    // Insert navbar at the start of the body
    document.body.insertBefore(navbar, document.body.firstChild);
}

// Initialize navbar when DOM is loaded
document.addEventListener('DOMContentLoaded', createNavbar);