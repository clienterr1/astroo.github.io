import {
    ref,
    computed,
} from 'vue';

import {
    useMousePosition
} from '@/use/useMousePosition';

export const useDrag = () => {
    const {
        mouseX,
        mouseY,
    } = useMousePosition();

    const initialMouseX = ref(null);
    const initialMouseY = ref(null);
    const isDragging = ref(false);
    const hasMouseMoved = ref(false);

    const startDragging = ({
        onDragEnd = null
    } = {}) => {
        isDragging.value = true;
        initialMouseX.value = mouseX.value;
        initialMouseY.value = mouseY.value;

        document.addEventListener('mouseup', () => {
            onDragEnd ? .();
            initialMouseX.value = null;
            initialMouseY.value = null;

            hasMouseMoved.value = false;

            isDragging.value = false;
        }, {
            once: true,
        });

        document.addEventListener('mousemove', () => {
            // Check if dragging action is still active
            // It can be inactive when this fires if the user e.g.: clicked on an element
            if (isDragging.value) {
                hasMouseMoved.value = true;
            }
        }, {
            once: true,
        });
    };

    const mouseDeltaX = computed(() => (hasMouseMoved.value ? mouseX.value - initialMouseX.value : 0));
    const mouseDeltaY = computed(() => (hasMouseMoved.value ? mouseY.value - initialMouseY.value : 0));

    return {
        startDragging,
        mouseDeltaX,
        mouseDeltaY,
        isDragging,
        hasMouseMoved,
    };
};