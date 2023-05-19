import {
    getFileNameFromURL
} from '@zyro-inc/site-modules/utils/modifyString';

import {
    lastDotInStringRegExp,
    unsplashImageApiRegExp,
    zyroImageApiRegExp,
} from '@/utils/globalRegExp';

export const getImagePathOrigin = (src) => {
    if (src.startsWith(
            import.meta.env.VITE_ASSETS_ORIGIN)) {
        return {
            origin: 'assets',
            path: getFileNameFromURL(src),
        };
    }

    if (src.startsWith('https://images.unsplash.com')) {
        return {
            origin: 'unsplash',
            path: getFileNameFromURL(src),
        };
    }

    return {
        origin: 'other',
        path: src,
    };
};

export const getResponsiveImages = (image) => {
    if (unsplashImageApiRegExp.test(image)) {
        const imageUrl = new URL(image);
        const imageUrlParameters = imageUrl.searchParams;

        // Handle old unsplash url links.
        //  One of params that old url always have - &w=1080
        //  Delete unneeded and add needed params
        //  Remove this from client after handling it with mapper
        if (imageUrlParameters.get('w') === '1080') {
            imageUrlParameters.delete('fm');
            imageUrlParameters.delete('crop');
            imageUrlParameters.delete('fit');
            imageUrlParameters.delete('cs');
            imageUrlParameters.set('q', '70');
            imageUrlParameters.set('auto', 'format');
        }

        // Delete default width
        imageUrlParameters.delete('w');

        const preparedUrl = imageUrl.toString();

        return {
            image400: `${preparedUrl}&w=400`,
            image500: `${preparedUrl}&w=500`,
            image800: `${preparedUrl}&w=800`,
            image1370: `${preparedUrl}&w=1370`,
        };
    }

    // Handle our api optimize capable images
    //  Optimize capable are all our API images, except those that have /_SITE-ASSETS/ in their url
    //  Url splitting:
    //  "assets.zyrosite.com/id/name.format" => ["assets.zyro.com/id/name", "format"]
    //  Responsive image (400px width) url format - assets.zyro.com/id/name-w400.format
    if (zyroImageApiRegExp.test(image) && !/\/_SITE-ASSETS\//.test(image)) {
        const [urlPrefix, format] = image.split(lastDotInStringRegExp);

        return {
            image400: `${urlPrefix}-w400.${format}`,
            image500: `${urlPrefix}-w500.${format}`,
            image800: `${urlPrefix}-w800.${format}`,
            image1370: `${urlPrefix}-w1370.${format}`,
        };
    }

    return {
        image,
    };
};