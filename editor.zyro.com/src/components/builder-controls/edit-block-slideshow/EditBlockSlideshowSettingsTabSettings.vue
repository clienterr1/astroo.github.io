<template>
	<div>
		<ZyroFieldToggle
			id="editBlockSlideshowIsAutoplayEnabledToggle"
			:label="$t('builder.editSlideshow.settings.autoplaySlideshow')"
			:model-value="isSlideshowAutoplayEnabled"
			@update:model-value="setSlideshowSetting('isAutoplayEnabled', $event)"
		/>
		<ZyroSeparator />
		<ZyroFieldRange
			v-if="isSlideshowAutoplayEnabled"
			:label="$t('builder.editSlideshow.settings.howLongBetweenLoop')"
			:model-value="slideshowAutoplayIntervalSeconds"
			min="1"
			max="10"
			:units="$t('common.sec')"
			@update:model-value="setSlideshowSetting('autoplaySlidesIntervalSeconds', Number($event))"
		/>
		<ZyroFieldToggle
			id="editBlockSlideshowIsLoopEnabledToggle"
			:label="$t('builder.editSlideshow.settings.loopSlides')"
			:model-value="isSlideshowLoopEnabled"
			@update:model-value="setSlideshowSetting('isLoopEnabled', $event)"
		/>
		<ZyroFieldToggle
			id="editBlockSlideshowIsMobileFullScreenHeightToggle"
			:label="$t('builder.editSlideshow.settings.fullSreenHeight')"
			:model-value="isSlideshowMobileFullScreenHeightEnabled"
			@update:model-value="setSlideshowSetting('isMobileFullScreenHeightEnabled', $event)"
		/>
	</div>
</template>
<script>
import ZyroFieldRange from '@/components/global/ZyroFieldRange.vue';
import ZyroFieldToggle from '@/components/global/ZyroFieldToggle.vue';
import ZyroSeparator from '@/components/global/ZyroSeparator.vue';

import { useEditBlockSlideshowSettings } from '@/components/builder-controls/edit-block-slideshow/use/useEditBlockSlideshowSettings';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroFieldRange,
		ZyroFieldToggle,
		ZyroSeparator,
	},

	setup(props, context) {
		const {
			isSlideshowAutoplayEnabled,
			isSlideshowLoopEnabled,
			isSlideshowMobileFullScreenHeightEnabled,
			slideshowAutoplayIntervalSeconds,
			setSlideshowSetting,
		} = useEditBlockSlideshowSettings(props, context);

		return {
			isSlideshowAutoplayEnabled,
			isSlideshowLoopEnabled,
			isSlideshowMobileFullScreenHeightEnabled,
			slideshowAutoplayIntervalSeconds,
			setSlideshowSetting,
		};
	},
});
</script>
