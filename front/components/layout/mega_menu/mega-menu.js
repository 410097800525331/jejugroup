/**
 * Jeju Stay Premium Mega Menu JS
 * @author Ray (Cynical Genius Developer)
 */

document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header');
    const navItems = document.querySelectorAll('.nav-item');
    let closeTimeout = null;

    // 1. Header Scroll Interaction (Glassmorphism)
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Mega Menu Hover Logic with Delay
    navItems.forEach(item => {
        const dropdown = item.querySelector('.mega-dropdown');
        if (!dropdown) return;

        item.addEventListener('mouseenter', () => {
            if (closeTimeout) {
                clearTimeout(closeTimeout);
                closeTimeout = null;
            }
            // 모든 다른 드롭다운 닫기 (Zero Monolith: 필요한 로직만 수행)
            document.querySelectorAll('.mega-dropdown').forEach(d => {
                if (d !== dropdown) d.classList.remove('active');
            });
            dropdown.classList.add('active');
        });

        item.addEventListener('mouseleave', () => {
            // 의도치 않은 닫힘 방지를 위한 200ms 지연
            closeTimeout = setTimeout(() => {
                dropdown.classList.remove('active');
            }, 200);
        });
    });

    // 3. Image Preview Cross-fade Logic (Left menu hover -> Right image change)
    const megaMenuItems = document.querySelectorAll('.mega-menu-item');
    const previewImages = document.querySelectorAll('.preview-image');

    megaMenuItems.forEach(menuItem => {
        menuItem.addEventListener('mouseenter', () => {
            const dropdown = menuItem.closest('.mega-dropdown');
            const targetId = menuItem.getAttribute('data-preview');
            const targetImage = document.getElementById(targetId);

            if (targetImage && dropdown) {
                // 현재 드롭다운 내의 이미지만 비활성화 (전역 영향 방지)
                dropdown.querySelectorAll('.preview-image').forEach(img => img.classList.remove('active'));
                
                // 타겟 이미지 활성화
                targetImage.classList.add('active');

                // 로더 숨기기
                const loader = dropdown.querySelector('.preview-loader');
                if (loader) loader.style.display = 'none';
            }
        });
    });

    // 4. Initial Image Display (첫 번째 메뉴 이미지 미리 로드/표시)
    document.querySelectorAll('.mega-dropdown').forEach(dropdown => {
        const firstImage = dropdown.querySelector('.preview-image');
        if (firstImage) firstImage.classList.add('active');
    });
});
