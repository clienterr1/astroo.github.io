<template>
	<div>
		<ZyroFieldToggle
			id="editBlockSlideshowIsAutoplayEnabledToggle"
			:label="$t('builder.editSlideshow.settings.autoplaySlideshow')"
			:model-value="isAutoplayEnabled"
			@update:model-value="setSlideshowSetting('isAutoplayEnabled', $event)"
		/>
		<ZyroSeparator />
		<ZyroFieldRange
			v-if="isAutoplayEnabled"
			:label="$t('builder.editSlideshow.settings.howLongBetweenLoop')"
			:model-value="autoplayInterval"
			min="1"
			max="10"
			:units="$t('common.sec')"
			@update:model-value="setSlideshowSetting('autoplayInterval', parseInt($event, 10))"
		/>
		<ZyroFieldToggle
			id="editBlockSlideshowIsLoopEnabledToggle"
			:label="$t('builder.editSlideshow.settings.loopSlides')"
			:model-value="isLoopEnabled"
			@update:model-value="setSlideshowSetting('isLoopEnabled', $event)"
		/>
	</div>
</template>
<script>
import ZyroFieldRange from '@/components/global/ZyroFieldRange.vue';
import ZyroFieldToggle from '@/components/global/ZyroFieldToggle.vue';
import ZyroSeparator from '@/components/global/ZyroSeparator.vue';
import {
	computed,
	defineComponent,
} from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
	components: {
		ZyroFieldRange,
		ZyroFieldToggle,
		ZyroSeparator,
	},

	setup() {
		const {
			state,
			dispatch,
			getters,
		} = useStore();
		const isAutoplayEnabled = computed(() => getters.currentBlock.isAutoplayEnabled);
		const isLoopEnabled = computed(() => getters.currentBlock.isLoopEnabled);
		const autoplayInterval = computed(() => getters.currentBlock.autoplayInterval);

		const setSlideshowSetting = (settingName, settingValue) => {
			dispatch('updateBlockData', {
				blockId: state.currentBlockId,
				blockData: {
					[settingName]: settingValue,
				},
				merge: true,
			});
		};

		return {
			isAutoplayEnabled,
			isLoopEnabled,
			setSlideshowSetting,
			autoplayInterval,
		};
	},
});
</script>
