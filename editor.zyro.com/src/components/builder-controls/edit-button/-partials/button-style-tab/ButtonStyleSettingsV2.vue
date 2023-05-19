<template>
	<div class="button-style-settings">
		<ZyroSegmentControl
			class="button-style-settings__button-state"
			:controls="buttonStates"
			:active-control="currentStateTab"
			@update:active-control="setButtonState"
		/>

		<div class="button-style-settings__group">
			<ZyroFieldColorPicker
				v-if="isEditingHoverState"
				:is-open="isBackgroundColorPickerOpen"
				:label="$t('builder.editButton.customButtonStyles.fillColor')"
				class="button-style-settings__item"
				:model-value="fillColorHover"
				:data-qa="'button-style-settings-fill-color-picker-hover'"
				@click-outside="isBackgroundColorPickerOpen = false"
				@toggle="isBackgroundColorPickerOpen = !isBackgroundColorPickerOpen"
				@update:model-value="setButtonColor(
					$event,
					{ localStylesProperty: 'backgroundColorHover' }
				)"
			/>
			<ZyroFieldColorPicker
				v-else
				:is-open="isBackgroundColorPickerOpen"
				:label="$t('builder.editButton.customButtonStyles.fillColor')"
				class="button-style-settings__item"
				:model-value="fillColor"
				:data-qa="'button-style-settings-fill-color-picker-default'"
				@click-outside="isBackgroundColorPickerOpen = false"
				@toggle="isBackgroundColorPickerOpen = !isBackgroundColorPickerOpen"
				@update:model-value="setButtonColor(
					$event,
					{ localStylesProperty: 'backgroundColor' }
				)"
			/>
		</div>

		<div class="button-style-settings__group">
			<ZyroFieldColorPicker
				v-if="isEditingHoverState"
				:is-open="isFontColorPickerOpen"
				:label="$t('builder.editButton.customButtonStyles.textColor')"
				class="button-style-settings__item"
				:model-value="fontColorHover"
				:data-qa="'button-style-settings-font-color-picker-hover'"
				@click-outside="isFontColorPickerOpen = false"
				@toggle="isFontColorPickerOpen = !isFontColorPickerOpen"
				@update:model-value="setButtonColor(
					$event,
					{ localStylesProperty: 'fontColorHover' }
				)"
			/>
			<ZyroFieldColorPicker
				v-else
				:is-open="isFontColorPickerOpen"
				:label="$t('builder.editButton.customButtonStyles.textColor')"
				class="button-style-settings__item"
				:model-value="fontColor"
				:data-qa="'button-style-settings-font-color-picker-default'"
				@click-outside="isFontColorPickerOpen = false"
				@toggle="isFontColorPickerOpen = !isFontColorPickerOpen"
				@update:model-value="setButtonColor(
					$event,
					{ localStylesProperty: 'fontColor' }
				)"
			/>

			<div v-if="!isEditingHoverState">
				<ZyroFieldFontSelect
					:current-font-family="currentFontFamily"
					:is-open="isFontSelectOpen"
					@set-font-family="setFontFamily"
					@toggle="isFontSelectOpen = !isFontSelectOpen"
					@close="isFontSelectOpen = false"
				/>
			</div>

			<div
				v-if="!isEditingHoverState"
				class="button-style-settings__group"
			>
				<ZyroLabel class="button-style-settings__label">
					{{ $t('builder.editButton.customButtonStyles.text.size') }}
				</ZyroLabel>
				<ZyroRange
					v-qa="'button-style-text-size-slider'"
					:min="MIN_FONT_SIZE"
					:max="MAX_FONT_SIZE"
					:step="1"
					has-number-input
					:model-value="fontSize"
					@update:model-value="setFontSize"
				/>
			</div>
		</div>

		<div class="button-style-settings__group">
			<ZyroFieldColorPicker
				v-if="isEditingHoverState"
				:is-open="isBorderColorPickerOpen"
				:label="$t('builder.editButton.customButtonStyles.borderColor')"
				portal-selector="[data-portal='builder-preview']"
				class="button-style-settings__item"
				:model-value="borderColorHover"
				@click-outside="isBorderColorPickerOpen = false"
				@toggle="isBorderColorPickerOpen = !isBorderColorPickerOpen"
				@update:model-value="setButtonColor(
					$event,
					{ localStylesProperty: 'borderColorHover' }
				)"
			/>
			<ZyroFieldColorPicker
				v-else
				:is-open="isBorderColorPickerOpen"
				:label="$t('builder.editButton.customButtonStyles.borderColor')"
				portal-selector="[data-portal='builder-preview']"
				class="button-style-settings__item"
				:model-value="borderColor"
				@click-outside="isBorderColorPickerOpen = false"
				@toggle="isBorderColorPickerOpen = !isBorderColorPickerOpen"
				@update:model-value="setButtonColor(
					$event,
					{ localStylesProperty: 'borderColor' }
				)"
			/>

			<div
				v-if="!isEditingHoverState"
				class="button-style-settings__group"
			>
				<ZyroLabel class="button-style-settings__label">
					{{ $t('common.borderWidth') }}
				</ZyroLabel>
				<ZyroRange
					v-qa="'button-style-border-width-slider'"
					:min="MIN_BORDER_WIDTH"
					:max="MAX_BORDER_WIDTH"
					:step="1"
					has-number-input
					:model-value="borderWidth"
					@update:model-value="setBorderWidth"
				/>
				<ZyroLabel class="button-style-settings__label">
					{{ $t('common.cornerRadius') }}
				</ZyroLabel>
				<ZyroRange
					v-qa="'button-style-border-radius-slider'"
					:min="MIN_BORDER_RADIUS"
					:max="maxBorderRadius"
					:step="1"
					has-number-input
					:model-value="borderRadius"
					@update:model-value="setBorderRadius"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import ZyroFieldColorPicker from '@/components/global/ZyroFieldColorPicker.vue';
