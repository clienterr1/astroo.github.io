<template>
	<div
		class="edit-style-container"
		:class="{ 'edit-style-container--active': isActive }"
	>
		<div class="edited edit-style-container__content">
			{{ $t('common.edited') }}
		</div>
	</div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
	props: {
		isActive: {
			type: Boolean,
			default: false,
		},
	},
});
</script>

<style lang="scss" scoped>
@import "@/components/builder-drawers/drawers/partials/stylesDrawer/UserStyles";

.edited {
	padding-bottom: 8px;
	text-align: left;
}
</style>
