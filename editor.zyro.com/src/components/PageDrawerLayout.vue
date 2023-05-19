<template>
	<ZyroDrawer class="page-drawer-layout">
		<div class="page-drawer-layout__header-wrapper">
			<PageDrawerHeader
				:page-name="pageName"
				:is-home-page="isHomePage"
				@go-back="goBack"
			/>
			<slot name="header" />
		</div>

		<div class="page-drawer-layout__content">
			<slot name="content" />
		</div>
	</ZyroDrawer>
</template>

<script>
import PageDrawerHeader from '@/components/PageDrawerHeader.vue';
import ZyroDrawer from '@/components/global/ZyroDrawer.vue';

import {
	defineComponent,
	computed,
	onMounted,
} from 'vue';
import { useStore } from 'vuex';
import { DRAWER_MULTI_PAGE } from '@/constants';

export default defineComponent({
	components: {
		PageDrawerHeader,
		ZyroDrawer,
	},

	props: {
		pageId: {
			type: String,
			required: true,
		},
	},

	emits: ['go-back'],

	setup(props) {
		const {
			state,
			getters,
			dispatch,
		} = useStore();
		const sitePages = computed(() => getters.sitePages);
		const pageData = computed(() => sitePages.value[props.pageId]);
		const pageName = computed(() => pageData.value.name);
		const isHomePage = computed(() => getters.homePageId === props.pageId);
		const goBack = () => {
			const goBackCallback = state.gui.activeDrawerSettings?.goBackCallback;

			if (goBackCallback) {
				goBackCallback();

				return;
			}

			dispatch('gui/OPEN_DRAWER', {
				id: DRAWER_MULTI_PAGE,
			});
		};

		onMounted(() => {
			if (state.currentPageId !== props.pageId) {
				dispatch('updateCurrentPageId', props.pageId);
			}
		});

		return {
			pageName,
			isHomePage,
			goBack,
		};
	},
});
</script>
<style lang="scss" scoped>
.page-drawer-layout {
	display: flex;
	flex-direction: column;

	&__header-wrapper {
		padding: 24px;
		border-bottom: 1px solid $color-gray-border;
	}

	&__content {
		overflow-y: auto;
	}
}
</style>
