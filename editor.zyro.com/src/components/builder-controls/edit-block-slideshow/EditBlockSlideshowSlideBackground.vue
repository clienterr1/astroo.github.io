<template>
	<ZyroPopupCard
		type="editor"
		:title="$t('builder.editSlideshow.background.title')"
		@close="$emit('close')"
	>
		<ZyroBackground
			:model-value="currentSlideshowSlideBackground"
			@update:model-value="setSlideBackground"
		/>
	</ZyroPopupCard>
</template>

<script>
import ZyroBackground from '@/components/global/ZyroBackground.vue';
import ZyroPopupCard from '@/components/global/ZyroPopupCard.vue';

import { useEditBlockSlideshowSlideBackground } from '@/components/builder-controls/edit-block-slideshow/use/useEditBlockSlideshowSlideBackground';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroBackground,
		ZyroPopupCard,
	},

	setup(props, context) {
		const {
			currentSlideshowSlideBackground,
			setSlideBackground,
		} = useEditBlockSlideshowSlideBackground(props, context);

		return {
			currentSlideshowSlideBackground,
			setSlideBackground,
		};
	},
});
</script>
