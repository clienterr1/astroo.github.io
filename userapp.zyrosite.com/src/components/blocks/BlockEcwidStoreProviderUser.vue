<template>
	<BlockEcwidStore
		:store-id="storeId"
		:block-id="blockId"
		:show-store="showStore"
		:is-store-loading="isStoreLoading"
		:loading-text="loadingText"
	/>
</template>

<script>
import {
	defineComponent,
	computed,
	onMounted,
} from 'vue';
import { useStore } from 'vuex';
import BlockEcwidStore from '@zyro-inc/site-modules/components/blocks/ecwid/BlockEcwidStore.vue';
import { useBlockEcwidStore } from '@zyro-inc/site-modules/components/blocks/ecwid/useBlockEcwidStore';

import { SYSTEM_LOCALE } from '@zyro-inc/site-modules/constants';
import { getIsInIframe } from '@zyro-inc/site-modules/utils/getIsInIframe';

export default defineComponent({
	components: {
		BlockEcwidStore,
	},

	props: {
		blockId: {
			type: String,
			required: true,
		},
		data: {
			type: Object,
			default: () => ({}),
		},
		currentLocale: {
			type: String,
			default: SYSTEM_LOCALE,
		},
	},

	setup(props) {
		const { getters } = useStore();
		const ecwidStoreId = computed(() => getters.meta.ecwidStoreId);
		const demoEcwidStoreId = computed(() => getters.meta.demoEcwidStoreId);

		const {
			storeId,
			showStore,
			isStoreLoading,
			loadingText,
		} = useBlockEcwidStore(props, {
			ecwidStoreId,
			demoEcwidStoreId,
		});

		onMounted(() => {
			// Ecwid doesn't change language on multi-language switch since it needs a hard reload
			if (!!window?.Ecwid?.getStorefrontLang() && window.Ecwid.getStorefrontLang() !== props.currentLocale && !getIsInIframe()) {
				window.location.reload();
			}
		});

		return {
			storeId,
			showStore,
			isStoreLoading,
			loadingText,
		};
	},
});
</script>
