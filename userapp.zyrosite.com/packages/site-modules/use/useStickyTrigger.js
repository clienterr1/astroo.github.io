import {
    ref,
    computed,
} from 'vue';

const isTriggerIntesecting = ref(true);

export const useStickyTrigger = () => {
    const setIntersectingState = (isIntesecting) => {
        isTriggerIntesecting.value = isIntesecting;
    };

    return {
        // when trigger is NOT intersecting, it means user has scrolled
        hasUserScrolled: computed(() => !isTriggerIntesecting.value),
        setIntersectingState,
    };
};