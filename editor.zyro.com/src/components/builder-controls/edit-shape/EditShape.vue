<template>
	<BaseEditControls :button-title="$t('builder.editShape.title')">
		<ZyroPopupCard
			type="editor"
			:tabs="tabs"
			:current-tab="currentTab"
			:title="$t('builder.shapeSettings')"
			@update:current-tab="currentTab = $event"
			@close="$emit('close')"
		>
			<Component :is="currentTab.component" />
			<NpsRateFeature
				:feature-name="$t('builder.npsRateShape')"
				:type="NPS_TYPE_FEATURE_SHAPE"
			/>
		</ZyroPopupCard>
	</BaseEditControls>
</template>
<script>
import ZyroPopupCard from '@/components/global/ZyroPopupCard.vue';

import EditShapeTabShape from '@/components/builder-controls/edit-shape/EditShapeTabShape.vue';
import BaseEditControls from '@/components/builder-controls/BaseEditControls.vue';
import NpsRateFeature from '@/components/ui/NpsRateFeature.vue';
import { NPS_TYPE_FEATURE_SHAPE } from '@/constants';
import EditTabAnimation from '@/components/builder-controls/reusable-controls/element/EditTabAnimation.vue';
import { useI18n } from 'vue-i18n';

import {
	defineComponent,
	ref,
} from 'vue';

export default defineComponent({
	components: {
		ZyroPopupCard,
		BaseEditControls,
		EditShapeTabShape,
		NpsRateFeature,
		EditTabAnimation,
	},

	setup() {
		const { t } = useI18n();
		const tabs = [
			{
				title: t('common.shape'),
				component: 'EditShapeTabShape',
			},
			{
				title: t('common.animation'),
				component: 'EditTabAnimation',
			},
		];
		const currentTab = ref(tabs[0]);

		return {
			NPS_TYPE_FEATURE_SHAPE,
			currentTab,
			tabs,
		};
	},
});
</script>
