<template>
	<BaseEditControls :button-title="$t('builder.editInstagram.title')">
		<ZyroPopupCard
			type="editor"
			title="Instagram feed"
			:tabs="tabs"
			:current-tab="currentTab"
			@update:current-tab="currentTab = $event"
			@close="$emit('close')"
		>
			<Component :is="currentTab.component" />
			<NpsRateFeature
				:feature-name="$t('builder.npsRateInstagram')"
				:type="NPS_TYPE_FEATURE_INSTAGRAM_FEED"
			/>
		</ZyroPopupCard>
	</BaseEditControls>
</template>

<script>
import ZyroPopup from '@/components/global/ZyroPopup.vue';
import ZyroPopupCard from '@/components/global/ZyroPopupCard.vue';

import EditInstagramFeedTabGeneral from '@/components/builder-controls/edit-instagram-feed/EditInstagramFeedTabGeneral.vue';
import EditInstagramFeedTabLayout from '@/components/builder-controls/edit-instagram-feed/EditInstagramFeedTabLayout.vue';
import EditTabAnimation from '@/components/builder-controls/reusable-controls/element/EditTabAnimation.vue';

import BaseEditControls from '@/components/builder-controls/BaseEditControls.vue';
import NpsRateFeature from '@/components/ui/NpsRateFeature.vue';
import { NPS_TYPE_FEATURE_INSTAGRAM_FEED } from '@/constants';

import {
	defineComponent,
	ref,
} from 'vue';

import { useI18n } from 'vue-i18n';

export default defineComponent({
	components: {
		ZyroPopup,
		ZyroPopupCard,
		BaseEditControls,
		EditInstagramFeedTabGeneral,
		EditInstagramFeedTabLayout,
		NpsRateFeature,
		EditTabAnimation,
	},

	setup() {
		const { t } = useI18n();
		const tabs = [
			{
				title: t('common.general'),
				component: 'EditInstagramFeedTabGeneral',
			},
			{
				title: t('common.layout'),
				component: 'EditInstagramFeedTabLayout',
			},
			{
				title: t('common.animation'),
				component: 'EditTabAnimation',
			},
		];

		const currentTab = ref(tabs[0]);

		return {
			tabs,
			currentTab,
			NPS_TYPE_FEATURE_INSTAGRAM_FEED,
		};
	},
});
</script>
