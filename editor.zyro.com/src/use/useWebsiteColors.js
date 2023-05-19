import {
    computed
} from 'vue';
import {
    useStore
} from 'vuex';
import get from 'lodash.get';
import set from 'lodash.set';
import tinycolor from 'tinycolor2';
import {
    rehype
} from 'rehype';
import {
    visit
} from 'unist-util-visit';
import styleToObject from 'style-to-object';
import groupBy from 'lodash.groupby';

import {
    REHYPE_SETTINGS
} from '@zyro-inc/site-modules/constants/rehypeSettings';

import {
    COLOR_PATHS_FROM_HTML_CONTENT,
    COLORS_PATHS_BLOCKS,
    COLORS_PATHS_ELEMENTS,
} from '@/data';

/**
 * Converts colors to RGB.
 *
 * @param {string} color Color in any format
 * @return {string} Color in RGB format
 */
export const getColorValue = (color) => tinycolor(color).toRgbString();

const parseInlineStyles = () => (tree, file) => {
    // Rehype requires directly mutating the file parameter
    // eslint-disable-next-line no-param-reassign
    file.data.styles = [];

    visit(tree, 'element', (node) => {
        if (node.properties ? .style) {
            try {
                // eslint-disable-next-line no-param-reassign
                file.data.styles = [
                    ...file.data.styles,
                    styleToObject(node.properties ? .style),
                ];
            } catch (error) {
                console.error(error);
            }
        }
    });
};

/**
 * @param {string} html
 * @return {string[]} Color values used in the HTML
 */
export const getColorsFromHTML = (html) => {
    const {
        data
    } = rehype()
        .data('settings', REHYPE_SETTINGS)
        .use(parseInlineStyles)
        .processSync(html);

    return data.styles
        .map((style) => style ? .color)
        .filter((color) => color !== undefined);
};

/**
 * @param {string} locale
 * @param {string} blockId
 * @param {Object} blockData
 * @return {Object[]} Path and value objects of colors used in the block properties
 */
export const getBlockColorPaths = (locale, blockId, blockData) => {
    const blockColorPaths = COLORS_PATHS_BLOCKS[blockData.type] ? .paths;

    if (!blockColorPaths) {
        return [];
    }

    return blockColorPaths.map((blockColorPath) => {
        const blockColorValue = get(blockData, blockColorPath);

        if (!blockColorValue) {
            return null;
        }

        return {
            path: `${locale}.blocks.${blockId}.${blockColorPath}`,
            value: blockColorValue,
        };
    }).filter((blockColorPathValue) => blockColorPathValue !== null);
};

/**
 * @param {string} locale
 * @param {string} elementId
 * @param {Object} elementData
 * @return {Object[]} Path and value objects of colors used in the element properties
 */
export const getElementColorPaths = (locale, elementId, elementData) => {
    const elementColorPaths = COLORS_PATHS_ELEMENTS[elementData.type] ? .paths;

    if (!elementColorPaths) {
        return [];
    }

    return elementColorPaths.map((elementColorPath) => {
        const elementColorValue = get(elementData, elementColorPath);

        if (!elementColorValue) {
            return null;
        }

        return {
            path: `${locale}.elements.${elementId}.${elementColorPath}`,
            value: elementColorValue,
        };
    }).filter((elementColorPathValue) => elementColorPathValue !== null);
};

/**
 * @param {string} locale
 * @param {string} elementId
 * @param {Object} elementData
 * @return {Object[]} Path and value objects of colors used in the element HTML
 */
export const getElementHTMLColorPaths = (locale, elementId, elementData) => {
    const elementHTMLColorPath = COLOR_PATHS_FROM_HTML_CONTENT[elementData.type] ? .path;

    if (!elementHTMLColorPath) {
        return [];
    }

    const elementHTMLColorValues = getColorsFromHTML(get(elementData, elementHTMLColorPath));

    return elementHTMLColorValues.map((colorValue) => ({
        htmlPath: `${locale}.elements.${elementId}.${elementHTMLColorPath}`,
        value: colorValue,
    }));
};

/**
 * @param {Object} languages
 * @returns {Object[]} Path and value objects of colors used in blocks and elements
 */
export const getUsedColorPaths = (languages) => Object.entries(languages).flatMap(([
    locale,
    {
        elements,
        blocks,
    },
]) => {
    const blockColorPaths = Object.entries(blocks)
        .flatMap(([blockId, blockData]) => getBlockColorPaths(locale, blockId, blockData));

    const elementColorPaths = Object.entries(elements)
        .flatMap(([elementId, elementData]) => [
            ...getElementColorPaths(locale, elementId, elementData),
            ...getElementHTMLColorPaths(locale, elementId, elementData),
        ]);

    return [
        ...blockColorPaths,
        ...elementColorPaths,
    ];
});

/**
 * @param {Object} languages
 * @return {string[]} Color values used in the site
 */
export const getUsedColors = (languages) => getUsedColorPaths(languages).map(({
    value
}) => value);

const replaceStyle = ({
    pattern,
    replacement,
}) => (tree) => {
    visit(tree, 'element', (node) => {
        if (node.properties ? .style) {
            // This is recommended approach by the library author.
            // Immulably returning modified node might be expensive on large HTML
            // eslint-disable-next-line no-param-reassign
            node.properties.style = node.properties.style.replaceAll(pattern, replacement);
        }
    });
};

/**
 * Replaces color values in blocks/elements. Handles properties and HTML content
 *
 * @param {Object} languages
 * @param {string} oldColor
 * @param {string} newColor
 * @returns {Object} Languages with the colors replaced
 */
export const updateColor = (languages, oldColor, newColor) => getUsedColorPaths(languages)
    // Filter paths which use oldColor
    .filter((color) => {
        if (color.path) {
            return get(languages, color.path) === oldColor;
        }

        if (color.htmlPath) {
            return getColorsFromHTML(get(languages, color.htmlPath)).includes(oldColor);
        }

        return false;
    })
    // Iterate over paths and replace oldColor with newColor
    .reduce((languagesUpdatedColors, color) => {
        if (color.path) {
            return set(languagesUpdatedColors, color.path, newColor);
        }

        if (color.htmlPath) {
            const updatedHTML = rehype()
                .data('settings', REHYPE_SETTINGS)
                .use(replaceStyle, {
                    pattern: oldColor,
                    replacement: newColor,
                })
                .processSync(get(languagesUpdatedColors, color.htmlPath))
                .toString();

            return set(languagesUpdatedColors, color.htmlPath, updatedHTML);
        }

        return languagesUpdatedColors;
    }, languages);

export const useWebsiteColors = () => {
    const {
        getters
    } = useStore();

    // We don't want to show system language if multilanguage is enabled
    const siteLanguages = computed(() => {
        if (Object.keys(getters.siteLanguages).length === 1) {
            return getters.siteLanguages;
        }

        const {
            system,
            ...languages
        } = getters.siteLanguages;

        return languages;
    });

    const usedColors = computed(() => getUsedColorPaths(siteLanguages.value));

    const groupedUsedColors = computed(() => groupBy(usedColors.value, ({
        value
    }) => value));

    const usedColorCounts = computed(() => Object.fromEntries(Object.entries(groupedUsedColors.value)
        .map(([color, colorUses]) => [
            color,
            colorUses.length,
        ])));

    const mostUsedColors = computed(() => Object.fromEntries(
        Object.entries(usedColorCounts.value)
        .filter(([colorValue]) => colorValue !== 'transparent')
        .sort((colorA, colorB) => colorB[1] - colorA[1]),
    ));

    return {
        getColorValue,
        mostUsedColors,
        updateColor,
    };
};