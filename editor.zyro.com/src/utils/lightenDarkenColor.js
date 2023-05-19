/* eslint-disable no-bitwise */
export const lightenDarkenColor = (color, amount) => {
    // https://css-tricks.com/snippets/javascript/lighten-darken-color/
    let newColor = color;
    let usePound = false;

    if (newColor[0] === '#') {
        newColor = newColor.slice(1);
        newColor = newColor.length !== 6 ? newColor.repeat(2) : newColor;
        usePound = true;
    }

    const number = Number.parseInt(newColor, 16);

    let r = (number >> 16) + amount;

    if (r > 255) r = 255;
    else if (r < 0) r = 0;

    let b = ((number >> 8) & 0x00FF) + amount;

    if (b > 255) b = 255;
    else if (b < 0) b = 0;

    let g = (number & 0x0000FF) + amount;

    if (g > 255) g = 255;
    else if (g < 0) g = 0;

    return (usePound ? '#' : '') + (g | (b << 8) | (r << 16)).toString(16);
};