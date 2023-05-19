<template>
	<Component
		:is="currentEditBlockSlideshowComponent"
		:start-tab-id="startTabId"
		@close="closeEditBlockSlideshowComponent"
	/>
</template>

<script>
import {
	onMounted,
	defineComponent,
} from 'vue';

import EditBlockImageSlideshowSettingsTabs from '@/components/builder-controls/edit-block-image-slideshow/EditBlockImageSlideshowSettingsTabs.vue';
import { useEditBlockImageSlideshow } from '@/components/builder-controls/edit-block-image-slideshow/use/useEditBlockImageSlideshow';

export default defineComponent({
	components: {
		EditBlockImageSlideshowSettingsTabs,
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
		} = useEditBlockImageSlideshow(props, context);

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
