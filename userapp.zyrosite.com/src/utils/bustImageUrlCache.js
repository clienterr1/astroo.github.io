export const bustImageUrlCache = (imageURL) => {
    if (typeof imageURL !== 'string' || imageURL.startsWith('data')) {
        return imageURL;
    }

    try {
        const bustedImageURL = new URL(imageURL);

        bustedImageURL.searchParams.set(
            'no-cache',
            String(Date.now()),
        );

        return bustedImageURL.toString();
    } catch (error) {
        return imageURL;
    }
};