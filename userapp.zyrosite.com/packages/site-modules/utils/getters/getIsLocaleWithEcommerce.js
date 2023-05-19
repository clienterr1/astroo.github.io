import {
    BLOCKS_ECOMMERCE
} from '@zyro-inc/site-modules/constants/ecommerce';

export const blocksIncludeEcommerce = (blocks) => blocks && Object.values(blocks).some((block) => BLOCKS_ECOMMERCE.includes(block.type));
export const elementsIncludeEcommerce = (elements) => elements && Object.values(elements).some((value) => value ? .type === 'GridEcommerceButton');

export const getIsLocaleWithEcommerce = ({
    blocks,
    elements,
}) => elementsIncludeEcommerce(elements) || blocksIncludeEcommerce(blocks);

export const getIsSiteWithEcommerce = (siteData) => {
    // Get all blocks and elements from all locales

    const {
        blocks,
        elements,
    } = Object.values(siteData.languages).reduce((acc, language) => ({
        blocks: {
            ...acc.blocks,
            ...language.blocks,
        },
        elements: {
            ...acc.elements,
            ...language.elements,
        },
    }), {
        blocks: {},
        elements: {},
    });

    return elementsIncludeEcommerce(elements) || blocksIncludeEcommerce(blocks);
};