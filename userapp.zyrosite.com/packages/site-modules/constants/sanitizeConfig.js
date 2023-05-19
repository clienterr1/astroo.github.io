export const META_TAG = 'meta';
export const SCRIPT_TAG = 'script';
export const NOSCRIPT_TAG = 'noscript';
export const STYLE_TAG = 'style';
export const LINK_TAG = 'link';
export const IFRAME_TAG = 'iframe';
export const DIV_TAG = 'div';

export const ALLOWED_TAG_NAMES = [
    META_TAG,
    SCRIPT_TAG,
    NOSCRIPT_TAG,
    STYLE_TAG,
    LINK_TAG,
    IFRAME_TAG,
    DIV_TAG,
];

export const SANITIZE_SCHEMA = {
    tagNames: ALLOWED_TAG_NAMES,
    strip: [],
    clobber: [],
    attributes: {
        '*': [
            'id',
            'type',
            'data*',
            'media',
            'src',
        ],
        [META_TAG]: [
            'content',
            'name',
            'charset',
            'property',
        ],
        [SCRIPT_TAG]: [
            'async',
            'charset',
            'crossorigin',
            'defer',
            'integrity',
            'sp-form-id',
        ],
        [LINK_TAG]: [
            'href',
            'hreflang',
            'rel',
        ],
        [DIV_TAG]: [
            'class',
            'className',
        ],
    },
};