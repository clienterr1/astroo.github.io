import {
    useIsWindowBeingResized
} from '@/use/useIsWindowResizing';
import {
    ref
} from 'vue';
import {
    DATA_ATTRIBUTE_ELEMENT_ID
} from '@zyro-inc/site-modules/constants';

const triggerCallbacks = {};

// Active element is the one that is being resized or dragged by user but in this context
// we are only concerned with elements that are being resized.
const isParentElementActive = (elementId) => !!document.querySelector(
    `[${DATA_ATTRIBUTE_ELEMENT_ID}="${elementId}"].layout-element--is-active`,
);

// Current element is the one that is being edited by user.
const isCurrentElement = (elementId) => !!document.querySelector(`[${DATA_ATTRIBUTE_ELEMENT_ID}="${elementId}"].is-highlighted`);

const resizeObserverInstance = ref(new ResizeObserver((entries) => {
    const {
        isWindowResizing
    } = useIsWindowBeingResized();

    if (isWindowResizing.value) return;

    entries.forEach((entry) => {
        const elementId = entry.target.getAttribute('data-element-ref');

        // This helps to reduce scope to only elements that resize based on their content.
        if (isParentElementActive(elementId) || !isCurrentElement(elementId)) return;

        if (triggerCallbacks[elementId]) triggerCallbacks[elementId]();
    });
}));

export const useLayoutElementResizeObserver = () => {
    const observeLayoutElement = ({
        htmlElement,
        elementId,
        triggerCallback,
    }) => {
        if (!htmlElement) return;

        // LayoutElement is just a wrapper around the actual component thus we need to observe
        // the subject of resize - component itself.
        const layoutElementComponent = htmlElement.querySelector('.layout-element__component');

        if (triggerCallbacks[elementId] || !layoutElementComponent) return;

        triggerCallbacks[elementId] = triggerCallback;

        resizeObserverInstance.value.observe(layoutElementComponent);
    };

    const unobserveLayoutElement = ({
        htmlElement,
        elementId,
    }) => {
        if (!triggerCallbacks[elementId] || !htmlElement) return;
        resizeObserverInstance.value.unobserve(htmlElement);

        delete triggerCallbacks[elementId];
    };

    return {
        observeLayoutElement,
        unobserveLayoutElement,
    };
};