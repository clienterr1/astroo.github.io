import {
    computed
} from 'vue';

import {
    COLUMN_COUNT_2,
    productsPerPageByColumnCount,
} from '@zyro-inc/site-modules/components/blocks/ecommerce/utils';

export const useBlockEcommerceProductList = (props, {
    productPages,
    isStoreTypeZyro,
    products,
}) => {
    // TODO ecommerce: remove check after https://github.com/zyro-inc/zyro/issues/13470 release
    const productList = computed(() => {
        let blockProductList;

        if (isStoreTypeZyro.value) {
            blockProductList = products.value ? .filter((product) => Object.values(productPages.value).find(
                (page) => page.productId === product.id,
            ));
        } else {
            blockProductList = products.value;
        }

        if (props.data.productCategoryId) {
            blockProductList = blockProductList.filter((product) => product.product_collections.some(
                (category) => category.collection_id === props.data.productCategoryId,
            ));

            return blockProductList ? .sort((a, b) => {
                const first = a.product_collections.find((item) => item.collection_id === props.data.productCategoryId);
                const second = b.product_collections.find((item) => item.collection_id === props.data.productCategoryId);

                return first.order - second.order;
            });
        }

        return blockProductList ? .sort((a, b) => a.title.localeCompare(b.title));
    });
    const blockStyle = computed(() => props.data.settings ? .styles);
    const textColorVars = computed(() => props.data.textColorVars);
    const columnCount = computed(() => props.data.columnCount);
    const productsPerPage = computed(() => props.data.productsPerPage || productsPerPageByColumnCount[columnCount.value || COLUMN_COUNT_2]);
    const productCategoryId = computed(() => props.data.productCategoryId);
    const productIds = computed(() => props.data.productIds);
    const isButtonEnabled = computed(() => props.data.isButtonEnabled ? ? false);
    const buttonDisplay = computed(() => props.data.buttonDisplay);
    const buttonText = computed(() => props.data.buttonText);
    const buttonStyle = computed(() => props.data.buttonStyle);
    const buttonType = computed(() => props.data.buttonType);
    const buttonBorderWidth = computed(() => props.data.buttonBorderWidth);
    const ribbonStyle = computed(() => props.data.ribbonStyle);

    return {
        productList,
        productPages,
        textColorVars,
        blockStyle,
        columnCount,
        productsPerPage,
        productIds,
        productCategoryId,
        isButtonEnabled,
        buttonDisplay,
        buttonText,
        buttonStyle,
        buttonType,
        buttonBorderWidth,
        ribbonStyle,
    };
};