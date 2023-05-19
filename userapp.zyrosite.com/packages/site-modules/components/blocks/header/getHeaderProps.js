import {
    NAVIGATION_PAGE_TYPE,
    SYSTEM_LOCALE,
} from '@zyro-inc/site-modules/constants';
import {
    objectToCssVariables
} from '@zyro-inc/site-modules/utils/objectToCssVariables';
import {
    getBackgroundStyles
} from '@zyro-inc/site-modules/utils/getBackgroundStyles';
import {
    getIsLocaleWithEcommerce
} from '@zyro-inc/site-modules/utils/getters/getIsLocaleWithEcommerce';
import {
    getOptimizedSrc
} from '@zyro-inc/site-modules/utils/getSrcsets';
import {
    getImageSrc
} from '@zyro-inc/site-modules/utils/getImageSrc';
import {
    FULL_WIDTH
} from '@zyro-inc/site-modules/utils/getGridItemSize';

export const getHeaderProps = ({
    siteId,
    meta,
    blocks,
    nav,
    pages,
    elements,
    languageMetaTitle,
    languageSwitcherLanguages,
    currentLocale,
    currentPageId,
    isLogoOptimized,
    shoppingCartItems,
    ecwidCartItemCount,
    isOpen,
    getPagePathFromId,
    ecwidPages,
    devicePixelRatio = 1,
}) => {
    const {
        headerHeight,
        defaultLocale,
    } = meta;

    const {
        background,
        settings,
        fontWeight,
        fontFamily,
        navLinkTextColor,
        navLinkTextColorHover,
    } = blocks.header;

    const {
        imageOrigin,
        imagePath,
    } = background;

    const {
        cartText,
        isCartVisible,
        isLanguageSwitcherHidden,
        isSticky,
        logoPlacement,
        navigationPlacement,
        showLogo,
        styles,
        logoImageOrigin,
        logoImagePath,
        logoSvg,
    } = settings;

    const isLocaleWithEcwid = Object.keys(ecwidPages).length > 0;
    const isLocaleWithEcommerce = getIsLocaleWithEcommerce({
        blocks,
        elements,
    });

    const headerCSSVars = {
        ...objectToCssVariables(styles),
        ...getBackgroundStyles(background),
    };

    const getLogoSrc = () => {
        if (!isLogoOptimized) {
            return getImageSrc(logoImageOrigin, logoImagePath, siteId);
        }

        const logoWidth = Number.parseInt(styles['logo-width'], 10);

        return getOptimizedSrc(logoImageOrigin, logoImagePath, siteId, {
            width: devicePixelRatio * logoWidth,
        });
    };

    const getHeaderBackgroundImageUrl = () => getOptimizedSrc(imageOrigin, imagePath, siteId, {
        width: FULL_WIDTH,
    });

    const mapNavItem = (navItem) => {
        const {
            navItemId,
            linkType,
            linkedPageId,
            isHidden,
            rel,
            href,
            target,
            name,
            subItems = [],
        } = navItem;

        return {
            navItemId,
            hasDropdown: !!subItems.length,
            isCurrent: currentPageId === linkedPageId,
            subItems: subItems.map(mapNavItem),
            target,
            name: linkType === NAVIGATION_PAGE_TYPE ? pages[linkedPageId] ? .name : name,
            isHidden,
            rel,
            href: linkType === NAVIGATION_PAGE_TYPE ? getPagePathFromId({
                pageId: linkedPageId,
            }) : href,
            locale: currentLocale,
        };
    };

    const navItems = nav.filter(({
        isHidden
    }) => !isHidden).map(mapNavItem);

    const showCart = isCartVisible && (isLocaleWithEcwid || isLocaleWithEcommerce);

    const isLanguageSwitcherVisible = !!languageSwitcherLanguages.length &&
        !isLanguageSwitcherHidden &&
        currentLocale !== SYSTEM_LOCALE;

    const getCartItemsCount = () => {
        if (isLocaleWithEcommerce) {
            return shoppingCartItems.length;
        }

        if (!isCartVisible) {
            return 0;
        }

        return ecwidCartItemCount;
    };

    const getCartPath = () => {
        if (!ecwidPages || !Object.keys(ecwidPages).length) {
            return null;
        }

        // Select first ecwid page if it exists
        const [firstEcwidPageId] = Object.keys(ecwidPages);

        const firstEcwidPagePath = getPagePathFromId({
            pageId: firstEcwidPageId,
        });

        return `${firstEcwidPagePath}?store-page=cart`;
    };

    const siteName = languageMetaTitle || meta.metaTitle;

    return {
        background,
        backgroundColor: background.color,
        backgroundImageUrl: getHeaderBackgroundImageUrl(),
        backgroundColorContrast: styles.contrastBackgroundColor,
        cartText,
        cartIconSize: styles.cartIconSize,
        cartUrl: getCartPath(),
        currentLocale,
        height: headerHeight,
        fontFamily,
        navLinkTextColor,
        navLinkTextColorHover,
        fontWeight,
        isTransparent: background.isTransparent,
        items: navItems,
        isCartVisible: showCart,
        itemsInCart: getCartItemsCount(),
        isSticky,
        isLanguageSwitcherVisible,
        isLogoVisible: showLogo,
        isLogoOptimized,
        isOpen,
        languageSwitcherLanguages,
        logoHeight: blocks.header ? .desktop ? .logoHeight,
        logoHref: currentLocale !== defaultLocale && currentLocale !== SYSTEM_LOCALE ? `/${currentLocale}` : '/',
        logoHeightMobile: blocks.header ? .mobile ? .logoHeight,
        logoMaxWidth: styles['logo-width'],
        logoMaxWidthMobile: styles['m-logo-width'],
        logoObjectPosition: styles['logo-image-object-position'],
        logoObjectPositionMobile: styles['m-logo-image-object-position'],
        logoPlacement,
        logoPlacementMobile: settings['m-logoPlacement'] || logoPlacement,
        logoSrc: getLogoSrc(),
        logoSvg,
        style: headerCSSVars,
        siteName,

        // TODO: Rework after Layout presets iteration
        navigationPlacement,
        navigationPlacementMobile: settings['m-navigationPlacement'] || navigationPlacement,
    };
};