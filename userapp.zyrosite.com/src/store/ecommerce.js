import {
    META_ECOMMERCE_TYPE,
    ECOMMERCE_TYPE_ZYRO,
    PAGE_TYPE_ECOMMERCE_PRODUCT,
} from '@zyro-inc/site-modules/constants';
import {
    getStoreId
} from '@zyro-inc/site-modules/utils/getters/getStoreId';
import {
    getCartData
} from '@zyro-inc/site-modules/utils/ecommerce/cartData';
import {
    getStoreProducts,
    getVariantsQuantity,
} from '@/api/EcommerceApi';
import {
    MAX_PRODUCTS_IN_CART,
    PRODUCT_TYPE_BOOKING,
    SHOPPING_CART_STORAGE_KEY,
    SHOPPING_CART_TTL,
} from '@zyro-inc/site-modules/constants/ecommerce';

// mutation type constants:
export const SET_STORE_PRODUCTS = 'SET_STORE_PRODUCTS';
export const SET_IS_LOADING = 'SET_IS_LOADING';
export const SET_IS_CHECKOUT_LOADING = 'SET_IS_CHECKOUT_LOADING';
export const SET_IS_LOADED = 'SET_IS_LOADED';
export const SET_SHOPPING_CART_OPEN = 'SET_SHOPPING_CART_OPEN';
export const SET_SHOPPING_CART_ITEMS = 'SET_SHOPPING_CART_ITEMS';
export const SET_SELECTED_BOOKING_ID = 'SET_SELECTED_BOOKING_ID';
export const SET_VARIANTS_QUANTITY = 'SET_VARIANTS_QUANTITY';

