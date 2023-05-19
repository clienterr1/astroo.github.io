<template>
	<BaseEditControls
		class="edit-button"
		:button-title="$t('builder.editButton.title')"
		:current-tab="currentTab"
	>
		<ZyroPopupCard
			type="editor"
			:title="popupTitle"
			:tabs="availableTabs"
			:current-tab="currentTab"
			@update:current-tab="currentTab = $event"
			@close="$emit('close')"
		>
			<Component
				:is="currentTab.component"
				@close="$emit('close')"
			/>
			<NpsRateFeature
				v-if="!isEcommerceButton"
				class="edit-button__nps"
				:feature-name="$t('builder.npsRateButton')"
				:type="NPS_TYPE_FEATURE_BUTTON"
			/>
		</ZyroPopupCard>
	</BaseEditControls>
</template>

<script>
import ZyroPopup from '@/components/global/ZyroPopup.vue';
import ZyroPopupCard from '@/components/global/ZyroPopupCard.vue';

import { useStore } from 'vuex';

import EditButtonTabAction from '@/components/builder-controls/edit-button/EditButtonTabAction.vue';
import EditButtonTabEcommerce from '@/components/builder-controls/edit-button/EditButtonTabEcommerce.vue';
import EditButtonTabLayout from '@/components/builder-controls/edit-button/EditButtonTabLayout.vue';
import EditButtonTabStripe from '@/components/builder-controls/edit-button/EditButtonTabStripe.vue';
import EditButtonTabStyle from '@/components/builder-controls/edit-button/EditButtonTabStyle.vue';
import EditTabAnimation from '@/components/builder-controls/reusable-controls/element/EditTabAnimation.vue';

import BaseEditControls from '@/components/builder-controls/BaseEditControls.vue';
import NpsRateFeature from '@/components/ui/NpsRateFeature.vue';
import { NPS_TYPE_FEATURE_BUTTON } from '@/constants';

import {
	defineComponent,
	ref,
	computed,
} from 'vue';

import { useI18n } from 'vue-i18n';

export default defineComponent({
	components: {
		ZyroPopup,
		ZyroPopupCard,
		BaseEditControls,
		EditButtonTabAction,
		EditButtonTabLayout,
		EditButtonTabStyle,
		EditButtonTabStripe,
		EditButtonTabEcommerce,
		EditTabAnimation,
		NpsRateFeature,
	},

	setup() {
		const { getters } = useStore();
		const { t } = useI18n();
		const currentElementType = computed(() => getters.currentElementType);
		const currentElementBlockType = computed(() => getters.currentElementBlockType);

		const tabs = [
			{
				title: 'Stripe',
				component: 'EditButtonTabStripe',
				id: 'stripe',
			},
			{
				title: t('common.product'),
				component: 'EditButtonTabEcommerce',
				id: 'ecommerce',
			},
			{
				title: t('common.general'),
				component: 'EditButtonTabAction',
				id: 'general',
			},
			{
				title: t('common.style'),
				component: 'EditButtonTabStyle',
				id: 'style',
			},
			{
				title: t('common.layout'),
				component: 'EditButtonTabLayout',
				id: 'layout',
			},
			{
				title: t('common.animation'),
				component: 'EditTabAnimation',
				id: 'animation',
			},
		];

		const isStripeButton = computed(() => currentElementType.value === 'GridStripeButton');
		const isEcommerceButton = computed(() => currentElementType.value === 'GridEcommerceButton');
		const isBlockLayoutBlock = computed(() => currentElementBlockType.value === 'BlockLayout');

		const enabledTabs = computed(() => {
			const defaultBlockTabs = isBlockLayoutBlock.value
				? [
					'general',
					'style',
					'animation',
				] : [
					'general',
					'style',
					'layout',
				];

			if (isStripeButton.value) {
				return [
					...defaultBlockTabs,
					'stripe',
				];
			}

			if (isEcommerceButton.value) {
				return [
					...defaultBlockTabs,
					'ecommerce',
				];
			}

			return defaultBlockTabs;
		});
		const availableTabs = computed(() => tabs.filter((tab) => enabledTabs.value.includes(tab.id)));

		const currentTab = ref(availableTabs.value[0]);

		const popupTitle = computed(() => {
			if (isStripeButton.value) {
				return t('common.stripeCheckout');
			}

			if (isEcommerceButton.value) {
				return t('builder.ecommerceAddToBagButton');
			}

			return t('builder.editButton.popupTitle');
		});

		return {
			NPS_TYPE_FEATURE_BUTTON,
			availableTabs,
			currentTab,
			popupTitle,
			isEcommerceButton,
		};
	},
});
</script>

<style lang="scss" scoped>
.edit-button {
	&__nps:not(.s) {
		margin-top: 0;
	}
}
</style>
