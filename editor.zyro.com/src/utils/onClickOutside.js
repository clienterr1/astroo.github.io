import {
    onClickOutside as vueUseOnClickOutside
} from '@vueuse/core';

import {
    DATA_SELECTOR_ELEMENT_EDIT_TEXT,
    DATA_SELECTOR_DRAWER,
    DATA_SELECTOR_POPUP,
    DATA_SELECTOR_HEATMAP,
    DATA_SELECTOR_IMAGE_PROVIDER,
    DATA_SELECTOR_BUILDER_PREVIEW,
    DATA_SELECTOR_QUICK_START_GUIDE,
} from '@/constants';

import {
    DATA_ATTRIBUTE_SELECTOR,
    DATA_ATTRIBUTE_SELECTOR_GRID_RESIZER,
    DATA_ATTRIBUTE_SELECTOR_MODAL_BACKDROP,
    DATA_ATTRIBUTE_SELECTOR_DRAWER_TRIGGER,
    DATA_ATTRIBUTE_SELECTOR_TOAST,
    DATA_ATTRIBUTE_SELECTOR_SUBMISSIONS_EXPORT,
    DATA_ATTRIBUTE_SELECTOR_POPUP_CONTENT,
    DATA_ATTRIBUTE_SELECTOR_TOOLTIP_CONTENT,
    DATA_ATTRIBUTE_SELECTOR_CONTEXT_MENU,
    DATA_ATTRIBUTE_SELECTOR_ASSET_MANAGER,
    DATA_ATTRIBUTE_SELECTOR_QUICK_START_GUIDE,
    DATA_ATTRIBUTE_SELECTOR_HEATMAP,
    DATA_ATTRIBUTE_SELECTOR_RESIZE_DOTS,
    DATA_ATTRIBUTE_SELECTOR_IMAGE,
    DATA_ATTRIBUTE_SELECTOR_MODAL_OVERLAY,
    DATA_ATTRIBUTE_SELECTOR_FONT_SELECT,
} from '@zyro-inc/site-modules/constants';

const getFormattedSelector = (selector) => `[${DATA_ATTRIBUTE_SELECTOR}=${selector}]`;

const getShouldPreventClickOutside = ({
    selector,
    event,
}) => {
    if (!event ? .target ? .closest) return false;

    switch (selector) {
        // ZyroDrawer
        case DATA_SELECTOR_DRAWER:
            {
                return event.target.closest(getFormattedSelector(DATA_ATTRIBUTE_SELECTOR_MODAL_BACKDROP)) ||
                    event.target.closest(getFormattedSelector(DATA_ATTRIBUTE_SELECTOR_DRAWER_TRIGGER)) ||
                    event.target.closest(getFormattedSelector(DATA_ATTRIBUTE_SELECTOR_TOAST)) ||
                    event.target.closest(getFormattedSelector(DATA_ATTRIBUTE_SELECTOR_SUBMISSIONS_EXPORT)) ||
                    event.target.closest(getFormattedSelector(DATA_ATTRIBUTE_SELECTOR_POPUP_CONTENT)) ||
                    event.target.closest(getFormattedSelector(DATA_ATTRIBUTE_SELECTOR_ASSET_MANAGER)) ||
                    event.target.closest(getFormattedSelector(DATA_ATTRIBUTE_SELECTOR_TOOLTIP_CONTENT));
            }

            // ZyroPopup
        case DATA_SELECTOR_POPUP:
            {
                return event.target.closest(getFormattedSelector(DATA_ATTRIBUTE_SELECTOR_MODAL_BACKDROP));
            }

            // EditText
        case DATA_SELECTOR_ELEMENT_EDIT_TEXT:
            {
                return event.target.closest(getFormattedSelector(DATA_ATTRIBUTE_SELECTOR_CONTEXT_MENU)) ||
                    event.target.closest(getFormattedSelector(DATA_ATTRIBUTE_SELECTOR_GRID_RESIZER)) ||
                    event.target.closest(getFormattedSelector(DATA_ATTRIBUTE_SELECTOR_ASSET_MANAGER)) ||
                    event.target.closest(getFormattedSelector(DATA_ATTRIBUTE_SELECTOR_POPUP_CONTENT));
            }

            // BuilderHeaderQuickStartGuideButton
        case DATA_SELECTOR_QUICK_START_GUIDE:
            {
                return event.target.closest(getFormattedSelector(DATA_ATTRIBUTE_SELECTOR_ASSET_MANAGER)) ||
                    event.target.closest(getFormattedSelector(DATA_ATTRIBUTE_SELECTOR_POPUP_CONTENT)) ||
                    event.target.closest(getFormattedSelector(DATA_ATTRIBUTE_SELECTOR_QUICK_START_GUIDE));
            }

            // BuilderHeatmap
        case DATA_SELECTOR_HEATMAP:
            {
                return event.target.closest(getFormattedSelector(DATA_ATTRIBUTE_SELECTOR_HEATMAP));
            }

            // GridImageProviderBuilder
        case DATA_SELECTOR_IMAGE_PROVIDER:
            {
                return event.target.closest(getFormattedSelector(DATA_ATTRIBUTE_SELECTOR_POPUP_CONTENT)) ||
                    event.target.closest(getFormattedSelector(DATA_ATTRIBUTE_SELECTOR_RESIZE_DOTS)) ||
                    event.target.closest(getFormattedSelector(DATA_ATTRIBUTE_SELECTOR_IMAGE)) ||
                    event.target.closest(getFormattedSelector(DATA_ATTRIBUTE_SELECTOR_MODAL_OVERLAY));
            }

            // BuilderPreview
        case DATA_SELECTOR_BUILDER_PREVIEW:
            {
                return event.target.closest(getFormattedSelector(DATA_ATTRIBUTE_SELECTOR_ASSET_MANAGER)) ||
                    event.target.closest(getFormattedSelector(DATA_ATTRIBUTE_SELECTOR_FONT_SELECT));
            }

        case DATA_ATTRIBUTE_SELECTOR_CONTEXT_MENU:
            {
                return event.target.closest(getFormattedSelector(DATA_ATTRIBUTE_SELECTOR_POPUP_CONTENT));
            }

        default:
            {
                return false;
            }
    }
};

export const onClickOutside = ({
    preventSelector,
    target,
}, handler) => {
    vueUseOnClickOutside(target, (event) => {
        const shouldPreventClickOutside = getShouldPreventClickOutside({
            selector: preventSelector,
            event,
        });

        const hasNoClosestElement = !event ? .target ? .closest;

        if (hasNoClosestElement || shouldPreventClickOutside) {
            return;
        }

        handler(event);
    });
};