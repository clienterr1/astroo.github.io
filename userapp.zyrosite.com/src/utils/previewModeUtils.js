import {
    getIsInIframe
} from '@zyro-inc/site-modules/utils/getIsInIframe';
import {
    getLayoutElementsPositionsInDom
} from '@/utils/getLayoutElementsPositionsInDom';
import {
    debounce
} from '@zyro-inc/site-modules/utils/debounce';
import {
    sendMessageToBuilder
} from '@/utils/sendMessageToBuilder';
import {
    UPDATE_ELEMENT_POSITIONS,
    UPDATE_SCROLL_POSITION,
    UPDATE_PREVIEW_PAGE_ID,
} from '@zyro-inc/site-modules/constants/messageEvents';
import {
    ELEMENT_TYPE_IMAGE,
    ELEMENT_TYPE_TEXT_BOX,
} from '@zyro-inc/site-modules/constants';

const TIMEOUT_MS_WINDOW_RESIZE_LISTENER = 100;

export const sendMessageUpdatePreviewPageId = ({
    currentPageId
}) => {
    if (!getIsInIframe()) {
        return;
    }

    sendMessageToBuilder({
        payload: {
            type: UPDATE_PREVIEW_PAGE_ID,
            payload: currentPageId,
        },
    });
};

export const sendMessageUpdateScrollPosition = () => {
    if (!getIsInIframe()) {
        return;
    }

    sendMessageToBuilder({
        payload: {
            type: UPDATE_SCROLL_POSITION,
            payload: {
                scrollY: window.scrollY,
                scrollX: window.scrollX,
            },
        },
    });
};

export const sendMessageUpdateElementsPositions = () => {
    if (!getIsInIframe()) {
        return;
    }

    sendMessageToBuilder({
        payload: {
            type: UPDATE_ELEMENT_POSITIONS,
            payload: getLayoutElementsPositionsInDom({
                elementTypes: [
                    ELEMENT_TYPE_TEXT_BOX,
                    ELEMENT_TYPE_IMAGE,
                ],
                shouldAccountForScrollPosition: true,
            }),
        },
    });
};

export const sendMessageUpdateElementsPositionsDebounced = debounce(sendMessageUpdateElementsPositions, TIMEOUT_MS_WINDOW_RESIZE_LISTENER);

export const addPreviewModeEventListeners = () => {
    if (!getIsInIframe()) {
        return;
    }

    window.addEventListener('scroll', sendMessageUpdateScrollPosition);
    // Element positions need to be updated whenever a transition ends or screen is resized.
    window.addEventListener('transitionend', sendMessageUpdateElementsPositions);
    window.addEventListener('resize', sendMessageUpdateElementsPositionsDebounced);
};

export const removePreviewModeEventListeners = () => {
    if (!getIsInIframe()) {
        return;
    }

    window.removeEventListener('scroll', sendMessageUpdateScrollPosition);
    window.removeEventListener('transitionend', sendMessageUpdateElementsPositions);
    window.removeEventListener('resize', sendMessageUpdateElementsPositionsDebounced);
};