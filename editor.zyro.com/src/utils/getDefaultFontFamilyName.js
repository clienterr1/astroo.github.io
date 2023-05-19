/**
 * Gets default font family name and removes commas and quotes
 * @param {siteStyles} object
 * @param {isPrimaryFont} boolean
 */
export const getDefaultFontFamilyName = (siteStyles, isPrimaryFont) => {
    const defaultFontFamily = isPrimaryFont ? siteStyles.font.primary : siteStyles.font.secondary;

    return defaultFontFamily.split(',')[0].replace(/["']+/g, '');
};