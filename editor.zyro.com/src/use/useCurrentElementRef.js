import {
    ref,
    watch,
    computed,
} from 'vue';
import {
    useStore
} from 'vuex';

const currentElementRef = ref();

export const useCurrentElementRef = (props) => {
    const {
        getters
    } = useStore();
    const elementRef = ref();
    const currentElementId = computed(() => getters.currentElementId);

    watch([currentElementId], ([newCurrentElementId]) => {
        if (!newCurrentElementId) {
            currentElementRef.value = null;
        }

        if (!props) return;

        // TODO: this double handling is needed because this composable
        // is used both in BlockGridItem and LayoutElementProviderBuilder
        // They use different prop naming for the same thing (element id)
        // and layout component uses Vue component whereas grid component uses <div>
        const elementId = props.id ? ? props.elementId;

        if (newCurrentElementId === elementId) {
            currentElementRef.value = elementRef.value.$el ? ? elementRef.value;
        }
    });

    return {
        elementRef,
        currentElementRef,
    };
};