<template>
	<ZyroPopupCard
		type="editor"
		:title="$t('common.onlineStore')"
		:tabs="tabs"
		:current-tab="currentTab"
		@update:current-tab="currentTab = $event"
		@close="$emit('close')"
	>
		<Component
			:is="currentTab.component"
			@close="$emit('close')"
		/>
	</ZyroPopupCard>
</template>

<script>
import ZyroPopup from '@/components/global/ZyroPopup.vue';
import ZyroPopupCard from '@/components/global/ZyroPopupCard.vue';

import EditBlockTabBackground from '@/components/builder-controls/edit-block/EditBlockTabBackground.vue';
import EditBlockPadding from '@/components/builder-controls/reusable-controls/block/EditBlockPadding.vue';
import { useI18n } from 'vue-i18n';

import {
	defineComponent,
	ref,
} from 'vue';

export default defineComponent({
	components: {
		ZyroPopup,
		ZyroPopupCard,
		EditBlockTabBackground,
		EditBlockPadding,
	},

	props: {
		startTabId: {
			type: String,
			default: '',
		},
	},

	setup(props) {
		const { t } = useI18n();

		const tabs = [
			{
				id: 'layout',
				title: t('common.layout'),
				component: 'EditBlockPadding',
			},
			{
				id: 'background',
				title: t('common.background'),
				component: 'EditBlockTabBackground',
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
