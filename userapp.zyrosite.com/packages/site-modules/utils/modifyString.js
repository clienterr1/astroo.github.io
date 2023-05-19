import {
    INTERNAL_LINK_WITHOUT_QUERY_OR_HASH
} from '@zyro-inc/site-modules/constants/regex';

export const capitalizeFirstLetter = (string) => {
    if (typeof string !== 'string') {
        return '';
    }

    return string.charAt(0).toUpperCase() + string.slice(1);
};

export const getExtension = (path) => {
    const basename = path.split(/[/\\]/).pop();
    const position = basename.lastIndexOf('.');

    if (basename === '' || position < 1) {
        return '';
    }

    return basename.slice(position + 1).toLowerCase();
};

export const getFileNameFromURL = (url) => url.replace(/^.*[/\\]/, '').split('?')[0];

export const getInternalLinkWithoutQueryOrHash = (href) => href ? .match(INTERNAL_LINK_WITHOUT_QUERY_OR_HASH) ? .[0];