import {
    ref,
    computed,
    watch,
    onMounted,
    onBeforeUnmount,
    nextTick,
} from 'vue';

import {
    createDeliveryObserver
} from '@zyro-inc/site-modules/components/blocks/ecwid/ecwidDeliveryFilter';
import ecwidScript, {
    ECWID_LOADED_EVENT
} from '@zyro-inc/site-modules/components/blocks/ecwid/ecwidScript';
import {
    isAppPrerendering
} from '@zyro-inc/site-modules/utils/prerenderingFlags';

const DEFAULT_STORE_ID = '26103239';
const MUTATION_OBSERVER_CONFIG = {
    attributes: true,
    childList: true,
    subtree: true,
};

export const useBlockEcwidStore = (props, {
    ecwidStoreId,
    demoEcwidStoreId,
}) => {
    const showStore = ref(true);
    const isStoreLoading = ref(false);
    const deliveryObserver = ref(true);

    const loadingText = computed(() => props.data.settings.loadingText || 'Store is loading');
    const storeId = computed(() => ecwidStoreId.value || demoEcwidStoreId.value || DEFAULT_STORE_ID);

    const loadStore = () => {
        ecwidScript.load(storeId.value, props.currentLocale);
    };

    const startLoadingEcwidScript = () => {
        isStoreLoading.value = true;
        window.addEventListener(ECWID_LOADED_EVENT, () => {
            isStoreLoading.value = false;
        });

        if (isAppPrerendering) {
            return;
        }

        loadStore();
    };

    onMounted(() => {
        startLoadingEcwidScript();
        deliveryObserver.value = createDeliveryObserver();
        deliveryObserver.value.observe(document.querySelector(`#my-store-${storeId.value}`), MUTATION_OBSERVER_CONFIG);
    });

    onBeforeUnmount(() => {
        deliveryObserver.value.disconnect();
    });

    watch(storeId, async (newStoreId) => {
        if (demoEcwidStoreId.value === newStoreId) {
            return;
        }

        // Delete previous store
        document.querySelector(`#my-store-${storeId.value}`).innerHTML = '';
        // Wait until template id changes
        await nextTick();
        startLoadingEcwidScript();
    });

    return {
        storeId,
        showStore,
        isStoreLoading,
        loadStore,
        loadingText,
        ECWID_LOADED_EVENT,
    };
};