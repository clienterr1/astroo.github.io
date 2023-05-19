import {
    ref
} from 'vue';

const refs = ref({});

export const isScrolledIntoView = (elRef) => {
    if (!elRef) {
        return false;
    }

    const {
        top,
        bottom,
    } = elRef.getBoundingClientRect();

    const isVisible = top < window.innerHeight && bottom >= 0;

    return isVisible;
};

export const useElementsRefs = () => {
    const isElementVisibleOnScreen = (elementId) => isScrolledIntoView(refs.value[elementId]);

    return {
        refs,
        isElementVisibleOnScreen,
    };
};