<template>
	<BaseEditControls :button-title="$t('builder.editForm.editForm')">
		<ZyroPopupCard
			type="editor"
			:title="$t('builder.editForm.formSettings')"
			:tabs="tabs"
			:current-tab="currentTab"
			editor-popup-width="420px"
			@update:current-tab="currentTab = $event"
			@close="$emit('close')"
		>
			<Component :is="currentTab.component" />
			<NpsRateFeature
				:feature-name="$t('builder.npsRateForm')"
				:type="NPS_TYPE_FEATURE_FORM"
			/>
		</ZyroPopupCard>
	</BaseEditControls>
</template>

<script>
import ZyroPopup from '@/components/global/ZyroPopup.vue';
import ZyroPopupCard from '@/components/global/ZyroPopupCard.vue';

import EditFormTabButton from '@/components/builder-controls/edit-form/EditFormTabButton.vue';
import EditFormTabFields from '@/components/builder-controls/edit-form/EditFormTabFields/EditFormTabFields.vue';
import EditFormTabGeneral from '@/components/builder-controls/edit-form/EditFormTabGeneral.vue';
import EditFormTabStyle from '@/components/builder-controls/edit-form/EditFormTabStyle/EditFormTabStyle.vue';
import EditTabAnimation from '@/components/builder-controls/reusable-controls/element/EditTabAnimation.vue';

import BaseEditControls from '@/components/builder-controls/BaseEditControls.vue';
import NpsRateFeature from '@/components/ui/NpsRateFeature.vue';
import { NPS_TYPE_FEATURE_FORM } from '@/constants';
import { useI18n } from 'vue-i18n';

import {
	defineComponent,
	ref,
} from 'vue';

export default defineComponent({
	components: {
		ZyroPopup,
		ZyroPopupCard,
		BaseEditControls,
		EditFormTabStyle,
		EditFormTabFields,
		EditFormTabButton,
		EditFormTabGeneral,
		NpsRateFeature,
		EditTabAnimation,
	},

	setup() {
		const { t } = useI18n();
		const tabs = [
			{
				title: t('common.general'),
				component: 'EditFormTabGeneral',
			},
			{
				title: t('common.fields'),
				component: 'EditFormTabFields',
			},
			{
				title: t('common.button'),
				component: 'EditFormTabButton',
			},
			{
				title: t('common.style'),
				component: 'EditFormTabStyle',
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
			NPS_TYPE_FEATURE_FORM,
		};
	},
});
</script>
