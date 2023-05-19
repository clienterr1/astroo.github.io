<template>
	<BaseEditControls :button-title="$t('builder.editMap.title')">
		<ZyroPopupCard
			type="editor"
			:title="$t('builder.editMap.popupTitle')"
			:tabs="tabs"
			:current-tab="currentTab"
			@update:current-tab="currentTab = $event"
			@close="$emit('close')"
		>
			<Component :is="currentTab.component" />
			<NpsRateFeature
				:feature-name="$t('builder.npsRateMap')"
				:type="NPS_TYPE_FEATURE_MAP"
			/>
		</ZyroPopupCard>
	</BaseEditControls>
</template>

<script>
import ZyroPopup from '@/components/global/ZyroPopup.vue';
import ZyroPopupCard from '@/components/global/ZyroPopupCard.vue';

import { useStore } from 'vuex';

import EditMapTabAction from '@/components/builder-controls/edit-map/EditMapTabAction.vue';
import EditMapTabLayout from '@/components/builder-controls/edit-map/EditMapTabLayout.vue';
import EditTabAnimation from '@/components/builder-controls/reusable-controls/element/EditTabAnimation.vue';

import BaseEditControls from '@/components/builder-controls/BaseEditControls.vue';
import NpsRateFeature from '@/components/ui/NpsRateFeature.vue';
import { NPS_TYPE_FEATURE_MAP } from '@/constants';

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
		EditMapTabAction,
		EditMapTabLayout,
		NpsRateFeature,
		EditTabAnimation,
	},

	setup() {
		const { getters } = useStore();
		const { t } = useI18n();
		const currentElementBlockType = computed(() => getters.currentElementBlockType);
		const defaultTabs = [
			{
				title: t('common.general'),
				component: 'EditMapTabAction',
			},
			{
				title: t('common.layout'),
				component: 'EditMapTabLayout',
				id: 'layout',
			},
			{
				title: t('common.animation'),
				component: 'EditTabAnimation',
			},
		];

		const tabs = computed(() => {
			if (currentElementBlockType.value === 'BlockLayout') {
				return defaultTabs.filter((tab) => tab?.id !== 'layout');
			}

			return defaultTabs;
		});

		const currentTab = ref(tabs.value[0]);

		return {
			tabs,
			currentTab,
			NPS_TYPE_FEATURE_MAP,
		};
	},
});
</script>
