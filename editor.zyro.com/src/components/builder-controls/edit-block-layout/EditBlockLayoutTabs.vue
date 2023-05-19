<template>
	<ZyroPopupCard
		type="editor"
		:title="$t('builder.sectionSettings.title')"
		:tabs="tabs"
		:current-tab="currentTab"
		@update:current-tab="currentTab = $event"
		@close="$emit('close')"
	>
		<Component :is="currentTab.component" />
	</ZyroPopupCard>
</template>

<script>
import ZyroPopup from '@/components/global/ZyroPopup.vue';
import ZyroPopupCard from '@/components/global/ZyroPopupCard.vue';

import EditBlockTabAnchor from '@/components/builder-controls/edit-block/EditBlockTabAnchor.vue';
import EditBlockTabBackground from '@/components/builder-controls/edit-block/EditBlockTabBackground.vue';
import EditBlockLayoutTabLayout from '@/components/builder-controls/edit-block-layout/EditBlockLayoutTabLayout.vue';
import {
	defineComponent,
	ref,
} from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
	components: {
		ZyroPopup,
		ZyroPopupCard,
		EditBlockTabBackground,
		EditBlockTabAnchor,
		EditBlockLayoutTabLayout,
	},

	props: {
		startTabId: {
			type: String,
			default: null,
		},
	},

	setup(props) {
		const { t } = useI18n();
		const tabs = [
			{
				id: 'background',
				title: t('common.background'),
				component: 'EditBlockTabBackground',
			},
			{
				id: 'layout',
				title: t('common.layout'),
				component: 'EditBlockLayoutTabLayout',
			},
			{
				id: 'anchor',
				title: t('common.anchor'),
				component: 'EditBlockTabAnchor',
			},
		];
		const initialTab = tabs.find((tab) => tab.id === props.startTabId) ?? tabs[0];
		const currentTab = ref(initialTab);

		return {
			tabs,
			currentTab,
		};
	},
});
</script>
