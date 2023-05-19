import {
    addElementToHead
} from '@zyro-inc/site-modules/utils/addDomElements';
import {
    ELEMENT_DATA_ATTRIBUTE
} from '@zyro-inc/site-modules/constants';
import {
    constructTypographyStylesGoogleFontQuery
} from '@/utils/constructTypographyStylesGoogleFontQuery';
import mostPopularGoogleFonts from '@/assets/data/mostPopularGoogleFonts.json';

export const addGoogleFontQueryLinks = (query) => {
    const typographyStylesGoogleFontQuery = constructTypographyStylesGoogleFontQuery();
    const mostPopularGoogleFontsQuery = mostPopularGoogleFonts.items.map((item) => `family=${item.family.trim().replace(/ /g, '+')}:wght@300;400;500;700`).join('&');

    const usedFontLinkNode = {
        type: 'element',
        tagName: 'link',
        properties: {
            rel: 'stylesheet',
            href: `https://fonts.googleapis.com/css2?${query}&display=swap`,
            referrerpolicy: 'no-referrer',
            [ELEMENT_DATA_ATTRIBUTE]: 'googleapis-font-query',
        },
    };

    const popularFontsLinkNode = {
        type: 'element',
        tagName: 'link',
        properties: {
            rel: 'stylesheet',
            href: `https://fonts.googleapis.com/css2?${typographyStylesGoogleFontQuery}&${mostPopularGoogleFontsQuery}`,
            [ELEMENT_DATA_ATTRIBUTE]: 'googleapis-popular-font-query',
        },
    };

    addElementToHead(usedFontLinkNode);
    addElementToHead(popularFontsLinkNode);
};