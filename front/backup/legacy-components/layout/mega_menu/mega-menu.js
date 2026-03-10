/**
 * Jeju Stay Premium Mega Menu JS
 * @author Ray (Cynical Genius Developer)
 */

let isMegaScrollBound = false;

const syncHeaderScrolledClass = () => {
    const header = document.querySelector('.header');
    if (!header) {
        return;
    }

    if (window.scrollY > 20) {
        header.classList.add('scrolled');
        return;
    }

    header.classList.remove('scrolled');
};

const bindScrollEffect = () => {
    if (isMegaScrollBound) {
        return;
    }

    isMegaScrollBound = true;
    window.addEventListener('scroll', syncHeaderScrolledClass);
    syncHeaderScrolledClass();
};

const bindDropdownHover = () => {
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach((item) => {
        if (item.dataset.megaHoverBound === 'true') {
            return;
        }

        const dropdown = item.querySelector('.mega-dropdown');
        if (!dropdown) {
            return;
        }

        item.dataset.megaHoverBound = 'true';

        item.addEventListener('mouseenter', () => {
            document.querySelectorAll('.mega-dropdown.active').forEach((activeDropdown) => {
                if (activeDropdown !== dropdown) {
                    activeDropdown.classList.remove('active');
                }
            });

            dropdown.classList.add('active');
        });

        item.addEventListener('mouseleave', () => {
            setTimeout(() => {
                if (!item.matches(':hover')) {
                    dropdown.classList.remove('active');
                }
            }, 200);
        });
    });
};

const bindPreviewHover = () => {
    const megaMenuItems = document.querySelectorAll('.mega-menu-item');

    megaMenuItems.forEach((menuItem) => {
        if (menuItem.dataset.previewHoverBound === 'true') {
            return;
        }

        menuItem.dataset.previewHoverBound = 'true';

        menuItem.addEventListener('mouseenter', () => {
            const dropdown = menuItem.closest('.mega-dropdown');
            const targetId = menuItem.getAttribute('data-preview');
            const targetImage = targetId ? document.getElementById(targetId) : null;

            if (!dropdown || !targetImage) {
                return;
            }

            dropdown.querySelectorAll('.preview-image').forEach((img) => {
                img.classList.remove('active');
            });

            targetImage.classList.add('active');

            const loader = dropdown.querySelector('.preview-loader');
            if (loader) {
                loader.style.display = 'none';
            }
        });
    });
};

const initInitialPreviewImage = () => {
    document.querySelectorAll('.mega-dropdown').forEach((dropdown) => {
        if (dropdown.dataset.previewInit === 'true') {
            return;
        }

        dropdown.dataset.previewInit = 'true';

        const firstImage = dropdown.querySelector('.preview-image');
        if (firstImage) {
            firstImage.classList.add('active');
        }
    });
};

function initMegaMenu() {
    bindScrollEffect();
    bindDropdownHover();
    bindPreviewHover();
    initInitialPreviewImage();
}

window.initMegaMenu = initMegaMenu;

document.addEventListener('DOMContentLoaded', initMegaMenu);
document.addEventListener('mainHeaderLoaded', initMegaMenu);