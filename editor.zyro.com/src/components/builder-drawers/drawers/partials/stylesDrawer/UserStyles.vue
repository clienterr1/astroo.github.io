<template>
	<div>
		<ZyroTabs
			class="tabs"
			:tabs="userStylesDrawerTabs"
			:current-tab="currentTab"
			@update:current-tab="changeCurrentTab({
				drawer: DRAWER_USER_STYLES,
				tab: $event
			})"
		/>

		<Component :is="currentTab.id" />
	</div>
</template>

<script>
import ZyroTabs from '@/components/global/ZyroTabs.vue';

import ButtonSetsLibrary from '@/components/builder-drawers/drawers/partials/stylesDrawer/buttons/ButtonSetsLibrary.vue';
import AnimationsLibrary from '@/components/builder-drawers/drawers/partials/stylesDrawer/animations/AnimationsLibrary.vue';
import GlobalColorsLibrary from '@/components/builder-drawers/drawers/partials/stylesDrawer/colors/GlobalColorsLibrary.vue';
import TypographyStyleList from '@/components/builder-drawers/drawers/partials/stylesDrawer/typograpghy/TypographyStyleList.vue';
import { useDrawerTabs } from '@/components/builder-drawers/drawers/use/useDrawerTabs';
import { DRAWER_USER_STYLES } from '@/constants';
import {
	computed,
	defineComponent,
} from 'vue';

export default defineComponent({
	components: {
		ZyroTabs,
		TypographyStyleList,
		GlobalColorsLibrary,
		ButtonSetsLibrary,
		AnimationsLibrary,
	},

	setup() {
		const {
			currentTabs,
			changeCurrentTab,
			userStylesDrawerTabs,
		} = useDrawerTabs();

		const currentTab = computed(() => currentTabs[DRAWER_USER_STYLES]);

		return {
			currentTab,
			changeCurrentTab,
			currentTabs,
			userStylesDrawerTabs,
			DRAWER_USER_STYLES,
		};
	},
});
</script>

<style lang="scss" scoped>
@import "@/components/builder-drawers/drawers/StylesDrawer";

.tabs {
	margin-bottom: 16px;
}
</style>
