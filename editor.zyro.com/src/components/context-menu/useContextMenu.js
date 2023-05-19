import {
    ref,
    computed,
    watch,
} from 'vue';

/**
 * When these are not null the base context menu uses it to position itself
 * When either of these aren't set the menu is closed
 */
const mousePositionX = ref(null);
const mousePositionY = ref(null);
const mouseEventRaw = ref(null);

export const useContextMenu = () => {
    const isContextMenuWithTriggerActive = ref(false);

    const mousePosition = computed(() => {
        if (!mousePositionX.value || !mousePositionY.value) {
            return null;
        }

        return {
            clientX: mousePositionX.value,
            clientY: mousePositionY.value,
        };
    });

    // Opens context menu
    const openContextMenu = (event) => {
        mousePositionX.value = event.clientX;
        mousePositionY.value = event.clientY;
        mouseEventRaw.value = event;
    };

    // Closes context menu
    const closeContextMenu = () => {
        if (!mouseEventRaw.value) return;

        mousePositionX.value = null;
        mousePositionY.value = null;
        mouseEventRaw.value = null;
    };

    watch([
        mousePositionX,
        mousePositionY,
    ], ([newMouseX, newMouseY]) => {
        if (!isContextMenuWithTriggerActive.value) {
            return;
        }

        if (newMouseX && newMouseY) {
            isContextMenuWithTriggerActive.value = false;
        }
    });

    return {
        isContextMenuWithTriggerActive,
        mousePositionX,
        mousePositionY,
        mousePosition,
        mouseEventRaw,
        openContextMenu,
        closeContextMenu,
    };
};