import {
    computed
} from 'vue';

export const useEcommerceGridButton = (props, state) => {
    const storeProducts = computed(() => state.ecommerce ? .products);
    const productId = computed(() => props.data.settings ? .productId);
    const productVariantId = computed(() => props.data.settings ? .productVariantId);

    return {
        storeProducts,
        productId,
        productVariantId,
    };
};