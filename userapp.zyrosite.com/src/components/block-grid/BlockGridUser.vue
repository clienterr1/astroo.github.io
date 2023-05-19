<template>
	<div class="block-grid">
		<BlockGridItemUser
			v-for="elementId in data.components"
			:id="elementId"
			:key="elementId"
			:current-locale="currentLocale"
			:data="elements[elementId]"
			:lcp="lcp"
			class="grid__item"
			:class="{ 'block-grid--overflow-visible': getIsOverflowVisible(elementId) }"
			:style="{ '--element-z-index': data.zindexes.indexOf(elementId) + 1 }"
			:mobile-block-padding="data.settings.styles['m-block-padding']"
			:block-data="data"
			:is-cart-visible="isCartVisible"
			:site-language-pages="pages"
			:stripe-public-api-key="stripePublicApiKey"
		/>
	</div>
</template>

<script>
import { useStore } from 'vuex';
import {
	defineComponent,
	computed,
} from 'vue';
import { SYSTEM_LOCALE } from '@zyro-inc/site-modules/constants';

import BlockGridItemUser from '@/components/block-grid-item/BlockGridItemUser.vue';

export default defineComponent({
	components: {
		BlockGridItemUser,
	},

	props: {
		data: {
			type: Object,
			required: true,
		},
		blockId: {
			type: String,
			required: true,
		},
		lcp: {
			type: Object,
			default: () => ({}),
		},
		currentLocale: {
			type: String,
			default: SYSTEM_LOCALE,
		},
		isCartVisible: {
			type: Boolean,
			default: false,
		},
	},
	setup() {
		const { getters } = useStore();

		const pages = computed(() => getters.pages);
		const elements = computed(() => getters.elements);
		const stripePublicApiKey = computed(() => getters.meta.stripePublicApiKey);
		const getIsOverflowVisible = (elementId) => getters.elements[elementId]?.type === 'GridForm';

		return {
			pages,
			elements,
			stripePublicApiKey,
			getIsOverflowVisible,
		};
	},
});
</script>

<style lang="scss" scoped>
@import "@zyro-inc/site-modules/scss/components/BlockGrid";

// for users don't overflow content if row height is too small and text wraps
.block-grid {
	grid-template-rows: repeat(var(--rows), minmax(var(--row-size), auto));

	&--overflow-visible {
		overflow: visible;
	}
}
</style>
