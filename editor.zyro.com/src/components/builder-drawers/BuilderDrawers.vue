<template>
	<Component
		:is="activeDrawer"
		v-if="activeDrawer"
	/>
</template>

<script>
import ChooseStoreDrawer from '@/components/builder-drawers/drawers/partials/ecommerceStoreDrawer/ChooseStoreDrawer.vue';
import AddElementDrawer from '@/components/builder-drawers/drawers/AddElementDrawer.vue';
import GamificationDrawer from '@/components/builder-drawers/drawers/GamificationDrawer.vue';
import AiWriterDrawer from '@/components/builder-drawers/drawers/AiWriterDrawer.vue';
import BlogDrawer from '@/components/builder-drawers/drawers/BlogDrawer.vue';
import GlobalStylesDrawer from '@/components/builder-drawers/drawers/GlobalStylesDrawer.vue';
import HelpAndResourcesDrawer from '@/components/builder-drawers/drawers/HelpAndResourcesDrawer.vue';
import ManageStoreDrawer from '@/components/builder-drawers/drawers/ManageStoreDrawer.vue';
import MultiPageDrawer from '@/components/builder-drawers/drawers/MultiPageDrawer.vue';
import MultilingualDrawer from '@/components/builder-drawers/drawers/MultilingualDrawer.vue';
import UserStylesDrawer from '@/components/builder-drawers/drawers/UserStylesDrawer.vue';
import DrawerPageSeo from '@/components/DrawerPageSeo.vue';

import {
	DRAWER_USER_STYLES,
	DRAWER_GLOBAL_STYLES,
	DRAWER_BLOG,
	DRAWER_MULTI_PAGE,
	DRAWER_ADD_ELEMENT,
	DRAWER_ADD_ONLINE_STORE,
	DRAWER_MULTILINGUAL,
	DRAWER_MANAGE_STORE,
	DRAWER_HELP_AND_RESOURCES,
	DRAWER_GAMIFICATION,
	DRAWER_PAGE_SEO,
} from '@/constants';
import { mapStateGui } from '@/store/builder/gui';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		AiWriterDrawer,
		[DRAWER_GAMIFICATION]: GamificationDrawer,
		[DRAWER_USER_STYLES]: UserStylesDrawer,
		[DRAWER_GLOBAL_STYLES]: GlobalStylesDrawer,
		[DRAWER_BLOG]: BlogDrawer,
		[DRAWER_MULTI_PAGE]: MultiPageDrawer,
		[DRAWER_ADD_ELEMENT]: AddElementDrawer,
		[DRAWER_MULTILINGUAL]: MultilingualDrawer,
		[DRAWER_ADD_ONLINE_STORE]: ChooseStoreDrawer,
		[DRAWER_MANAGE_STORE]: ManageStoreDrawer,
		[DRAWER_HELP_AND_RESOURCES]: HelpAndResourcesDrawer,
		[DRAWER_PAGE_SEO]: DrawerPageSeo,
	},

	computed: mapStateGui(['activeDrawer']),
});
</script>
