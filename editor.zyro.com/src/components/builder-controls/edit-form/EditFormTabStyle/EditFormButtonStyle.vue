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
				:is-open="isBackgroundColorPickerOpen"
				:label="$t('builder.editButton.customButtonStyles.fillColor')"
				class="button-style-settings__item"
				:model-value="getButtonColor({
					localStylesProperty: `submitButtonBackgroundColor${isEditingHoverState ? 'Hover' : ''}`,
					globalStylesProperty: `background-color${isEditingHoverState ? '-hover' : ''}`
				})"
				@click-outside="isBackgroundColorPickerOpen = false"
				@toggle="isBackgroundColorPickerOpen = !isBackgroundColorPickerOpen"
				@update:model-value="setButtonColor(
					$event,
					{ localStylesProperty: `submitButtonBackgroundColor${isEditingHoverState ? 'Hover' : ''}` }
				)"
			/>
		</div>

		<div class="button-style-settings__group">
			<ZyroFieldColorPicker
				:is-open="isFontColorPickerOpen"
				:label="$t('builder.editButton.customButtonStyles.textColor')"
				class="button-style-settings__item"
				:model-value="getButtonColor({
					localStylesProperty: `submitButtonFontColor${isEditingHoverState ? 'Hover' : ''}`,
					globalStylesProperty: `color${isEditingHoverState ? '-hover' : ''}`
				})"
				@click-outside="isFontColorPickerOpen = false"
				@toggle="isFontColorPickerOpen = !isFontColorPickerOpen"
				@update:model-value="setButtonColor(
					$event,
					{ localStylesProperty: `submitButtonFontColor${isEditingHoverState ? 'Hover' : ''}` }
				)"
			/>

			<div
				v-if="!isEditingHoverState"
				class="button-style-settings__item-horizontal"
			>
				<ZyroLabel class="button-style-settings__label">
					{{ $t('builder.editButton.customButtonStyles.text.font') }}
				</ZyroLabel>
				<button
					ref="fontSelectButton"
					type="button"
					class="button-style-settings__text-font-button z-body-small"
					data-qa="buttonstylesettings-selectfont"
					@click="isFontSelectOpen = !isFontSelectOpen"
				>
					<span class="button-style-settings__current-font">
						{{ currentFontFamily }}
					</span>
					<div class="button-style-settings__separator" />
					<span class="button-style-settings__text z-body-small--strong">
						{{ $t('common.change') }}
					</span>
				</button>
				<FontSelect
					:target-ref="$refs.fontSelectButton"
					:is-open="isFontSelectOpen"
					placement="right-start"
					@click-outside="isFontSelectOpen = false"
					@update="setFontFamily"
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
				:is-open="isBorderColorPickerOpen"
				:label="$t('builder.editButton.customButtonStyles.borderColor')"
				portal-selector="[data-portal='builder-preview']"
				class="button-style-settings__item"
				:model-value="getButtonColor({ localStylesProperty: `submitButtonBorderColor${isEditingHoverState ? 'Hover' : ''}`, })"
				@click-outside="isBorderColorPickerOpen = false"
				@toggle="isBorderColorPickerOpen = !isBorderColorPickerOpen"
				@update:model-value="setButtonColor(
					$event,
					{ localStylesProperty: `submitButtonBorderColor${isEditingHoverState ? 'Hover' : ''}` }
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
					:max="MAX_BORDER_RADIUS"
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
import ZyroLabel from '@/components/global/ZyroLabel.vue';
import ZyroRange from '@/components/global/ZyroRange.vue';
import ZyroSegmentControl from '@/components/global/ZyroSegmentControl.vue';

import FontSelect from '@/components/builder-controls/edit-text/FontSelect.vue';
import {
	mapGetters,
	mapActions,
} from 'vuex';

import { defineComponent } from 'vue';

const MIN_FONT_SIZE = 10;
const MAX_FONT_SIZE = 48;
const MIN_BORDER_RADIUS = 0;
const MAX_BORDER_RADIUS = 50;
const MIN_BORDER_WIDTH = 0;
const MAX_BORDER_WIDTH = 10;

