import {
    COLOR_LIGHT,
    COLOR_DARK,
} from '@/constants';

// https://stackoverflow.com/a/12043228/13622313
// Returns element contrasting color depending on its luma value.
// If color is bright, will return dark. If color is dark, will return bright.
export const getContrastColor = (currentColor) => {
    if (currentColor.includes(COLOR_DARK)) {
        return COLOR_LIGHT;
    }

    if (currentColor.includes(COLOR_LIGHT)) {
        return COLOR_DARK;
    }

    const colorWithoutHash = currentColor.slice(1); // strip #
    const fullColorHex = (colorWithoutHash.length !== 6) ?
        colorWithoutHash.repeat(2) : colorWithoutHash;
    const rgb = Number.parseInt(fullColorHex, 16); // convert rrggbb to decimal
    // eslint-disable-next-line no-bitwise
    const r = (rgb >> 16) & 0xFF; // extract red
    // eslint-disable-next-line no-bitwise
    const g = (rgb >> 8) & 0xFF; // extract green
    // eslint-disable-next-line no-bitwise
    const b = (Math.trunc(rgb)) & 0xFF; // extract blue

    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709

    return (luma >= 128) ? COLOR_DARK : COLOR_LIGHT;
};