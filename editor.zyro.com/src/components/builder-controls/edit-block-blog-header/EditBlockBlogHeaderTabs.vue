<template>
	<ZyroPopupCard
		type="editor"
		:title="$t('builder.blog.blogPostHeader.postHeader')"
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

import EditBlockBlogHeaderTabLayout from '@/components/builder-controls/edit-block-blog-header/EditBlockBlogHeaderTabLayout.vue';
import EditBlockBlogHeaderTabStyle from '@/components/builder-controls/edit-block-blog-header/EditBlockBlogHeaderTabStyle.vue';

import EditBlockTabBackground from '@/components/builder-controls/edit-block/EditBlockTabBackground.vue';
import {
	defineComponent,
	ref,
} from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
	components: {
		ZyroPopup,
		ZyroPopupCard,
		EditBlockBlogHeaderTabStyle,
		EditBlockBlogHeaderTabLayout,
		EditBlockTabBackground,
	},

	setup() {
		const { t } = useI18n();
		const tabs = [
			{
				id: 'style',
				title: t('common.style'),
				component: 'EditBlockBlogHeaderTabStyle',
			},
			{
				id: 'layout',
				title: t('common.layout'),
				component: 'EditBlockBlogHeaderTabLayout',
			},
			{
				id: 'background',
				title: t('common.background'),
				component: 'EditBlockTabBackground',
			},
		];
		const currentTab = ref(tabs[0]);

		return {
			tabs,
			currentTab,
		};
	},
});
</script>
