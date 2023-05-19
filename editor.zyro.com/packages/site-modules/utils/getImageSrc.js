export const getImageSrc = (origin, path, siteId) => {
    if (!origin || !path) {
        return null;
    }

    if (origin === 'assets') {
        return `${import.meta.env.VITE_ASSETS_ORIGIN}/${siteId}/${path}`;
    }

    if (origin === 'unsplash') {
        return `https://images.unsplash.com/${path}`;
    }

    return path;
};