import {
    BLOCK_HEADER_CLASS,
    BLOCK_HEADER_STICKY_CLASS,
} from '@zyro-inc/site-modules/constants';

export const scrollToSection = (linkToSection, isInstant = false) => {
    const elementTop = document.querySelector(linkToSection) ? .getBoundingClientRect().top;

    // If section is not found, do not scroll.
    if (!elementTop) {
        return;
    }

    // Fallback to 0 when all navigation items are hidden and header is not visible
    const headerHeight = document.querySelector(`.${BLOCK_HEADER_CLASS}`) ? .offsetHeight || 0;
    const isHeaderSticky = document.querySelector(`.${BLOCK_HEADER_STICKY_CLASS}`);

    window.scrollBy({
        top: isHeaderSticky ? elementTop - headerHeight : elementTop,
        behavior: isInstant ? 'instant' : 'smooth',
    });
};