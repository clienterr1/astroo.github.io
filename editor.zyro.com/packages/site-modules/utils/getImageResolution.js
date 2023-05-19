export const getImageResolution = async (imageSrc) => {
    const {
        naturalWidth,
        naturalHeight,
    } = await new Promise((resolve, reject) => {
        const image = new Image();

        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', () => reject());

        image.src = imageSrc;
    });

    return {
        naturalHeight,
        naturalWidth,
    };
};