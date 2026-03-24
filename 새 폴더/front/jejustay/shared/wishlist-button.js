(function initJejuWishlistButton(global) {
    'use strict';

    const BOUND_BUTTONS = new WeakSet();
    const CARD_SELECTOR = '.hotel-card-horizontal, .hotel-card-premium, .hotel-card, .activity-card';
    const PLACEHOLDER_SELECTOR = '[data-jeju-wishlist-button]';
    const RESET_CLASS_DELAY = 460;
    const BUTTON_TEMPLATE = [
        '<span class="wishlist-btn__burst-layer" aria-hidden="true">',
        '<span class="wishlist-btn__burst wishlist-btn__burst--1"></span>',
        '<span class="wishlist-btn__burst wishlist-btn__burst--2"></span>',
        '<span class="wishlist-btn__burst wishlist-btn__burst--3"></span>',
        '<span class="wishlist-btn__burst wishlist-btn__burst--4"></span>',
        '</span>',
        '<span class="wishlist-btn__surface"></span>',
        '<span class="wishlist-btn__icon" aria-hidden="true">',
        '<svg viewBox="0 0 24 24" fill="none" role="presentation">',
        '<path d="M12 21s-6.716-4.351-9.193-8.223C.828 9.74 1.3 5.524 4.56 3.66c2.168-1.24 4.964-.906 6.94.818 1.976-1.724 4.772-2.058 6.94-.818 3.26 1.864 3.733 6.08 1.753 9.117C18.716 16.649 12 21 12 21Z"></path>',
        '</svg>',
        '</span>'
    ].join('');

    const escapeAttribute = (value) => {
        return String(value)
            .replaceAll('&', '&amp;')
            .replaceAll('"', '&quot;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll("'", '&#39;');
    };

    const syncAria = (button) => {
        button.setAttribute('aria-pressed', button.classList.contains('active') ? 'true' : 'false');
    };

    const collapseText = (value) => {
        return String(value ?? '').replace(/\s+/g, ' ').trim();
    };

    const normalizeWishlistId = (value) => {
        return collapseText(value);
    };

    const hashWishlistValue = (value) => {
        let hash = 0;
        for (const char of value) {
            hash = ((hash << 5) - hash) + char.charCodeAt(0);
            hash |= 0;
        }

        return `wish-${Math.abs(hash)}`;
    };

    const readText = (root, selectorList) => {
        for (const selector of selectorList) {
            const element = root.querySelector(selector);
            if (!element) {
                continue;
            }

            const clone = element.cloneNode(true);
            clone.querySelectorAll('svg, i, button').forEach((node) => node.remove());
            const text = collapseText(clone.textContent);
            if (text) {
                return text;
            }
        }

        return '';
    };

    const readImage = (root) => {
        const image = root.querySelector('img');
        return image?.getAttribute('src') || image?.src || '';
    };

    const readPrice = (root) => {
        const selectors = [
            '[data-wishlist-price]',
            '.price-final span',
            '.price-current',
            '.jeju-price',
            '.monthly-price span',
            '.monthly-price',
            '.wishlist-price'
        ];

        for (const selector of selectors) {
            const element = root.querySelector(selector);
            if (!element) {
                continue;
            }

            const text = collapseText(element.textContent);
            if (text) {
                return text;
            }
        }

        return '';
    };

    const extractWishlistItemFromButton = (button) => {
        if (!button || !button.closest) {
            return null;
        }

        const explicitId = normalizeWishlistId(button.dataset.wishlistId || button.dataset.id || button.dataset.itemId);
        const explicitName = collapseText(button.dataset.wishlistName);
        const explicitLocation = collapseText(button.dataset.wishlistLocation);
        const explicitImage = collapseText(button.dataset.wishlistImage);
        const explicitPrice = collapseText(button.dataset.wishlistPrice);

        const card = button.closest(CARD_SELECTOR);
        const root = card || button.parentElement || document.body;
        const name = explicitName || readText(root, ['.hotel-name', '.card-title', '.wishlist-title', 'h3']);
        const location = explicitLocation || readText(root, ['.hotel-location', '.hotel-location-text', '.location', '.card-meta .location', '.wishlist-location', 'p']);
        const image = explicitImage || readImage(root);
        const price = explicitPrice || readPrice(root);
        const resolvedId = explicitId || normalizeWishlistId(root?.getAttribute?.('data-wishlist-id'));
        const fallbackSeed = [name, location, image, price].filter(Boolean).join('|');
        const id = resolvedId || (fallbackSeed ? hashWishlistValue(fallbackSeed) : '');

        if (!id || !name) {
            return null;
        }

        return {
            id,
            name,
            location,
            image,
            price
        };
    };

    const ensureTemplate = (button) => {
        if (button.dataset.wishlistEnhanced === 'true') {
            syncAria(button);
            return button;
        }

        button.dataset.wishlistEnhanced = 'true';
        button.type = button.getAttribute('type') || 'button';
        button.innerHTML = BUTTON_TEMPLATE;
        syncAria(button);
        return button;
    };

    const collectPlaceholderAttributes = (placeholder) => {
        return Array.from(placeholder.attributes).reduce((attributes, attribute) => {
            if (
                attribute.name === 'data-jeju-wishlist-button'
                || attribute.name === 'data-aria-label'
                || attribute.name === 'data-active'
                || attribute.name === 'aria-label'
                || attribute.name === 'class'
                || attribute.name === 'type'
            ) {
                return attributes;
            }

            attributes[attribute.name] = attribute.value;
            return attributes;
        }, {});
    };

    const hydratePlaceholders = (root = document) => {
        const placeholders = Array.from(root.querySelectorAll(PLACEHOLDER_SELECTOR));

        placeholders.forEach((placeholder) => {
            const template = document.createElement('template');
            template.innerHTML = renderMarkup({
                active: placeholder.dataset.active === 'true',
                ariaLabel: collapseText(placeholder.dataset.ariaLabel) || '위시리스트 추가',
                attributes: collectPlaceholderAttributes(placeholder)
            });

            const button = template.content.firstElementChild;
            if (!button) {
                return;
            }

            placeholder.replaceWith(button);
        });
    };

    const clearMotionClasses = (button) => {
        if (button.dataset.wishlistResetTimer) {
            global.clearTimeout(Number(button.dataset.wishlistResetTimer));
            delete button.dataset.wishlistResetTimer;
        }

        button.classList.remove('is-pressing', 'is-releasing');
    };

    const prefersReducedMotion = () => {
        return global.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true;
    };

    const animateButton = (button, activating) => {
        clearMotionClasses(button);
        if (prefersReducedMotion()) {
            return;
        }

        button.classList.add('is-pressing');

        if (typeof button.animate === 'function') {
            button.animate(
                activating
                    ? [
                        { transform: 'translateY(0) scale(1)' },
                        { transform: 'translateY(0) scale(0.94)', offset: 0.2 },
                        { transform: 'translateY(-2px) scale(1.08)', offset: 0.56 },
                        { transform: 'translateY(0) scale(1)' }
                    ]
                    : [
                        { transform: 'translateY(0) scale(1)' },
                        { transform: 'translateY(0) scale(0.92)', offset: 0.26 },
                        { transform: 'translateY(0) scale(1.02)', offset: 0.58 },
                        { transform: 'translateY(0) scale(1)' }
                    ],
                {
                    duration: activating ? 620 : 360,
                    easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
                }
            );
        }

        const surface = button.querySelector('.wishlist-btn__surface');
        if (surface && typeof surface.animate === 'function') {
            surface.animate(
                activating
                    ? [
                        { transform: 'scale(1)' },
                        { transform: 'scale(0.88)', offset: 0.2 },
                        { transform: 'scale(1.04)', offset: 0.68 },
                        { transform: 'scale(1)' }
                    ]
                    : [
                        { transform: 'scale(1)' },
                        { transform: 'scale(0.9)', offset: 0.28 },
                        { transform: 'scale(1)' }
                    ],
                {
                    duration: activating ? 500 : 320,
                    easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
                }
            );
        }

        const burstElements = button.querySelectorAll('.wishlist-btn__burst');
        if (activating && burstElements.length > 0) {
            burstElements.forEach((burst, index) => {
                if (typeof burst.animate !== 'function') {
                    return;
                }

                burst.animate(
                    [
                        { opacity: 0, transform: 'translate(-50%, -50%) scale(0.2)' },
                        { opacity: 0.95, transform: 'translate(calc(-50% + (var(--burst-x) * 0.52)), calc(-50% + (var(--burst-y) * 0.52))) scale(1)', offset: 0.24 },
                        { opacity: 0, transform: 'translate(calc(-50% + var(--burst-x)), calc(-50% + var(--burst-y))) scale(0.72)' }
                    ],
                    {
                        delay: index * 18,
                        duration: 420,
                        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
                        fill: 'both'
                    }
                );
            });
        }

        const icon = button.querySelector('.wishlist-btn__icon');
        if (icon && typeof icon.animate === 'function') {
            icon.animate(
                activating
                    ? [
                        { transform: 'scale(1)' },
                        { transform: 'scale(0.78)', offset: 0.2 },
                        { transform: 'scale(1.06)', offset: 0.64 },
                        { transform: 'scale(1)' }
                    ]
                    : [
                        { transform: 'scale(1)' },
                        { transform: 'scale(0.88)', offset: 0.3 },
                        { transform: 'scale(1)' }
                    ],
                {
                    duration: activating ? 480 : 300,
                    easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
                }
            );
        }

        button.dataset.wishlistResetTimer = String(
            global.setTimeout(() => {
                button.classList.remove('is-pressing');
                button.classList.add('is-releasing');

                global.setTimeout(() => {
                    clearMotionClasses(button);
                }, 180);
            }, activating ? 240 : 160)
        );
    };

    const setActiveState = (button, active, { animate = true, force = false } = {}) => {
        ensureTemplate(button);

        const wasActive = button.classList.contains('active');
        if (!force && wasActive === active) {
            syncAria(button);
            return active;
        }

        button.classList.toggle('active', active);
        syncAria(button);

        if (animate) {
            animateButton(button, active);
        }

        return active;
    };

    const resolveButtonId = (button) => {
        const item = extractWishlistItemFromButton(button);
        return item ? item.id : button.dataset.id ?? button.dataset.itemId ?? '';
    };

    const inferActiveState = ({ button, id }) => {
        if (!global.FABState?.isInWishlist) {
            return button.classList.contains('active');
        }

        const wishlistId = id || resolveButtonId(button);
        return wishlistId ? global.FABState.isInWishlist(wishlistId) : button.classList.contains('active');
    };

    const init = ({
        selector = '.wishlist-btn',
        root = document,
        onToggle,
        isActive
    } = {}) => {
        hydratePlaceholders(root);
        const buttons = Array.from(root.querySelectorAll(selector));

        buttons.forEach((button) => {
            ensureTemplate(button);

            const resolveIsActive = typeof isActive === 'function' ? isActive : inferActiveState;
            if (typeof resolveIsActive === 'function') {
                setActiveState(button, Boolean(resolveIsActive({ button, id: resolveButtonId(button) })), {
                    animate: false,
                    force: true
                });
            }

            if (BOUND_BUTTONS.has(button)) {
                return;
            }

            BOUND_BUTTONS.add(button);
            button.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();

                const buttonId = resolveButtonId(button);
                const currentActive = inferActiveState({ button, id: buttonId });
                const nextActive = !currentActive;

                if (typeof onToggle === 'function') {
                    const result = onToggle({
                        button,
                        event,
                        id: buttonId,
                        isActive: currentActive,
                        nextActive
                    });

                    if (typeof result === 'boolean') {
                        setActiveState(button, result, { force: true });
                        return;
                    }

                    if (result && typeof result === 'object' && typeof result.active === 'boolean') {
                        setActiveState(button, result.active, { force: true });
                        return;
                    }
                }

                if (global.FABState?.addToWishlist) {
                    const item = extractWishlistItemFromButton(button);
                    if (item) {
                        setActiveState(button, nextActive);
                        global.FABState.addToWishlist(item);
                        return;
                    }
                }

                setActiveState(button, nextActive);
            });
        });

        return buttons;
    };

    const sync = ({
        selector = '.wishlist-btn',
        root = document,
        isActive
    } = {}) => {
        if (typeof isActive !== 'function') {
            return;
        }

        root.querySelectorAll(selector).forEach((button) => {
            setActiveState(button, Boolean(isActive({ button, id: resolveButtonId(button) })), {
                animate: false,
                force: true
            });
        });
    };

    const renderMarkup = ({
        active = false,
        ariaLabel = '위시리스트 추가',
        attributes = {}
    } = {}) => {
        const className = active ? 'wishlist-btn active' : 'wishlist-btn';
        const attributeEntries = Object.entries(attributes)
            .filter(([, value]) => value !== null && value !== undefined && value !== '')
            .map(([key, value]) => `${escapeAttribute(key)}="${escapeAttribute(value)}"`);

        return `<button class="${className}" type="button" aria-label="${escapeAttribute(ariaLabel)}" ${attributeEntries.join(' ')}>${BUTTON_TEMPLATE}</button>`;
    };

    global.JejuWishlistButton = Object.freeze({
        extractWishlistItem(button) {
            return extractWishlistItemFromButton(button);
        },
        hydrate(root = document) {
            hydratePlaceholders(root);
        },
        init,
        renderMarkup,
        setActive(button, active, options) {
            return setActiveState(button, active, options);
        },
        sync
    });

    if (!global.__JEJU_WISHLIST_SYNC_BOUND__) {
        global.__JEJU_WISHLIST_SYNC_BOUND__ = true;
        document.addEventListener('fabWishlistUpdated', () => {
            global.JejuWishlistButton?.sync({
                isActive: inferActiveState
            });
        });
    }
})(window);