import ZyroFieldFontSelect from '@/components/global/ZyroFieldFontSelect.vue';
import ZyroLabel from '@/components/global/ZyroLabel.vue';
import ZyroRange from '@/components/global/ZyroRange.vue';
import ZyroSegmentControl from '@/components/global/ZyroSegmentControl.vue';

import { mapGetters } from 'vuex';
import { getGridItemSize } from '@zyro-inc/site-modules/utils/getGridItemSize';
import { getDefaultFontFamilyName } from '@/utils/getDefaultFontFamilyName';

import { defineComponent } from 'vue';
import { useDeviceElementHeight } from '@/use/useDeviceElementHeight';

const MIN_FONT_SIZE = 10;
const MAX_FONT_SIZE = 48;
const MIN_BORDER_RADIUS = 0;
const MIN_BORDER_WIDTH = 0;
const MAX_BORDER_WIDTH = 10;

export default defineComponent({

	components: {
		ZyroFieldColorPicker,
		ZyroFieldFontSelect,
		ZyroLabel,
		ZyroRange,
		ZyroSegmentControl,
	},
	emits: ['set-button-style'],

	setup() {
		const { updateElementHeightOnDevices } = useDeviceElementHeight();

		return {
			updateElementHeightOnDevices,
			MIN_FONT_SIZE,
			MAX_FONT_SIZE,
			MIN_BORDER_RADIUS,
			MIN_BORDER_WIDTH,
			MAX_BORDER_WIDTH,
		};
	},

	data() {
		const buttonStates = [
			{
				title: this.$t('builder.editButton.customButtonStyles.normal'),
			},
			{
				title: this.$t('builder.editButton.customButtonStyles.hover'),
			},
		];

		const currentStateTab = buttonStates[0];

		return {
			buttonStates,
			currentStateTab,
			isFontSelectOpen: false,
			isBackgroundColorPickerOpen: false,
			isFontColorPickerOpen: false,
			isBorderColorPickerOpen: false,
		};
	},

	computed: {
		...mapGetters('gui', ['isMobileMode']),
		...mapGetters([
			'currentElement',
			'currentBlock',
			'siteStyles',
			'currentElementSettings',
			'currentElementId',
		]),
		currentButtonType() {
			return this.currentElementSettings.type;
		},
		currentButtonTypeStyles() {
			return this.siteStyles[`grid-button-${this.currentButtonType}`];
		},
		fontSize() {
			const currentFontSize = this.currentElement[this.isMobileMode ? 'mobile' : 'desktop']?.fontSize;
			const defaultFontSize = Number.parseInt(this.siteStyles?.[`grid-button-${this.currentButtonType}`]?.['font-size'], 10);

			return Number.parseInt(currentFontSize || defaultFontSize, 10);
		},
		gridElementHeight() {
			return getGridItemSize(this.currentBlock, this.currentElementSettings.styles.position)?.height;
		},
		gridElementWidth() {
			return getGridItemSize(this.currentBlock, this.currentElementSettings.styles.position)?.width;
		},
		maxBorderRadius() {
			const maxBorderRadiusHeightWise = Math.ceil((this.currentElement.desktop?.height || this.gridElementHeight) / 2);
			const maxBorderRadiusLengthWise = Math.ceil((this.currentElement.desktop?.width || this.gridElementWidth) / 2);

			return Math.min(maxBorderRadiusHeightWise, maxBorderRadiusLengthWise);
		},
		borderRadius() {
			const defaultBorderRadius = Number.parseInt(this.siteStyles?.[`grid-button-${this.currentButtonType}`]?.['border-radius'], 10);

			return this.currentElement.borderRadius ?? Math.min(this.maxBorderRadius, defaultBorderRadius);
		},
		currentFontFamily() {
			const currentFontFamily = this.currentElement.fontFamily;
			const isPrimaryFont = this.currentButtonTypeStyles['font-family'].includes('primary');

			const defaultFontFamily = getDefaultFontFamilyName(this.siteStyles, isPrimaryFont);

			return currentFontFamily || defaultFontFamily;
		},
		isEditingHoverState() {
			return this.currentStateTab === this.buttonStates[1];
		},
		fillColor() {
			return this.currentElement.backgroundColor || 'rgb(73, 88, 103)';
		},
		fillColorHover() {
			return this.currentElement.backgroundColorHover || 'rgb(48, 63, 78)';
		},
		fontColor() {
			return this.currentElement.fontColor || this.currentButtonTypeStyles.color;
		},
		fontColorHover() {
			return this.currentElement.fontColorHover || this.currentButtonTypeStyles['color-hover'];
		},
		borderColor() {
			return this.currentElement.borderColor || this.currentButtonTypeStyles['border-color'];
		},
		borderColorHover() {
			return this.currentElement.borderColorHover || this.currentButtonTypeStyles['border-color-hover'];
		},
		borderWidth() {
			return this.currentElement.borderWidth || 0;
		},
	},

	methods: {
		setButtonState(value) {
			this.currentStateTab = value;
		},
		setButtonColor(value, { localStylesProperty }) {
			const stylesToMerge = {
				[localStylesProperty]: value,
			};

			this.$emit('set-button-style', stylesToMerge);
		},
		setFontFamily({
			fontFamily,
			fontWeight,
			fileType,
		}) {
			const stylesToMerge = {
				fontFamily,
				fontWeight: Number.parseInt(fontWeight, 10),
				fileType,
			};

			this.$emit('set-button-style', stylesToMerge);
			this.isFontSelectOpen = false;
		},
		setFontSize(value) {
			const stylesToMerge = {
				[this.isMobileMode ? 'mobile' : 'desktop']: {
					fontSize: value,
				},
			};

			this.$emit('set-button-style', stylesToMerge);
		},
		setBorderWidth(value) {
			const stylesToMerge = {
				borderWidth: value,
				// Sets initial borderColor if value is missing
				...(!this.currentElement.borderColor ? {
					borderColor: 'rgb(26, 26, 26)',
				} : {}),
			};

			this.$emit('set-button-style', stylesToMerge);
		},
		setBorderRadius(value) {
			const stylesToMerge = {
				borderRadius: value,
			};

			this.$emit('set-button-style', stylesToMerge);
		},
	},
});
</script>
<style lang="scss" scoped>
.button-style-settings {
	&__group {
		padding: 8px 0;

		&:not(:last-child) {
			border-bottom: 1px solid $color-gray-light;
		}
	}

	&__item {
		padding: 8px 0;
	}

	&__item-horizontal {
		display: flex;
		padding: 8px 0;
	}

	&__text-font-button {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 6px 8px;
		cursor: pointer;
		background: $color-gray-light;
		border-radius: 5px;
	}

	&__current-font {
		max-width: 117px;
		margin-right: 12px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	&__separator {
		width: 1px;
		height: 14px;
		background: $color-gray-border;
	}

	&__text {
		margin-left: 12px;
		color: $color-azure;
		white-space: nowrap;
	}
}
</style>
