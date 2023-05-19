import {
    DESKTOP_BLOCK_WIDTH,
    MOBILE_BLOCK_WIDTH,
    MOBILE_BLOCK_PADDING_X,
} from '@zyro-inc/site-modules/components/blocks/layout/constants';
import {
    DATA_ATTRIBUTE_ELEMENT_ID
} from '@zyro-inc/site-modules/constants';

/**
 * Returns height of an element as it would be displayed on a mobile device,
 * while the element is currently being edited on a desktop device and vice versa
 * @param {elementId} elementId - id of an element
 * @param {elementPositionKey} elementPositionKey - device on which element height should be returned
 * @param {elementWidth} elementWidth - element width specified device
 *
 * @returns element height
 */

export const getDeviceElementHeight = ({
    elementId,
    elementPositionKey,
    elementWidth,
}) => {
    // If element is updated on desktop create preview on mobile and vice versa
    const isMobilePreview = elementPositionKey === 'mobile';

    const appContainer = document.querySelector('.app');
    const previewContainer = document.createElement('div');
    const previewElementWrapper = document.querySelector(`[${DATA_ATTRIBUTE_ELEMENT_ID}='${elementId}']`).cloneNode(true);

    const previewContainerWidth = isMobilePreview ? MOBILE_BLOCK_WIDTH : DESKTOP_BLOCK_WIDTH;
    const previewContainerPaddingX = isMobilePreview ? MOBILE_BLOCK_PADDING_X : 0;

    // Set the preview container styles to match those of a mobile or desktop device
    previewContainer.style.position = 'fixed';
    previewContainer.style.visibility = 'hidden';
    previewContainer.style.width = `${previewContainerWidth}px`;
    previewContainer.style.height = '100%';
    previewContainer.style.padding = `0px ${previewContainerPaddingX}px`;

    // Set the preview element styles to match those of a mobile or desktop device
    previewElementWrapper.style.width = `${elementWidth}px`;

    if (isMobilePreview) {
        previewContainer.classList.add('zyro-mb-preview');
    }

    appContainer.appendChild(previewContainer);
    previewContainer.appendChild(previewElementWrapper);
    const previewElement = previewElementWrapper.querySelector(`[data-element-ref='${elementId}']`);
    const previewElementHeight = previewElement.offsetHeight;

    // Discard preview element
    previewContainer.remove();

    return previewElementHeight;
};