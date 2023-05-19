export const getBackgroundStyles = (background) => {
    const useUrl = background.current === 'image';
    const backgroundValue = useUrl ? `url(${background[background.current]})` : background[background.current];

    return {
        [`--background-${background.current}`]: backgroundValue,
    };
};