const BLOCK_ECOMMERCE_FONT_STYLE_TYPES = [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'body-large',
    'body',
];

export default function setCustomTextStyleVariables(property, value) {
    return BLOCK_ECOMMERCE_FONT_STYLE_TYPES.reduce((accumulator, tag) => ({
        ...accumulator,
        [`${tag}-${property}`]: value,
    }), {});
}