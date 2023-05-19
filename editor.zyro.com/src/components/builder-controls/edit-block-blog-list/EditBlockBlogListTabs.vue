<template>
	<ZyroPopupCard
		type="editor"
		title="Blog list"
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

import EditBlockBlogListTabCategories from '@/components/builder-controls/edit-block-blog-list/EditBlockBlogListTabCategories.vue';
import EditBlockBlogListTabLayout from '@/components/builder-controls/edit-block-blog-list/EditBlockBlogListTabLayout.vue';
import EditBlockBlogListTabStyle from '@/components/builder-controls/edit-block-blog-list/EditBlockBlogListTabStyle.vue';

import EditBlockTabBackground from '@/components/builder-controls/edit-block/EditBlockTabBackground.vue';
import { useI18n } from 'vue-i18n';

import {
	defineComponent,
	ref,
} from 'vue';

export default defineComponent({
	components: {
		ZyroPopup,
		ZyroPopupCard,
		EditBlockBlogListTabLayout,
		EditBlockBlogListTabStyle,
		EditBlockBlogListTabCategories,
		EditBlockTabBackground,
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
				id: 'layout',
				title: t('common.layout'),
				component: 'EditBlockBlogListTabLayout',
			},
			{
				id: 'style',
				title: t('common.style'),
				component: 'EditBlockBlogListTabStyle',
			},
			{
				id: 'categories',
				title: t('common.posts'),
				component: 'EditBlockBlogListTabCategories',
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
