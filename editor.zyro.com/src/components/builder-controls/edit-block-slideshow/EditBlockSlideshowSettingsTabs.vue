<template>
	<ZyroPopupCard
		type="editor"
		:title="$t('builder.editSlideshow.settings.title')"
		:tabs="tabs"
		:current-tab="currentTab"
		@update:current-tab="setCurrentTab"
		@close="$emit('close')"
	>
		<Component
			:is="currentTab.component"
			v-if="currentTab"
			@close="$emit('close')"
		/>
	</ZyroPopupCard>
</template>

<script>
import ZyroPopup from '@/components/global/ZyroPopup.vue';
import ZyroPopupCard from '@/components/global/ZyroPopupCard.vue';

import {
	onMounted,
	defineComponent,
} from 'vue';

import EditBlockSlideshowSettingsTabSettings from '@/components/builder-controls/edit-block-slideshow/EditBlockSlideshowSettingsTabSettings.vue';
import EditBlockSlideshowSettingsTabSlides from '@/components/builder-controls/edit-block-slideshow/EditBlockSlideshowSettingsTabSlides.vue';
import EditBlockSlideshowSettingsTabStyle from '@/components/builder-controls/edit-block-slideshow/EditBlockSlideshowSettingsTabStyle.vue';
import { useEditBlockSlideshowSettings } from '@/components/builder-controls/edit-block-slideshow/use/useEditBlockSlideshowSettings';
import { useI18n } from 'vue-i18n';

export default defineComponent({
	components: {
		ZyroPopup,
		ZyroPopupCard,
		EditBlockSlideshowSettingsTabStyle,
		EditBlockSlideshowSettingsTabSettings,
		EditBlockSlideshowSettingsTabSlides,
	},

	props: {
		startTabId: {
			type: String,
			default: 'style',
		},
	},

	emits: ['close'],
	setup(props, context) {
		const {
			currentTab,
			setCurrentTab,
		} = useEditBlockSlideshowSettings(props, context);
		const { t } = useI18n();

		const tabs = [
			{
				id: 'slides',
				title: t('common.slides'),
				component: 'EditBlockSlideshowSettingsTabSlides',
			},
			{
				id: 'style',
				title: t('common.style'),
				component: 'EditBlockSlideshowSettingsTabStyle',
			},
			{
				id: 'settings',
				title: t('common.settings'),
				component: 'EditBlockSlideshowSettingsTabSettings',
			},
		];

		onMounted(() => {
			const startingTab = tabs.find((tab) => tab.id === props.startTabId) || tabs[0].id;

			setCurrentTab(startingTab);
		});

		return {
			currentTab,
			setCurrentTab,
			tabs,
		};
	},
});
</script>
