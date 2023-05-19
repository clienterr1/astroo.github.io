<template>
	<div
		class="edit-style-container"
		:class="{ 'edit-style-container--active': isActive }"
	>
		<ZyroSeparator class="separator" />
		<div class="edit-style-container__content z-body-small">
			<ZyroSvgDeprecated name="styles-brush" />
			<span class="margin-left">{{ title }}</span>
		</div>
	</div>
</template>

<script>
import ZyroSeparator from '@/components/global/ZyroSeparator.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroSeparator,
		ZyroSvgDeprecated,
	},

	props: {
		isActive: {
			type: Boolean,
			default: false,
		},
		title: {
			type: String,
			default: null,
		},
	},
});
</script>

<style lang="scss" scoped>
@import "@/components/builder-drawers/drawers/partials/stylesDrawer/UserStyles";

.separator {
	margin: 16px 0;
}

.margin-left {
	margin-left: 8px;
}
</style>
