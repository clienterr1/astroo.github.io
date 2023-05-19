<template>
	<BaseEditControls :button-title="$t('builder.editImage.title')">
		<ZyroPopupCard
			type="editor"
			:title="$t('builder.editImage.popupTitle')"
			:tabs="tabs"
			:current-tab="currentTab"
			@update:current-tab="currentTab = $event"
			@close="$emit('close')"
		>
			<Component :is="currentTab.component" />
			<NpsRateFeature
				:feature-name="$t('builder.npsRateImage')"
				:type="NPS_TYPE_FEATURE_IMAGE"
			/>
		</ZyroPopupCard>
	</BaseEditControls>
</template>
<script>
import ZyroPopup from '@/components/global/ZyroPopup.vue';
import ZyroPopupCard from '@/components/global/ZyroPopupCard.vue';

import EditImageTabAction from '@/components/builder-controls/edit-image/EditImageTabAction.vue';
import EditImageTabImage from '@/components/builder-controls/edit-image/EditImageTabImage.vue';
import EditImageTabStyles from '@/components/builder-controls/edit-image/EditImageTabStyles.vue';
import EditTabAnimation from '@/components/builder-controls/reusable-controls/element/EditTabAnimation.vue';

import BaseEditControls from '@/components/builder-controls/BaseEditControls.vue';
import NpsRateFeature from '@/components/ui/NpsRateFeature.vue';
import { NPS_TYPE_FEATURE_IMAGE } from '@/constants';

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
		EditImageTabImage,
		EditImageTabAction,
		EditImageTabStyles,
		NpsRateFeature,
		EditTabAnimation,
	},

	setup() {
		const { t } = useI18n();
		const tabs = [
			{
				title: t('common.image'),
				component: 'EditImageTabImage',
			},
			{
				title: t('common.style'),
				component: 'EditImageTabStyles',
			},
			{
				title: t('common.action'),
				component: 'EditImageTabAction',
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
			NPS_TYPE_FEATURE_IMAGE,
		};
	},
});
</script>
