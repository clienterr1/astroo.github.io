import {
    UNSPLASH_QUALITY_SETTINGS
} from '@/constants';
import {
    getImagePathOrigin
} from '@zyro-inc/site-modules/utils/images';

export const mapUnsplashImageToSiteImage = ({
    image
}) => {
    const {
        alt_description: alt,
        urls,
    } = image;
    const {
        origin,
        path,
    } = getImagePathOrigin(`${urls.raw}${UNSPLASH_QUALITY_SETTINGS}`);

    return {
        alt,
        origin,
        path,
    };
};