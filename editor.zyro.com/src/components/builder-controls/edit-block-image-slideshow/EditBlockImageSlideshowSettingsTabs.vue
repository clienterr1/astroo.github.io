<template>
	<ZyroPopupCard
		type="editor"
		:title="$t('builder.editSlideshow.settings.title')"
		:tabs="tabs"
		:current-tab="currentTab"
		@update:current-tab="currentTab = $event"
		@close="$emit('close')"
	>
		<EditBlockSlideshowSettingsTabStyle
			v-if="currentTab?.id === 'style'"
			@close="$emit('close')"
		/>
		<EditBlockSlideshowSettingsTabSettings
			v-if="currentTab?.id === 'settings'"
			@close="$emit('close')"
		/>
	</ZyroPopupCard>
</template>

<script>
import ZyroPopupCard from '@/components/global/ZyroPopupCard.vue';

import {
	defineComponent,
	ref,
} from 'vue';

import EditBlockSlideshowSettingsTabSettings from '@/components/builder-controls/edit-block-image-slideshow/EditBlockImageSlideshowSettingsTabSettings.vue';
import EditBlockSlideshowSettingsTabStyle from '@/components/builder-controls/edit-block-image-slideshow/EditBlockImageSlideshowSettingsTabStyle.vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
	components: {
		ZyroPopupCard,
		EditBlockSlideshowSettingsTabStyle,
		EditBlockSlideshowSettingsTabSettings,
	},

	props: {
		startTabId: {
			type: String,
			default: 'style',
		},
	},

	emits: ['close'],
	setup(props) {
		const { t } = useI18n();

		const tabs = [
			{
				id: 'style',
				title: t('common.style'),
			},
			{
				id: 'settings',
				title: t('common.settings'),
			},
		];

		const startingTab = tabs.find((tab) => tab.id === props.startTabId) || tabs[0].id;

		const currentTab = ref(startingTab);

		return {
			currentTab,
			tabs,
		};
	},
});
</script>
