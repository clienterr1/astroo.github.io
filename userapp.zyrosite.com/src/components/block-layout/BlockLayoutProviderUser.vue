<template>
	<BlockLayoutWrapper
		ref="blockLayout"
		:style="layoutCSSVars"
		:is-mobile-legacy="isMobileLegacy"
		is-block-responsive
	>
		<LayoutElementProviderUser
			v-for="element in layoutElements"
			:key="element.elementId"
			:is-mobile-legacy="isMobileLegacy"
			:element-id="element.elementId"
			:element-data="element"
			:lcp="lcp"
			:is-cart-visible="isCartVisible"
			:current-locale="currentLocale"
			:site-language-pages="siteLanguagePages"
			:stripe-public-api-key="stripePublicApiKey"
			:is-parent-block-footer="isBlockFooter"
		/>
	</BlockLayoutWrapper>
</template>

<script>
import {
	toRefs,
	defineComponent,
	computed,
} from 'vue';

import BlockLayoutWrapper from '@zyro-inc/site-modules/components/blocks/layout/BlockLayoutWrapper.vue';
import { useBlockLayout } from '@zyro-inc/site-modules/components/blocks/layout/useBlockLayout';
import LayoutElementProviderUser from '@/components/layout-element/LayoutElementProviderUser.vue';

export default defineComponent({
	name: 'BlockLayoutProviderUser',

	components: {
		BlockLayoutWrapper,
		LayoutElementProviderUser,
	},

	props: {
		blockId: {
			type: String,
			required: true,
		},
		data: {
			type: Object,
			required: true,
		},
		components: {
			type: Object,
			default: () => ({}),
		},
		lcp: {
			type: Object,
			default: () => ({}),
		},
		siteLanguagePages: {
			type: Object,
			required: true,
		},
		stripePublicApiKey: {
			type: String,
			default: '',
		},
		currentLocale: {
			type: String,
			required: true,
		},
		isCartVisible: {
			type: Boolean,
			default: false,
		},
	},

	setup(props) {
		const { components: siteElements } = toRefs(props);
		const blockData = computed(() => props.data);
		const {
			layoutElements,
			layoutCSSVars,
			isMobileLegacy,
		} = useBlockLayout({
			blockData,
			siteElements,
		});

		const isBlockFooter = computed(() => blockData.value.slot === 'footer');

		return {
			layoutElements,
			isMobileLegacy,
			layoutCSSVars,
			isBlockFooter,
		};
	},
});
</script>
