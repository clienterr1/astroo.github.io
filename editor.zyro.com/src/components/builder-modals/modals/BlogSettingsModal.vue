<template>
	<ZyroModal
		:title="$t('common.blogSettings')"
		width="360px"
		height="auto"
		no-overflow
		class="settings-modal"
		@close-modal="closeModal"
	>
		<ZyroTabs
			:tabs="tabs"
			:current-tab="currentTab"
			@update:current-tab="currentTab = $event"
		/>
		<Component :is="currentTab.component" />
	</ZyroModal>
</template>

<script>

import {
	defineComponent,
	ref,
} from 'vue';
import { useI18n } from 'vue-i18n';

import ZyroModal from '@/components/global/ZyroModal.vue';
import ZyroTabs from '@/components/global/ZyroTabs.vue';

import BlogSettingsTabCategories from '@/components/builder-controls/blog-drawer/BlogSettingsTabCategories.vue';
import {
	mapActionsGui,
	CLOSE_MODAL,
} from '@/store/builder/gui';

export default defineComponent({
	components: {
		ZyroModal,
		ZyroTabs,
		BlogSettingsTabCategories,
	},

	setup() {
		const { t } = useI18n();
		const tabs = [
			{
				id: 'categories',
				title: t('common.categories'),
				component: 'BlogSettingsTabCategories',
			},
		];
		const currentTab = ref(tabs[0]);

		return {
			tabs,
			currentTab,
		};
	},

	methods: mapActionsGui({
		closeModal: CLOSE_MODAL,
	}),
});
</script>

<style lang="scss" scoped>
:deep(.settings-modal) {
	.modal {
		&__content {
			min-height: 450px;
		}
	}
}
</style>
