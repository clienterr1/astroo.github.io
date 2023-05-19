import slugify from 'slugify';

import {
    VALID_DOMAIN_REG_EXP,
    VALIDATE_EMAIL_REG_EXP,
    VALIDATE_LINK_REG_EXP,
    LINK_PARSE_REG_EXP,
    VALIDATE_PHONE_NUMBER_REG_EXP,
} from '@zyro-inc/site-modules/constants/regex';

import {
    generateRandomId
} from '@/utils/generateRandomId';

export const isValidDomain = (domain) => domain ? .length >= 4 && VALID_DOMAIN_REG_EXP.test(domain);

export const stripUrl = (url = '') => {
    let decodedUrl = decodeURI(url).trim();
    const replaceValues = [
        /\s/g,
        /^tel:/,
        /^mailto:/,
    ];

    replaceValues.forEach((value) => {
        decodedUrl = decodedUrl.replace(value, '');
    });

    return decodedUrl;
};

export const isEmailValid = (email) => VALIDATE_EMAIL_REG_EXP.test(email);

// Validate email
export const getValidEmail = (url = '') => {
    const link = stripUrl(url);

    if (isEmailValid(link)) {
        return {
            url: `mailto:${link}`,
            isUrlValid: true,
        };
    }

    return {
        url,
        isUrlValid: false,
    };
};

export const getValidPhoneNumber = (url = '') => {
    const link = stripUrl(url);

    if (VALIDATE_PHONE_NUMBER_REG_EXP.test(link)) {
        return {
            url: `tel:${link}`,
            isUrlValid: true,
        };
    }

    return {
        url,
        isUrlValid: false,
    };
};

export const isUrlValid = (url = '') => VALIDATE_LINK_REG_EXP.test(url);

// Validated page URL
export const getValidUrl = (url = '', generateUrlWithHttp = false) => {
    // URL is empty or just a combination of letters and numbers
    if (!url || /^[\dA-Za-z]+$/.test(url)) {
        return {
            url,
            isUrlValid: false,
        };
    }

    if (url[0] === '#') {
        return {
            url,
            isUrlValid: true,
        };
    }

    if (getValidEmail(url).isUrlValid) {
        return {
            url,
            isUrlValid: false,
        };
    }

    const urlHasProtocol = /^(http:\/\/|https:\/\/)/.test(url);
    const protocolPrefix = generateUrlWithHttp ? 'http://' : 'https://';
    const validUrl = new URL(urlHasProtocol ? url : `${protocolPrefix}${url}`);
    const link = validUrl.pathname === '/' ? validUrl.origin : validUrl.href;
    const linkRegexMatch = link.match(LINK_PARSE_REG_EXP);
    const linkPrefix = linkRegexMatch[1];

    if ([
            'http://',
            'https://',
        ].includes(linkPrefix) && isUrlValid(link)) {
        return {
            url: link,
            isUrlValid: isUrlValid(link),
        };
    }

    return {
        url,
        isUrlValid: false,
    };
};

// Get valid page path. Disallow multi-level paths. Allow only `/some-path` pattern
export const slugifyPagePath = (url = '') => ({
    path: slugify(url, {
        lower: true,
        strict: true,
        trim: false,
    }),
    isPathValid: true,
});

export const getValidPagePath = (path) => {
    // If given path is empty, return it as is
    if (!path) {
        return {
            path,
            isPathValid: true,
        };
    }

    const {
        path: slugifiedPath
    } = slugifyPagePath(path);
    const validPagePath = slugifiedPath || generateRandomId();

    return {
        path: validPagePath,
        isPathValid: true,
    };
};

// Get valid anchor. Allows only some-id pattern
export const getValidHtmlId = (htmlId = '') => {
    const formattedHtmlId = htmlId
        .replace(/[^\d a-z-]/gi, '') // trim all not allowed chars
        .replace(/^[\W\d]+/, '') // removes digits from start of string
        .replace(/\s/g, '-') // replace every space with '-'
        .toLowerCase();

    return {
        htmlId: formattedHtmlId,
        isUrlValid: true,
    };
};

// Validate phone number
export const getValidPhone = (url = '') => {
    const link = stripUrl(url);

    if (link && VALIDATE_PHONE_NUMBER_REG_EXP.test(link)) {
        return {
            url: `tel:${link}`,
            isUrlValid: true,
        };
    }

    return {
        url,
        isUrlValid: false,
    };
};

// Convert google map address to URL
export const addressToGoogleMapUrl = (address = '') => (
    address ?
    `https://maps.google.com/maps?q=${encodeURI(address)}&t=m&z=13&ie=UTF8&output=embed` :
    '');

// Convert google map URL to address
export const googleMapUrlToAddress = (url = '') => (url ? decodeURI(url.split('?q=')[1].split('&t=')[0]) : '');

// Creates page URL
export const getPageUrl = (url = '') => (url ? `/${url
	.replace(/\s+/g, '-')
	.replace(/(^\/|-$)/g, '')
	.toLowerCase()
	.replace(/[^\w\s-/]/gi, '')}` : '');

export const getNonRelativeUrl = (url = '') => {
    if (url) {
        return `${url.startsWith('http') ? '' : '//'}${url}`;
    }

    return url;
};