export default defineComponent({

	components: {
		ZyroFieldColorPicker,
		ZyroLabel,
		ZyroRange,
		ZyroSegmentControl,
		FontSelect,
	},

	setup() {
		return {
			MIN_BORDER_WIDTH,
			MAX_BORDER_WIDTH,
			MIN_FONT_SIZE,
			MAX_FONT_SIZE,
			MIN_BORDER_RADIUS,
			MAX_BORDER_RADIUS,
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
		]),
		currentElementSettings() {
			return this.currentElement.submitButtonData.settings;
		},
		currentButtonType() {
			return this.currentElementSettings.type;
		},
		fontSize() {
			const currentFontSize = this.currentElement[this.isMobileMode ? 'mobile' : 'desktop']?.submitButtonFontSize;
			const defaultFontSize = Number.parseInt(this.siteStyles?.[`grid-button-${this.currentButtonType}`]?.['font-size'], 10);

			return Number.parseInt(currentFontSize || defaultFontSize, 10);
		},
		borderWidth() {
			return this.currentElement.submitButtonBorderWidth || 0;
		},
		borderRadius() {
			const defaultBorderRadius = Number.parseInt(this.siteStyles?.[`grid-button-${this.currentButtonType}`]?.['border-radius'], 10);

			return this.currentElement.submitButtonBorderRadius ?? Math.min(MAX_BORDER_RADIUS, defaultBorderRadius);
		},
		currentFontFamily() {
			const localFontFamily = this.currentElement.submitButtonFontFamily;
			const isPrimaryFont = this.siteStyles[`grid-button-${this.currentButtonType}`]['font-family'].includes('primary');
			const globalFontFamily = isPrimaryFont ? this.siteStyles.font.primary : this.siteStyles.font.secondary;
			// get text font family name and remove commas and quotes
			const formattedGlobalFontFamily = globalFontFamily.split(',')[0].replace(/["']+/g, '');

			return localFontFamily || formattedGlobalFontFamily;
		},
		isEditingHoverState() {
			return this.currentStateTab === this.buttonStates[1];
		},
	},

	methods: {
		...mapActions(['mergeCurrentElementData']),
		getButtonColor({
			localStylesProperty,
			globalStylesProperty,
		}) {
			const currentColor = this.currentElement[localStylesProperty];

			if (!currentColor) {
				const defaultColor = this.siteStyles[`grid-button-${this.currentButtonType}`][globalStylesProperty];

				return defaultColor;
			}

			return currentColor;
		},
		setButtonState(value) {
			this.currentStateTab = value;
		},
		setButtonColor(value, { localStylesProperty }) {
			this.mergeCurrentElementData({
				elementData: {
					[localStylesProperty]: value,
				},
			});
		},
		setFontFamily({
			fontFamily,
			fontWeight,
			fileType,
		}) {
			this.mergeCurrentElementData({
				elementData: {
					submitButtonFontFamily: fontFamily,
					submitButtonFontWeight: Number.parseInt(fontWeight, 10),
					submitButtonFontFileType: fileType,
				},
			});
			this.isFontSelectOpen = false;
		},
		setFontSize(value) {
			this.mergeCurrentElementData({
				elementData: {
					[this.isMobileMode ? 'mobile' : 'desktop']: {
						submitButtonFontSize: value,
					},
				},
			});
		},
		setBorderWidth(value) {
			const {
				submitButtonBorderColor,
				submitButtonBorderColorHover,
			} = this.currentElement;

			this.mergeCurrentElementData({
				elementData: {
					submitButtonBorderWidth: value,
					...(!submitButtonBorderColor ? {
						submitButtonBorderColor: 'rgb(26, 26, 26)',
					} : {}),
					...(!submitButtonBorderColorHover ? {
						submitButtonBorderColorHover: 'rgb(26, 26, 26)',
					} : {}),
				},
			});
		},
		setBorderRadius(value) {
			this.mergeCurrentElementData({
				elementData: {
					submitButtonBorderRadius: value,
				},
			});
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
