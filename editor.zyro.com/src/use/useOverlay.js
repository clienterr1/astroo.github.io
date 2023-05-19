import {
    ref
} from 'vue';

const isOverlayVisible = ref(false);
const highlightedElementCoordinates = ref(null);
const hideOverlayOnClick = ref(false);

export const useOverlay = () => {
    const resetHighlightedElement = () => {
        highlightedElementCoordinates.value = null;
    };

    const showOverlay = (hideOnClick = false) => {
        isOverlayVisible.value = true;
        hideOverlayOnClick.value = hideOnClick;
    };

    const hideOverlay = () => {
        isOverlayVisible.value = false;
        hideOverlayOnClick.value = false;

        resetHighlightedElement();
    };

    const setHighlightedElementCoordinates = ({
        x,
        y,
        width,
        height,
    }) => {
        highlightedElementCoordinates.value = {
            x,
            y,
            width,
            height,
        };
    };

    const setHighlightedElement = ({
        element
    } = {}) => {
        const {
            x,
            y,
            width,
            height,
        } = element.getBoundingClientRect();

        setHighlightedElementCoordinates({
            x,
            y,
            width,
            height,
        });
    };

    return {
        isOverlayVisible,
        highlightedElementCoordinates,
        showOverlay,
        hideOverlay,
        setHighlightedElement,
        setHighlightedElementCoordinates,
        resetHighlightedElement,
        hideOverlayOnClick,
    };
};