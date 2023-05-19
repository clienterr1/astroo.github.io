<template>
	<div
		class="style"
	>
		<ZyroLabel>{{ $t('common.controls') }}</ZyroLabel>
		<div class="style__controls">
			<div
				v-for="(control, controlId) in CONTROLS"
				:key="controlId"
				class="style__control-container"
				:class="{ 'style__control-container--active': isNavigationControlSelected(control) }"
				@click="setSlideshowControls(control)"
			>
				<div
					v-if="control.isNavigationArrowsVisible"
					class="style__navigation-arrows"
				>
					<ZyroSvgDeprecated
						name="chevron"
						direction="left"
						dimensions="8px"
					/>
					<ZyroSvgDeprecated
						name="chevron"
						direction="right"
						dimensions="8px"
					/>
				</div>
				<div
					v-if="control.isNavigationDotsVisible"
					class="style__dots"
				>
					<div
						v-for="dotIndex in DOT_COUNT"
						:key="dotIndex"
						class="style__dot"
					/>
				</div>
			</div>
		</div>
		<ZyroFieldColorPicker
			:is-open="isArrowColorPickerOpen"
			:label="$t('builder.editSlideshow.settings.navigationArrowsColor')"
			:model-value="slideshowNavigationArrowsColor"
			class="style__color-input"
			placement="left-start"
			@update:model-value="setSlideshowStyle('navigationArrowsColor', $event)"
			@toggle="isArrowColorPickerOpen = !isArrowColorPickerOpen"
			@click-outside="isArrowColorPickerOpen = false"
		/>
		<ZyroFieldColorPicker
			:is-open="isDotColorPickerOpen"
			:label="$t('builder.editSlideshow.settings.navigationBulletsColor')"
			:model-value="slideshowNavigationDotsColor"
			class="style__color-input"
			placement="left-start"
			@update:model-value="setSlideshowStyle('navigationDotsColor', $event)"
			@toggle="isDotColorPickerOpen = !isDotColorPickerOpen"
			@click-outside="isDotColorPickerOpen = false"
		/>
	</div>
</template>

<script>

import {
	computed,
	defineComponent,
	ref,
} from 'vue';
import ZyroLabel from '@/components/global/ZyroLabel.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';
import ZyroFieldColorPicker from '@/components/global/ZyroFieldColorPicker.vue';
import { useStore } from 'vuex';

const CONTROLS = {
	allControls: {
		isNavigationDotsVisible: true,
		isNavigationArrowsVisible: true,
	},
	navigationArrowsControls: {
		isNavigationDotsVisible: false,
		isNavigationArrowsVisible: true,
	},
	dotButtonControls: {
		isNavigationDotsVisible: true,
		isNavigationArrowsVisible: false,
	},
};

const DOT_COUNT = 3;

export default defineComponent({
	components: {
		ZyroLabel,
		ZyroSvgDeprecated,
		ZyroFieldColorPicker,
	},

	setup() {
		const {
			getters,
			state,
			dispatch,
		} = useStore();
		const isArrowColorPickerOpen = ref(false);
		const isDotColorPickerOpen = ref(false);
		const slideshowNavigationArrowsColor = computed(() => getters.currentBlockStyles.navigationArrowsColor);
		const slideshowNavigationDotsColor = computed(() => getters.currentBlockStyles.navigationDotsColor);
		const currentDotsVisible = computed(() => getters.currentBlock.isNavigationDotsVisible);
		const currentArrowsVisible = computed(() => getters.currentBlock.isNavigationArrowsVisible);

		const setSlideshowControls = ({
			isNavigationDotsVisible,
			isNavigationArrowsVisible,
		}) => {
			dispatch('updateBlockData', {
				blockId: state.currentBlockId,
				blockData: {
					isNavigationDotsVisible,
					isNavigationArrowsVisible,
				},
				merge: true,
			});
		};

		const isNavigationControlSelected = (control) => (
			control.isNavigationDotsVisible === currentDotsVisible.value
			&& control.isNavigationArrowsVisible === currentArrowsVisible.value
		);

		const setSlideshowStyle = (styleName, styleValue) => {
			dispatch('updateBlockData', {
				blockId: state.currentBlockId,
				blockData: {
					settings: {
						styles: {
							[styleName]: styleValue,
						},
					},
				},
				merge: true,
			});
		};

		return {
			slideshowNavigationArrowsColor,
			slideshowNavigationDotsColor,
			isArrowColorPickerOpen,
			isDotColorPickerOpen,
			isNavigationControlSelected,
			setSlideshowControls,
			setSlideshowStyle,
			CONTROLS,
			DOT_COUNT,
		};
	},
});
</script>

<style lang="scss" scoped>
.style {
	$this: &;

	&__controls {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-gap: 8px;
		margin: 8px 0 16px;
	}

	&__control-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		width: 102px;
		height: 64px;
		padding: 8px 16px;
		cursor: pointer;
		border: 1px solid $color-gray-border;
		border-radius: 5px;
		transition: background-color 0.1s ease, border-color 0.1s ease;

		&:first-child {
			#{$this}__navigation-arrows {
				margin-top: auto;
			}
		}

		&--active {
			background: $color-gray-light;
			border-color: $color-azure;
		}
	}

	&__navigation-arrows {
		display: flex;
		justify-content: space-between;
		color: $color-gray;
	}

	&__dots {
		display: grid;
		grid-template-columns: repeat(3, 5px);
		grid-gap: 4px;
		justify-content: center;
		margin-top: auto;
	}

	&__dot {
		width: 5px;
		height: 5px;
		background-color: $color-gray;
		border-radius: 50px;
		opacity: 0.5;

		&:first-child {
			background-color: $color-gray;
			opacity: 1;
		}
	}

	&__color-input {
		padding: 8px 0;
	}
}
</style>
