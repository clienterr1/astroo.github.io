import {
    useStore
} from 'vuex';

export const useShape = () => {
    const {
        dispatch
    } = useStore();

    const updateShapeColor = (color) => {
        dispatch('mergeCurrentElementData', {
            elementData: {
                color,
            },
            pushToHistory: true,
        });
    };

    return {
        updateShapeColor,
    };
};