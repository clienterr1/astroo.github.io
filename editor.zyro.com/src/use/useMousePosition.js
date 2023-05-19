import {
    ref,
    onUnmounted,
} from 'vue';

export const useMousePosition = () => {
    const mouseX = ref(null);
    const mouseY = ref(null);

    const handleMoveMouse = (e) => {
        mouseX.value = e.clientX;
        mouseY.value = e.clientY;
    };

    document.addEventListener('mousemove', handleMoveMouse);

    onUnmounted(() => {
        document.removeEventListener('mousemove', handleMoveMouse);
    });

    return {
        mouseX,
        mouseY,
    };
};