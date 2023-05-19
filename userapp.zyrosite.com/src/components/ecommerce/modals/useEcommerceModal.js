import {
    ref
} from 'vue';

const openEcommerceModalName = ref('');
const productPreviewData = ref({});

export const useEcommerceModal = () => {
    const openEcommerceModal = (name) => {
        openEcommerceModalName.value = name;
    };

    const closeEcommerceModal = () => {
        openEcommerceModalName.value = null;
    };

    const setProductPreviewData = (blockData) => {
        productPreviewData.value = blockData;
    };

    return {
        openEcommerceModal,
        closeEcommerceModal,
        openEcommerceModalName,
        productPreviewData,
        setProductPreviewData,
    };
};