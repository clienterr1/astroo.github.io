import {
    useStore
} from 'vuex';
import {
    ref,
    onMounted,
} from 'vue';
import {
    PRODUCT_TYPE_DONATION,
    PRODUCT_TYPE_BOOKING,
    CHECKOUT_ERROR_CODES,
} from '@zyro-inc/site-modules/constants/ecommerce';

import {
    getCheckoutUrl
} from '@/api/EcommerceApi';
import {
    useEcommerceModal
} from '@/components/ecommerce/modals/useEcommerceModal';

export const useEcommerce = (props) => {
    const {
        getters
    } = useStore();
    const {
        openEcommerceModal
    } = useEcommerceModal(props);

    const storeId = getters.meta ? .ecommerceStoreId;
    const cancelUrl = ref('');

    onMounted(() => {
        cancelUrl.value = `${window.location.origin}${window.location.pathname}`;
    });

    function successUrl(products) {
        const isProductDonation = products.some((product) => product.type.value === PRODUCT_TYPE_DONATION);
        const isProductBooking = products.some((product) => product.type.value === PRODUCT_TYPE_BOOKING);
        let productTypeQuery = '';

        if (isProductBooking) {
            productTypeQuery = `&product=${PRODUCT_TYPE_BOOKING}`;
        } else if (isProductDonation) {
            productTypeQuery = `&product=${PRODUCT_TYPE_DONATION}`;
        }

        return `${cancelUrl.value}?open-modal=EcommerceCheckoutSuccess${productTypeQuery}`;
    }

    async function createCheckoutUrl(checkoutItems) {
        const quantifiedProductList = checkoutItems.reduce((accumulator, product) => {
            const existingProduct = accumulator.find(
                (searchedProduct) => searchedProduct.variant_id === product.variants[0].id,
            );

            if (existingProduct) {
                return accumulator.map((productToUpdate) => {
                    if (productToUpdate.variant_id === product.variants[0].id) {
                        return {
                            variant_id: productToUpdate.variant_id,
                            quantity: productToUpdate.quantity + 1,
                        };
                    }

                    return productToUpdate;
                });
            }

            return [
                ...accumulator,
                {
                    variant_id: product.variants[0].id,
                    quantity: 1,
                    time_slot: product.variants[0].booking_event ? .time_slot,
                    time_zone: product.variants[0].booking_event ? .time_zone,
                },
            ];
        }, []);

        const locale = getters ? .ecommerceShoppingCart ? .lang || 'en';
        let checkoutUrl = await getCheckoutUrl({
            items: quantifiedProductList,
            cancelUrl: cancelUrl.value,
            successUrl: successUrl(checkoutItems),
            locale,
            storeId,
        });

        checkoutUrl = new URL(checkoutUrl);
        checkoutUrl.searchParams.set('lang', locale);

        return checkoutUrl.toString();
    }

    async function initiateCheckout(checkoutItems) {
        if (!storeId) {
            openEcommerceModal('EcommerceCheckoutFailed');

            return;
        }

        try {
            const checkoutUrl = await createCheckoutUrl(checkoutItems);

            window.location.assign(checkoutUrl);
        } catch (error) {
            if (error.code === CHECKOUT_ERROR_CODES.INSUFFICIENT_INVENTORY) {
                openEcommerceModal('EcommerceOutOfStock');
            } else if (error.code === CHECKOUT_ERROR_CODES.BOOKING_UNAVAILABLE) {
                openEcommerceModal('EcommerceBookingUnavailable');
            } else {
                openEcommerceModal('EcommerceCheckoutFailed');
            }
        }
    }

    return {
        initiateCheckout,
        storeId,
    };
};