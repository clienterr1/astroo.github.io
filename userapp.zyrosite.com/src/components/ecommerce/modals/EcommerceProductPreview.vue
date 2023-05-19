<template>
	<ModalLayout
		ref="modal"
		max-width="905px"
		width="100%"
		padding="0"
		height="auto"
		overflow="auto"
		class="ecommerce-product-preview"
	>
		<div
			class="ecommerce-product-preview__content-wrapper"
			data-qa="productpreview-modal"
		>
			<BlockBackground
				v-if="productPreviewData.background"
				:overlay-opacity="productPreviewData.background['overlay-opacity']"
				:type="productPreviewData.background.current"
				:color="productPreviewData.background.color"
				:src="backgroundSrc"
				:srcset="backgroundSrcSet"
				:is-fixed="productPreviewData.attachment === 'fixed'"
				:alt="productPreviewData.background && productPreviewData.background.alt"
				class="ecommerce-product-preview__background"
			/>
			<BlockEcommerceProductProviderUser
				class="ecommerce-product-preview__content"
				:is-quick-preview="isQuickPreview"
				:data="productPreviewData"
				:product-pages="productPages"
				:is-cart-visible="isCartVisible"
				:ecommerce-translations="translations"
			/>
		</div>
	</ModalLayout>
</template>

<script>
import BlockBackground from '@zyro-inc/site-modules/components/blocks/BlockBackground.vue';
import ModalLayout from '@/components/ecommerce/modals/partials/ModalLayout.vue';
import BlockEcommerceProductProviderUser from '@/components/blocks/BlockEcommerceProductProviderUser.vue';
import {
	defineComponent,
	computed,
} from 'vue';
import { useEcommerceModal } from '@/components/ecommerce/modals/useEcommerceModal';

import {
	getFullWidthSrcset,
	getOptimizedSrc,
} from '@zyro-inc/site-modules/utils/getSrcsets';
import { FULL_WIDTH } from '@zyro-inc/site-modules/utils/getGridItemSize';
import { useStore } from 'vuex';

export default defineComponent({
	components: {
		ModalLayout,
		BlockBackground,
		BlockEcommerceProductProviderUser,
	},

	props: {
		translations: {
			type: Object,
			default: () => {},
		},
		isQuickPreview: {
			type: Boolean,
			default: false,
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
		const { getters } = useStore();
		const { productPreviewData } = useEcommerceModal(props);

		const backgroundSrc = computed(() => getOptimizedSrc(
			productPreviewData.value.background.origin,
			productPreviewData.value.background.path,
			getters.siteId,
			{
				width: FULL_WIDTH,
			},
		));

		const backgroundSrcSet = computed(
			() => getFullWidthSrcset(
				productPreviewData.value.background.origin,
				productPreviewData.value.background.path,
				getters.siteId,
				{
					isMobileFullScreen: false,
				},
			),
		);

		const productPages = computed(() => getters['ecommerce/productPages']);

		return {
			productPages,
			productPreviewData,
			backgroundSrc,
			backgroundSrcSet,
		};
	},
});
</script>

<style lang="scss" scoped>
@import "@zyro-inc/site-modules/scss/mixins/site-engine-mobile";

.ecommerce-product-preview {
	&__content-wrapper {
		position: relative;
		height: 100%;
	}

	&__content {
		:deep(.block-product) {
			max-height: 700px;
			padding: 32px;
		}
	}

	&__background {
		z-index: -1;
		height: 100%;
	}
}

@include site-engine-mobile {
	.ecommerce-product-preview {
		&__content-wrapper {
			height: auto;
			min-height: unset;
		}

		&__content {
			:deep(.block-product) {
				max-height: unset;
			}
		}
	}
}
</style>
