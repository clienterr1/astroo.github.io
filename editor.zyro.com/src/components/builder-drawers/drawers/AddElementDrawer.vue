<template>
	<ZyroDrawer class="add-element-drawer">
		<div class="add-element-drawer__header">
			<p class="add-element-drawer__title z-h5">
				{{ $t('common.addElements') }}
			</p>
			<p class="add-element-drawer__description z-body-small">
				{{ $t('builder.dragAndDropElements') }}
			</p>
		</div>
		<AddElementList />
	</ZyroDrawer>
</template>

<script>
import ZyroDrawer from '@/components/global/ZyroDrawer.vue';

import AddElementList from '@/components/builder-controls/add-element/AddElementList.vue';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroDrawer,
		AddElementList,
	},
});
</script>

<style lang="scss" scoped>
.add-element-drawer {
	padding: 24px;
	padding-bottom: 88px;

	&__header {
		margin-bottom: 16px;
	}

	&__title {
		margin-bottom: 8px;
	}

	&__description {
		color: $color-gray;
	}
}
</style>
