import {
    filterHiddenPages
} from '@zyro-inc/site-modules/utils/filterHiddenPages';
import {
    getIsInPreviewMode
} from '@zyro-inc/site-modules/utils/getIsInPreviewMode';

export const fetchSiteData = async () => {
    const currentDate = new Date().setHours(0, 0, 0, 0);

    if (
        import.meta.env.DEV) {
        const playgroundSiteData = await
        import ('@zyro-inc/site-modules/templates/playground.json');

        return {
            ...playgroundSiteData,
            languages: filterHiddenPages(playgroundSiteData.languages, currentDate),
        };
    }

    if (getIsInPreviewMode()) return null;

    const response = await fetch(`${window.location.origin}/data.json`);
    const siteData = await response.json();

    return {
        ...siteData,
        languages: filterHiddenPages(siteData.languages, currentDate),
    };
};