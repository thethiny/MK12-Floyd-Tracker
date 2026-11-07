// Navigation links configuration
const navLinks = [
    { text: 'Main Menu', href: '/' },
    { text: 'Challenges', href: '/clues' },
    { text: 'FAQs', href: '/faqs' },
    { text: 'Google Spreadsheet', href: 'https://thethiny.com/floydsheet', target: '_blank' },
];

// Create and initialize the header
function createNavbar() {
    const header = document.createElement('header');
    header.className = 'site-header';

    const brand = document.createElement('a');
    brand.className = 'brand';
    brand.href = '/';
    brand.innerHTML = '<img src="/assets/PinkFloyd-Square.png" alt=""><span>Floyd Tracker</span>';

    const menuButton = document.createElement('button');
    menuButton.className = 'menu-button';
    menuButton.setAttribute('aria-label', 'Toggle navigation');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.innerHTML = '<span></span><span></span><span></span>';

    const nav = document.createElement('nav');
    nav.className = 'nav-links';

    const currentPath = window.location.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';
    navLinks.forEach(link => {
        const anchor = document.createElement('a');
        anchor.href = link.href;
        anchor.className = 'nav-link';
        anchor.textContent = link.text;
        if (link.target) {
            anchor.target = link.target;
        }
        if (link.href === currentPath || (link.href === '/' && currentPath === '/index')) {
            anchor.classList.add('active');
        }
        nav.appendChild(anchor);
    });

    menuButton.addEventListener('click', () => {
        const open = header.classList.toggle('menu-open');
        menuButton.setAttribute('aria-expanded', open);
    });

    header.append(brand, menuButton, nav);
    document.body.insertBefore(header, document.body.firstChild);
}

// Initialize navbar when DOM is loaded
document.addEventListener('DOMContentLoaded', createNavbar);
