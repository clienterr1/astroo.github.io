<template>
	<div>
		<ZyroTabs
			:tabs="DRAWER_GLOBAL_STYLES_TABS"
			:current-tab="currentTab"
			class="drawer__tabs"
			@update:current-tab="changeCurrentTab({
				drawer: DRAWER_GLOBAL_STYLES,
				tab: $event
			})"
		/>

		<Component
			:is="currentTab.id"
			@change-page="$emit('change-page', $event)"
		/>
	</div>
</template>

<script>
import ZyroTabs from '@/components/global/ZyroTabs.vue';

import {
	DRAWER_GLOBAL_STYLES_TABS,
	DRAWER_GLOBAL_STYLES,
} from '@/constants';
import Elements from '@/components/builder-drawers/drawers/partials/globalStylesDrawer/elements/Elements.vue';
import Typography from '@/components/builder-drawers/drawers/partials/globalStylesDrawer/typography/Typography.vue';
import { useDrawerTabs } from '@/components/builder-drawers/drawers/use/useDrawerTabs';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroTabs,
		Typography,
		Elements,
	},

	setup() {
		const {
			currentTabs,
			changeCurrentTab,
		} = useDrawerTabs();

		return {
			currentTabs,
			changeCurrentTab,
			DRAWER_GLOBAL_STYLES_TABS,
			DRAWER_GLOBAL_STYLES,
		};
	},

	computed: {
		currentTab() {
			return this.currentTabs[DRAWER_GLOBAL_STYLES];
		},
	},
});
</script>

<style lang="scss" scoped>
@import "@/components/builder-drawers/drawers/StylesDrawer";
</style>