export default {
    namespaced: true,
    state: {
        products: [],
        shoppingCartItems: [],
        isShoppingCartOpen: false,
        isCheckoutLoading: false,
        isLoading: false,
        isLoaded: false,
        isProductPageLoaded: false,
        selectedBookingProductId: null,
        variantsQuantity: [],
    },
    getters: {
        isStoreTypeZyro: (state, getters, rootState, rootGetters) => rootGetters.meta[META_ECOMMERCE_TYPE] === ECOMMERCE_TYPE_ZYRO,
        isEcommerceStoreCreated: (state, getters, rootState, rootGetters) => !!rootGetters.meta ? .ecommerceStoreId,
        quantifiedCartItemsList: (state) => state.shoppingCartItems.reduce((quantifiedProducts, product) => {
            const existingProduct = quantifiedProducts.find(
                (searchedProduct) => searchedProduct.product.variants[0].id === product.variants[0].id,
            );

            if (existingProduct) {
                return quantifiedProducts.map((productToUpdate) => {
                    if (productToUpdate.product.variants[0].id === product.variants[0].id) {
                        return {
                            ...productToUpdate,
                            quantity: productToUpdate.quantity + 1,
                        };
                    }

                    return productToUpdate;
                });
            }

            return [
                ...quantifiedProducts,
                {
                    product,
                    quantity: 1,
                },
            ];
        }, []),
        canAddToCart: (state, getters) => (productId, productVariantId) => {
            if (state.shoppingCartItems.length >= MAX_PRODUCTS_IN_CART) {
                return false;
            }

            const product = state.products.find((item) => item.id === productId);
            const variant = product ? .variants.find((item) => item.id === productVariantId);

            if (!product || !variant) {
                return false;
            }

            if (variant.manage_inventory) {
                const cartProduct = getters.quantifiedCartItemsList
                    .find((productItem) => productItem.product.id === productId &&
                        productItem.product.variants.some((variantItem) => variantItem.id === variant.id));
                const quantity = cartProduct ? .quantity || 0;
                const availableQuantity = state.variantsQuantity.find((item) => item.id === productVariantId) ? .inventory_quantity;

                return quantity < availableQuantity;
            }

            return true;
        },
        productPages: (state, getters, rootState, rootGetters) => Object.values(rootGetters.pages).filter(
            (page) => page.type === PAGE_TYPE_ECOMMERCE_PRODUCT,
        ),
    },
    mutations: {
        [SET_IS_LOADING](state, isLoading) {
            state.isLoading = isLoading;
        },
        [SET_IS_LOADED](state, isLoaded) {
            state.isLoaded = isLoaded;
        },
        [SET_IS_CHECKOUT_LOADING](state, isLoading) {
            state.isCheckoutLoading = isLoading;
        },
        [SET_STORE_PRODUCTS](state, products) {
            state.products = products;
        },
        [SET_SHOPPING_CART_OPEN](state, isShoppingCartOpen) {
            state.isShoppingCartOpen = isShoppingCartOpen;
        },
        [SET_SHOPPING_CART_ITEMS](state, shoppingCartItems) {
            state.shoppingCartItems = shoppingCartItems;
        },
        [SET_SELECTED_BOOKING_ID](state, productId) {
            state.selectedBookingProductId = productId;
        },
        [SET_VARIANTS_QUANTITY](state, variantsQuantity) {
            state.variantsQuantity = variantsQuantity;
        },
    },
    actions: {
        getProducts: async ({
            state,
            commit,
            dispatch,
            rootGetters,
        }, productIds) => {
            const storeId = getStoreId(rootGetters.meta);

            if (!storeId) {
                return;
            }

            const shoppingCartItems = getCartData();
            const cartProductIds = shoppingCartItems.map((product) => product.id);
            const idsToFetch = [
                ...cartProductIds,
                ...productIds,
            ].reduce((accumulator, id) => {
                if (state.products.some((product) => product.id === id)) {
                    return accumulator;
                }

                return [
                    ...accumulator,
                    id,
                ];
            }, []);

            if (!idsToFetch.length) {
                return;
            }

            // !IMPORTANT to reset isLoaded for animations
            // when not all page products are loaded, only the ones in cart, when this isLoaded=true,
            // animations will not be observed on mounted in BlockUser.vue because products load later and need to be watched into
            commit(SET_IS_LOADED, false);
            commit(SET_IS_LOADING, true);

            try {
                const storeProducts = await getStoreProducts(storeId, idsToFetch);
                const mergedProducts = storeProducts.reduce((accumulator, product) => {
                    const exists = accumulator.some((item) => item.id === product.id);

                    if (exists) {
                        return accumulator;
                    }

                    return [
                        ...accumulator,
                        product,
                    ];
                }, [...state.products]);

                commit(SET_STORE_PRODUCTS, mergedProducts);

                await dispatch('updateVariantsQuantity', idsToFetch);
            } catch (error) {
                console.error(error);
            } finally {
                commit(SET_IS_LOADING, false);
                commit(SET_IS_LOADED, true);
            }
        },
        updateVariantsQuantity: async ({
            state,
            commit,
            dispatch,
            rootGetters,
        }, idsToFetch) => {
            const storeId = getStoreId(rootGetters.meta);

            if (!storeId) {
                return;
            }

            try {
                const variantsQuantity = await getVariantsQuantity(storeId, idsToFetch);

                // append fetched variants to current variant data
                const mergedVariants = [
                    ...state.variantsQuantity,
                    ...variantsQuantity,
                ];

                commit(SET_VARIANTS_QUANTITY, mergedVariants);
            } catch (error) {
                console.error(error);
            }

            const updatedCartItems = await dispatch('refreshCartItems', {
                shoppingCartItems: getCartData(),
            });

            commit(SET_SHOPPING_CART_ITEMS, updatedCartItems);
        },
        refreshCartItems: ({
            state
        }, {
            shoppingCartItems
        }) => shoppingCartItems.reduce((accumulator, cartItem) => {
            const productMatch = state.products.find((productItem) => productItem.id === cartItem.id);
            const variantMatch = productMatch ? .variants
                .find((variantItem) => cartItem.variants
                    .some((cartVariantItem) => variantItem.id === cartVariantItem.id));
            const quantity = accumulator.reduce((counter, item) => {
                if (item.variants.some((variant) => variant.id === variantMatch ? .id)) {
                    return counter + 1;
                }

                return counter;
            }, 0);

            const availableQuantity = state.variantsQuantity.find((variant) => variant.id === variantMatch ? .id) ? .inventory_quantity;
            const isQuantityValid = !variantMatch ? .manage_inventory || quantity < availableQuantity;
            const bookingEvent = productMatch ? .type.value === PRODUCT_TYPE_BOOKING ? {
                ...cartItem.variants[0].booking_event,
                time_slot: cartItem.variants[0].booking_event.time_slot,
                date: cartItem.variants[0].booking_event.date,
            } : null;

            if (productMatch && variantMatch && isQuantityValid) {
                return [
                    ...accumulator,
                    {
                        ...productMatch,
                        variants: [{
                            ...variantMatch,
                            booking_event: bookingEvent,
                        }, ],
                    },
                ];
            }

            return accumulator;
        }, []),
        setShoppingCartOpen({
            commit
        }, isShoppingCartOpen) {
            commit(SET_SHOPPING_CART_OPEN, isShoppingCartOpen);
        },
        setShoppingCartItems({
            commit
        }, shoppingCartItems) {
            const storageValue = {
                payload: shoppingCartItems,
                expiry: Date.now() + SHOPPING_CART_TTL,
            };

            window.localStorage.setItem(SHOPPING_CART_STORAGE_KEY, JSON.stringify(storageValue));

            commit(SET_SHOPPING_CART_ITEMS, shoppingCartItems);
        },
        setIsLoading({
            commit
        }, isLoading) {
            commit(SET_IS_LOADING, isLoading);
        },
        setIsCheckoutLoading({
            commit
        }, isLoading) {
            commit(SET_IS_CHECKOUT_LOADING, isLoading);
        },
        setSelectedBookingId({
            commit
        }, productId) {
            commit(SET_SELECTED_BOOKING_ID, productId);
        },
    },
};