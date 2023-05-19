<template>
	<ZyroPopupCard
		type="editor"
		is-full-height
		max-width="305px"
		:show-close-button="false"
	>
		<ExpandableSettingsCard
			:title="$t('builder.sectionSettings.title')"
			@close="$emit('close')"
		>
			<ExpandableSettingsItem
				v-for="item in items"
				:key="`item-${item.id}`"
				:title="item.title"
				:should-open-at-load="item.isOpen"
			>
				<Component :is="item.component" />
			</ExpandableSettingsItem>
			<NpsRateFeature
				class="product-list-settings__nps-rate"
				:feature-name="$t('builder.npsRateOnlineStore')"
				:type="NPS_TYPE_FEATURE_SIMPLE_STORE"
				hide-border
			/>
		</ExpandableSettingsCard>
	</ZyroPopupCard>
</template>

<script>
import ZyroPopup from '@/components/global/ZyroPopup.vue';
import ZyroPopupCard from '@/components/global/ZyroPopupCard.vue';

import EditBlockTabStyle from '@/components/builder-controls/common-ecommerce/EditBlockTabStyle.vue';
import EditBlockTabLayout from '@/components/builder-controls/edit-block-ecommerce-product-list/EditBlockTabLayout.vue';
import EditBlockTabRibbons from '@/components/builder-controls/edit-block-ecommerce-product-list/EditBlockTabRibbons.vue';
import EditBlockTabPagination from '@/components/builder-controls/edit-block-ecommerce-product-list/EditBlockTabPagination.vue';
import EditBlockTabBuyButton from '@/components/builder-controls/edit-block-ecommerce-product-list/EditBlockTabBuyButton.vue';
import EditBlockTabCategory from '@/components/builder-controls/edit-block-ecommerce-product-list/EditBlockTabCategory.vue';
import ExpandableSettingsCard from '@/components/reusable-components/expandable-settings/ExpandableSettingsCard.vue';
import ExpandableSettingsItem from '@/components/reusable-components/expandable-settings/ExpandableSettingsItem.vue';
import NpsRateFeature from '@/components/ui/NpsRateFeature.vue';
import { NPS_TYPE_FEATURE_SIMPLE_STORE } from '@/constants';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ExpandableSettingsCard,
		ExpandableSettingsItem,
		ZyroPopup,
		ZyroPopupCard,
		EditBlockTabStyle,
		EditBlockTabLayout,
		EditBlockTabPagination,
		EditBlockTabCategory,
		EditBlockTabBuyButton,
		EditBlockTabRibbons,
		NpsRateFeature,
	},

	data() {
		return {
			NPS_TYPE_FEATURE_SIMPLE_STORE,
		};
	},

	computed: {
		items() {
			return [
				{
					id: 'products',
					title: this.$t('common.category'),
					component: 'EditBlockTabCategory',
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
					id: 'pagination',
					title: this.$t('common.pagination'),
					component: 'EditBlockTabPagination',
				},
				{
					id: 'buy-button',
					title: this.$t('builder.addToBagButton'),
					component: 'EditBlockTabBuyButton',
				},
				{
					id: 'ribbons',
					title: this.$t('common.ribbons'),
					component: 'EditBlockTabRibbons',
				},
			];
		},
	},
});
</script>

<style lang="scss" scoped>
.product-list-settings {
	&__nps-rate {
		justify-content: center;
		padding: 24px;
	}
}
</style>
