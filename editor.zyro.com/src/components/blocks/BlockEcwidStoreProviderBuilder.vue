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
	onBeforeUnmount,
	watch,
	computed,
	nextTick,
	defineComponent,
} from 'vue';
import { useStore } from 'vuex';

import BlockEcwidStore from '@zyro-inc/site-modules/components/blocks/ecwid/BlockEcwidStore.vue';
import { useBlockEcwidStore } from '@zyro-inc/site-modules/components/blocks/ecwid/useBlockEcwidStore';
import { SYSTEM_LOCALE } from '@zyro-inc/site-modules/constants';

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
		const { state } = useStore();
		const isMobileView = computed(() => state.gui.isMobileView);
		const ecwidStoreId = computed(() => state.website.meta.ecwidStoreId);
		const demoEcwidStoreId = computed(() => state.website.meta.demoEcwidStoreId);
		const {
			storeId,
			showStore,
			isStoreLoading,
			loadStore,
			loadingText,
			ECWID_LOADED_EVENT,
		} = useBlockEcwidStore(props, {
			ecwidStoreId,
			demoEcwidStoreId,
		});

		const afterEcwidLoad = () => {
			// Deactivate search filter, its breaking mobile view in builder
			const searchLinkNode = document.querySelector(
				`#my-store-${storeId.value} .ec-footer__row .footer__link--all-products`,
			);

			if (searchLinkNode?.parentNode) {
				searchLinkNode.parentNode.style.pointerEvents = 'none';
			}
		};

		window.addEventListener(ECWID_LOADED_EVENT, afterEcwidLoad);

		onBeforeUnmount(() => {
			window.removeEventListener(ECWID_LOADED_EVENT, afterEcwidLoad);
		});

		watch(isMobileView, async () => {
			showStore.value = false;
			await nextTick();
			showStore.value = true;
			loadStore();
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

<style lang="scss">
	.ec-notices {
		display: none !important;
	}
</style>
