<template>
	<Component
		:is="currentEditBlockSlideshowComponent"
		:start-tab-id="startTabId"
		@close="closeEditBlockSlideshowComponent"
	/>
</template>

<script>
// Current open component will be controlled via useEditBlockSlideshow composable with next PR
import {
	onMounted,
	defineComponent,
} from 'vue';

import EditBlockSlideshowSettingsTabSlides from '@/components/builder-controls/edit-block-slideshow/EditBlockSlideshowSettingsTabSlides.vue';
import EditBlockSlideshowSettingsTabs from '@/components/builder-controls/edit-block-slideshow/EditBlockSlideshowSettingsTabs.vue';
import EditBlockSlideshowSlideBackground from '@/components/builder-controls/edit-block-slideshow/EditBlockSlideshowSlideBackground.vue';
import { useEditBlockSlideshow } from '@/components/builder-controls/edit-block-slideshow/use/useEditBlockSlideshow';

export default defineComponent({
	components: {
		EditBlockSlideshowSettingsTabSlides,
		EditBlockSlideshowSettingsTabs,
		EditBlockSlideshowSlideBackground,
	},

	props: {
		startingPopupComponent: {
			type: String,
			default: '',
		},
		startTabId: {
			type: String,
			default: 'styles',
		},
	},

	setup(props, context) {
		const {
			currentEditBlockSlideshowComponent,
			setEditBlockSlideshowComponent,
			closeEditBlockSlideshowComponent,
		} = useEditBlockSlideshow(props, context);

		onMounted(() => {
			setEditBlockSlideshowComponent(props.startingPopupComponent);
		});

		return {
			closeEditBlockSlideshowComponent,
			currentEditBlockSlideshowComponent,
		};
	},
});
</script>
