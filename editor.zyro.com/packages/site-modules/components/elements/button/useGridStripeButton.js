import {
    ref,
    computed,
} from 'vue';

// Use one instance for all buttons
const stripeInstance = ref(null);

// One time payment with checkout docs:
// https://stripe.com/docs/payments/checkout/client

export const useStripeGridButton = (props) => {
    const priceId = computed(() => props.data.settings ? .priceId || '');
    const paymentType = computed(() => props.data.settings ? .paymentType || 'payment');

    return {
        stripeInstance,
        priceId,
        paymentType,
    };
};