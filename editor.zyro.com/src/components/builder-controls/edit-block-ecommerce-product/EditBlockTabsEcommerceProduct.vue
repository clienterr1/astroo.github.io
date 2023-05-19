<template>
	<ZyroPopupCard
		type="editor"
		is-full-height
		max-width="305px"
		:show-close-button="false"
		@close="$emit('close')"
	>
		<ExpandableSettingsCard
			:title="$t('builder.sectionSettings.title')"
			:is-footer-shown="isFooterShown"
			@close="$emit('close')"
		>
			<ExpandableSettingsItem
				v-for="item in items"
				v-show="!item.isHidden"
				:key="`item-${item.id}`"
				:title="item.title"
				:should-open-at-load="item.isOpen"
			>
				<Component
					:is="item.component"
					block-type-product
					use-color-picker-v2
				/>
			</ExpandableSettingsItem>
			<NpsRateFeature
				class="product-settings__nps-rate"
				:feature-name="$t('builder.npsRateOnlineStore')"
				:type="NPS_TYPE_FEATURE_SIMPLE_STORE"
				hide-border
			/>
			<template #footer>
				<div class="footer">
					<div class="footer__title">
						{{ $t('builder.ecommerceTabsApplyChanges') }}
					</div>
					<div class="footer__button-wrapper">
						<ZyroButton
							data-qa="builder-popupcard-applytoallbtn"
							theme="primary"
							:is-disabled="!isCurrentBlockEdited"
							@click="applyBlockSettingsToAll"
						>
							{{ $t('builder.ecommerceApplyToAll') }}
						</ZyroButton>
						<Transition name="fade">
							<div
								v-if="isLoaded"
								class="footer__checkmark"
							>
								<ZyroSvgDeprecated
									name="check-mark"
									class="footer__icon"
								/>
								{{ $t('builder.appliedToAll') }}
							</div>
						</Transition>
					</div>
				</div>
			</template>
		</ExpandableSettingsCard>
	</ZyroPopupCard>
</template>

<script>
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroPopup from '@/components/global/ZyroPopup.vue';
import ZyroPopupCard from '@/components/global/ZyroPopupCard.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import { PAGE_TYPE_ECOMMERCE_PRODUCT } from '@zyro-inc/site-modules/constants';
import ExpandableSettingsCard from '@/components/reusable-components/expandable-settings/ExpandableSettingsCard.vue';
import ExpandableSettingsItem from '@/components/reusable-components/expandable-settings/ExpandableSettingsItem.vue';
import {
	mapState,
	mapGetters,
	mapActions,
} from 'vuex';
import isEqual from 'lodash.isequal';
import EditBlockTabStyle from '@/components/builder-controls/common-ecommerce/EditBlockTabStyle.vue';
import EditBlockTabButton from '@/components/builder-controls/edit-block-ecommerce-product/EditBlockTabButton.vue';
import EditBlockTabLayout from '@/components/builder-controls/edit-block-ecommerce-product/EditBlockTabLayout.vue';
import EditBlockTabProduct from '@/components/builder-controls/edit-block-ecommerce-product/EditBlockTabProduct.vue';
import EditBlockTabQuantity from '@/components/builder-controls/edit-block-ecommerce-product/EditBlockTabQuantity.vue';
import cloneDeep from 'lodash.clonedeep';
import { NPS_TYPE_FEATURE_SIMPLE_STORE } from '@/constants';
import NpsRateFeature from '@/components/ui/NpsRateFeature.vue';

import { defineComponent } from 'vue';

const TAB_ID_ECOMMERCE = 'ecommerce';
const PRODUCT_TYPE_BOOKING = 'booking';

export default defineComponent({
	PRODUCT_TYPE_BOOKING,
	components: {
		ExpandableSettingsCard,
		ExpandableSettingsItem,
		ZyroButton,
		ZyroPopup,
		ZyroPopupCard,
		ZyroSvgDeprecated,
		EditBlockTabStyle,
		EditBlockTabLayout,
		EditBlockTabProduct,
		EditBlockTabButton,
		NpsRateFeature,
		EditBlockTabQuantity,
	},

	data() {
		return {
			NPS_TYPE_FEATURE_SIMPLE_STORE,
			initialCurrentBlockValue: null,
			isCurrentBlockEdited: false,
			isLoaded: false,
			blockId: '',
		};
	},

	computed: {
		...mapGetters('ecommerce', ['products']),
		...mapState(['currentBlockId']),
		...mapGetters([
			'currentBlock',
			'currentPage',
		]),
		items() {
			return [
				{
					id: TAB_ID_ECOMMERCE,
					title: this.$t('common.product'),
					component: 'EditBlockTabProduct',
					isOpen: true,
				},
				{
					id: 'layout',
					title: this.$t('common.layout'),
					component: 'EditBlockTabLayout',
				},
				{
					id: 'background',
					title: this.$t('common.style'),
					component: 'EditBlockTabStyle',
				},
				{
					id: 'button',
					title: this.$t('common.button'),
					component: 'EditBlockTabButton',
				},
				{
					id: 'quantity',
					title: this.$t('common.productQuantity'),
					component: 'EditBlockTabQuantity',
					isHidden: this.isProductBooking,
				},
			];
		},
		isFooterShown() {
			return this.currentPage.type === PAGE_TYPE_ECOMMERCE_PRODUCT && this.isCurrentBlockEdited;
		},
		isProductBooking() {
			const currentProduct = this.products.find((product) => product.id === this.currentBlock.product.id);

			return currentProduct?.type.value === PRODUCT_TYPE_BOOKING;
		},
	},

	watch: {
		currentBlock(value) {
			if (!isEqual(this.initialCurrentBlockValue, value)) {
				this.isCurrentBlockEdited = true;
			}
		},
	},

	mounted() {
		this.blockId = this.currentBlockId;
		this.initialCurrentBlockValue = cloneDeep(this.currentBlock);
	},

	methods: {
		...mapActions(['updateEcommerceProductPagesBlocks']),
		applyBlockSettingsToAll() {
			const blockDataCopy = {
				...this.currentBlock,
			};

			delete blockDataCopy.product;

			this.updateEcommerceProductPagesBlocks(blockDataCopy);
			this.initialCurrentBlockValue = this.currentBlock;
			this.isCurrentBlockEdited = false;
			this.isLoaded = true;

			setTimeout(() => {
				this.isLoaded = false;
			}, 3500);
		},
	},
});
</script>

<style lang="scss" scoped>
.product-settings {
	&__nps-rate {
		justify-content: center;
		padding: 24px;
	}
}

.footer {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	text-align: center;

	&__title {
		margin-bottom: 8px;
		font-size: 14px;
	}

	&__button-wrapper {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	&__checkmark {
		display: flex;
		align-items: center;
		font-size: 14px;
		color: $color-gray;
	}

	&__icon {
		margin-right: 4px;
	}
}
</style>
