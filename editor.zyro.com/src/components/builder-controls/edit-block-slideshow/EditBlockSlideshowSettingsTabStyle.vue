<template>
	<div
		class="style"
		:style="computedStyles"
	>
		<ZyroLabel>{{ $t('common.controls') }}</ZyroLabel>
		<div class="style__controls">
			<div
				v-for="(control, index) in CONTROLS"
				:key="`${control.isNavigationBulletsVisible}${index}`"
				class="style__control-container"
				:class="{ 'style__control-container--active': isNavigationControlSelected(control) }"
				@click="setNavigationControlVisibility(control)"
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
					v-if="control.isNavigationBulletsVisible"
					class="style__bullet-buttons"
				>
					<div
						v-for="(button, indexBulletButton) in BULLET_BUTTON_COUNT"
						:key="`${button}${indexBulletButton}`"
						class="style__bullet-button"
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
			:is-open="isBulletColorPickerOpen"
			:label="$t('builder.editSlideshow.settings.navigationBulletsColor')"
			:model-value="slideshowNavigationBulletsColor"
			class="style__color-input"
			placement="left-start"
			@update:model-value="setSlideshowStyle('navigationBulletsColor', $event)"
			@toggle="isBulletColorPickerOpen = !isBulletColorPickerOpen"
			@click-outside="isBulletColorPickerOpen = false"
		/>
		<ZyroFieldToggle
			v-if="!isMobileMode"
			id="isBlockSlideshowGridGapsEnabled"
			:model-value="isSlideshowGridGapsEnabled"
			:label="$t('builder.editBlockTabLayout.toggleFieldLabel')"
			@update:model-value="toggleSlideshowGridGaps"
		/>
		<ZyroSeparator />
		<ZyroCssShorthandControl
			class="layout__padding"
			:label="$t('common.padding')"
			:model-value="slideshowPadding"
			:title-vertical="$t('common.vertical')"
			:title-horizontal="$t('common.horizontal')"
			units="px"
			input-type="number"
			@update:model-value="setSlideshowStyle('block-padding', $event)"
		/>
	</div>
</template>

<script>
import ZyroFieldColorPicker from '@/components/global/ZyroFieldColorPicker.vue';
import ZyroCssShorthandControl from '@/components/global/ZyroCssShorthandControl.vue';
import ZyroFieldToggle from '@/components/global/ZyroFieldToggle.vue';
import ZyroLabel from '@/components/global/ZyroLabel.vue';
import ZyroSeparator from '@/components/global/ZyroSeparator.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import {
	computed,
	defineComponent,
} from 'vue';
import { mapGetters } from 'vuex';

import { useEditBlockSlideshowSettings } from '@/components/builder-controls/edit-block-slideshow/use/useEditBlockSlideshowSettings';

const CONTROLS = {
	allControls: {
		isNavigationBulletsVisible: true,
		isNavigationArrowsVisible: true,
	},
	navigationArrowsControls: {

		isNavigationBulletsVisible: false,
		isNavigationArrowsVisible: true,
	},
	bulletButtonControls: {
		isNavigationBulletsVisible: true,
		isNavigationArrowsVisible: false,
	},
};

const BULLET_BUTTON_COUNT = 3;

export default defineComponent({
	components: {
		ZyroFieldColorPicker,
		ZyroCssShorthandControl,
		ZyroFieldToggle,
		ZyroLabel,
		ZyroSeparator,
		ZyroSvgDeprecated,
	},

	setup(props, context) {
		const {
			currentBlockStyles,
			slideshowNavigationArrowsColor,
			slideshowNavigationBulletsColor,
			isSlideshowNavigationArrowsVisible,
			isSlideshowNavigationBulletsVisible,
			isSlideshowGridGapsEnabled,
			slideshowPadding,
			toggleSlideshowGridGaps,
			setSlideshowStyle,
			setSlideshowSetting,
		} = useEditBlockSlideshowSettings(props, context);

		const computedStyles = computed(() => ({
			'--navigationArrowsColor': currentBlockStyles?.value.navigationArrowsColor,
			'--navigationBulletsColor': currentBlockStyles?.value.navigationBulletsColor,
		}));

		const setNavigationControlVisibility = ({
			isNavigationBulletsVisible,
			isNavigationArrowsVisible,
		}) => {
			setSlideshowSetting('isNavigationBulletsVisible', isNavigationBulletsVisible);
			setSlideshowSetting('isNavigationArrowsVisible', isNavigationArrowsVisible);
		};

		const isNavigationControlSelected = (
			control,
		) => isSlideshowNavigationBulletsVisible.value === control.isNavigationBulletsVisible
			&& isSlideshowNavigationArrowsVisible.value === control.isNavigationArrowsVisible;

		return {
			computedStyles,
			slideshowNavigationArrowsColor,
			slideshowNavigationBulletsColor,
			slideshowPadding,
			setSlideshowStyle,
			toggleSlideshowGridGaps,
			setNavigationControlVisibility,
			isSlideshowGridGapsEnabled,
			isNavigationControlSelected,
			CONTROLS,
			BULLET_BUTTON_COUNT,
		};
	},

	data() {
		return {
			isArrowColorPickerOpen: false,
			isBulletColorPickerOpen: false,
		};
	},

	computed: {
		...mapGetters('gui', ['isMobileMode']),
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

	&__bullet-buttons {
		display: grid;
		grid-template-columns: repeat(3, 5px);
		grid-gap: 4px;
		justify-content: center;
		margin-top: auto;
	}

	&__bullet-button {
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
