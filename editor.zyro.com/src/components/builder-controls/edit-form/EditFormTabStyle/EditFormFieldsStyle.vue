<template>
	<div class="form-fields-style-settings">
		<ZyroSegmentControl
			:controls="formFieldsStates"
			:active-control="currentFormFieldsState"
			@update:active-control="updateCurrentFormFieldState"
		/>

		<div
			class="form-fields-style-settings__group"
		>
			<ZyroFieldColorPicker
				v-qa="'form-field-style-input-fill-color-picker'"
				:is-open="isInputFillColorPickerOpen"
				:label="$t('builder.editButton.customButtonStyles.fillColor')"
				class="form-fields-style-settings__item"
				:model-value="inputFillColor"
				@click-outside="isInputFillColorPickerOpen = false"
				@toggle="isInputFillColorPickerOpen = !isInputFillColorPickerOpen"
				@update:model-value="(fill) => setFieldsStyles({ [isHoverState ? 'inputFillColorHover' : 'inputFillColor']: fill })"
			/>
		</div>

		<div
			v-if="!isHoverState"
			class="form-fields-style-settings__group"
		>
			<div class="form-fields-style-settings__item-horizontal">
				<ZyroLabel class="form-fields-style-settings__label">
					{{ $t('builder.editButton.customButtonStyles.text.font') }}
				</ZyroLabel>
				<button
					ref="fontSelectButton"
					type="button"
					class="form-fields-style-settings__text-font-button z-body-small"
					data-qa="buttonstylesettings-selectfont"
					@click="isFormFontSelectOpen = !isFormFontSelectOpen"
				>
					<span class="form-fields-style-settings__current-font">
						{{ formFontFamily }}
					</span>
					<div class="form-fields-style-settings__separator" />
					<span class="form-fields-style-settings__text z-body-small--strong">
						{{ $t('common.change') }}
					</span>
				</button>
				<FontSelect
					:target-ref="$refs.fontSelectButton"
					:is-open="isFormFontSelectOpen"
					placement="right-start"
					@click-outside="isFormFontSelectOpen = false"
					@update="setFormFontFamily"
				/>
			</div>
		</div>

		<div
			v-if="!isHoverState"
			class="form-fields-style-settings__group"
		>
			<ZyroFieldColorPicker
				v-qa="'form-field-style-input-label-text-color-picker'"
				:is-open="isLabelTextColorPickerOpen"
				:label="$t('builder.editForm.labelTextColor')"
				class="form-fields-style-settings__item"
				:model-value="labelTextColor"
				@click-outside="isLabelTextColorPickerOpen = false"
				@toggle="isLabelTextColorPickerOpen = !isLabelTextColorPickerOpen"
				@update:model-value="(color) => setFieldsStyles({ 'labelTextColor': color })"
			/>

			<div
				class="form-fields-style-settings__item"
			>
				<ZyroLabel>
					{{ $t('builder.editForm.labelTextSize') }}
				</ZyroLabel>
				<ZyroRange
					v-qa="'form-field-style-label-text-size-slider'"
					:min="`${MIN_FIELDS_STYLES_VALUES.labelTextSize}`"
					:max="`${MAX_FIELDS_STYLES_VALUES.labelTextSize}`"
					step="1"
					has-number-input
					:model-value="labelTextSize"
					@update:model-value="(textSize) => setMediaFieldStyles({ 'labelTextSize': textSize })"
				/>
			</div>
		</div>
		<div
			class="form-fields-style-settings__group"
		>
			<ZyroFieldColorPicker
				v-qa="'form-field-style-input-text-color-picker'"
				:is-open="isInputTextColorPickerOpen"
				:label="$t('builder.editForm.inputTextColor')"
				class="form-fields-style-settings__item"
				:model-value="inputTextColor"
				@click-outside="isInputTextColorPickerOpen = false"
				@toggle="isInputTextColorPickerOpen = !isInputTextColorPickerOpen"
				@update:model-value="(color) => setFieldsStyles({ [isHoverState ? 'inputTextColorHover' : 'inputTextColor']: color })"
			/>
			<div
				v-if="!isHoverState"
				class="form-fields-style-settings__item"
			>
				<ZyroLabel>
					{{ $t('builder.editForm.inputTextSize') }}
				</ZyroLabel>
				<ZyroRange
					v-qa="'form-field-style-input-text-size-slider'"
					:min="`${MIN_FIELDS_STYLES_VALUES.inputTextSize}`"
					:max="`${MAX_FIELDS_STYLES_VALUES.inputTextSize}`"
					step="1"
					has-number-input
					:model-value="inputTextSize"
					@update:model-value="(textSize) => setMediaFieldStyles({ 'inputTextSize': textSize })"
				/>
			</div>
		</div>

		<div
			class="form-fields-style-settings__group"
		>
			<ZyroFieldColorPicker
				v-qa="'form-field-style-border-color-picker'"
				:is-open="isInputBorderColorPickerOpen"
				:label="$t('builder.editButton.customButtonStyles.borderColor')"
				class="form-fields-style-settings__item"
				:model-value="inputBorderColor"
				@click-outside="isInputBorderColorPickerOpen = false"
				@toggle="isInputBorderColorPickerOpen = !isInputBorderColorPickerOpen"
				@update:model-value="(color) => setFieldsStyles({ [isHoverState ? 'inputBorderColorHover' : 'inputBorderColor']: color })"
			/>
			<div
				v-if="!isHoverState"
				class="form-fields-style-settings__item"
			>
				<ZyroLabel>
					{{ $t('common.borderWidth') }}
				</ZyroLabel>
				<ZyroRange
					v-qa="'form-field-style-label-text-size-slider'"
					:min="`${MIN_FIELDS_STYLES_VALUES.inputBorderWidth}`"
					:max="`${MAX_FIELDS_STYLES_VALUES.inputBorderWidth}`"
					step="1"
					has-number-input
					:model-value="inputBorderWidth"
					@update:model-value="(borderWidth) => setFieldsStyles({ 'inputBorderWidth': borderWidth })"
				/>
			</div>
			<div
				v-if="!isHoverState"
				class="form-fields-style-settings__item"
			>
				<ZyroLabel>
					{{ $t('common.cornerRadius') }}
				</ZyroLabel>
				<ZyroRange
					v-qa="'form-field-style-label-text-size-slider'"
					:min="`${MIN_FIELDS_STYLES_VALUES.inputBorderRadius}`"
					:max="`${MAX_FIELDS_STYLES_VALUES.inputBorderRadius}`"
					step="1"
					has-number-input
					:model-value="inputBorderRadius"
					@update:model-value="(borderRadius) => setFieldsStyles({ 'inputBorderRadius': borderRadius })"
				/>
			</div>
		</div>

		<div
			v-if="!isHoverState"
			class="form-fields-style-settings__group"
		>
			<div
				class="form-fields-style-settings__item"
			>
				<ZyroLabel>
					{{ $t('builder.editForm.spacingBetweenElements') }}
				</ZyroLabel>
				<ZyroRange
					v-qa="'form-field-style-vertical-spacing-slider'"
					:min="`${MIN_FIELDS_STYLES_VALUES.formElementsVerticalSpacing}`"
					:max="`${MAX_FIELDS_STYLES_VALUES.formElementsVerticalSpacing}`"
					step="1"
					has-number-input
					:model-value="verticalSpacing"
					@update:model-value="(spacing) => setMediaFieldStyles({ 'formElementsVerticalSpacing': spacing })"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import {
	defineComponent,
	computed,
	ref,
} from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import ZyroSegmentControl from '@/components/global/ZyroSegmentControl.vue';
import ZyroFieldColorPicker from '@/components/global/ZyroFieldColorPicker.vue';
import ZyroLabel from '@/components/global/ZyroLabel.vue';
import FontSelect from '@/components/builder-controls/edit-text/FontSelect.vue';
import ZyroRange from '@/components/global/ZyroRange.vue';
import { getDefaultFontFamilyName } from '@/utils/getDefaultFontFamilyName';

const MAX_FIELDS_STYLES_VALUES = {
	labelTextSize: 48,
	inputTextSize: 48,
	inputBorderWidth: 8,
	inputBorderRadius: 100,
	formElementsVerticalSpacing: 40,
};

const MIN_FIELDS_STYLES_VALUES = {
	labelTextSize: 10,
	inputTextSize: 10,
	inputBorderWidth: 0,
	inputBorderRadius: 0,
	formElementsVerticalSpacing: 0,
};

const DEFAULT_FIELDS_STYLES = {
	inputBorderWidth: 0,
	inputBorderColor: 'rgb(0, 0, 0)',
	inputBorderRadius: 0,
	formElementsVerticalSpacing: 24,
};

export default defineComponent({
	components: {
		ZyroRange,
		ZyroLabel,
		FontSelect,
		ZyroSegmentControl,
		ZyroFieldColorPicker,
	},
	setup() {
		const {
			getters,
			dispatch,
		} = useStore();
		const { t } = useI18n();

		const isMobileMode = computed(() => getters['gui/isMobileMode']);
		const mediaKey = computed(() => (isMobileMode.value ? 'mobile' : 'desktop'));
		const currentElement = computed(() => getters.currentElement);
		const siteStyles = computed(() => getters.siteStyles);

		// #region Legacy Form support
		const formTheme = computed(() => currentElement.value.settings.theme);
		const getDefaultThemeColor = computed(() => (formTheme.value === 'dark' ? {
			inputFillColor: 'rgba(245, 248, 251, 0.6)',
			labelTextColor: 'rgb(245, 248, 251)',
		} : {
			inputFillColor: 'rgb(245, 248, 251)',
			labelTextColor: 'rgb(0, 0, 0)',
		}));
		const globalBodyFontSize = computed(() => {
			const fontSizeKey = isMobileMode.value ? 'm-font-size' : 'font-size';

			return Number.parseInt(siteStyles.value.body[fontSizeKey], 10);
		});

		// #endregion

		// #region Form fields States
		const formFieldsStates = [
			{
				id: 'normal',
				title: t('builder.editButton.customButtonStyles.normal'),
			},
			{
				id: 'hover',
				title: t('builder.editButton.customButtonStyles.hover'),
			},
		];
		const currentFormFieldsState = ref(formFieldsStates[0]);
		const isHoverState = computed(() => currentFormFieldsState.value.id === 'hover');
		const updateCurrentFormFieldState = (state) => {
			currentFormFieldsState.value = state;
		};
		// #endregion

		// #region Form fields fill color
		const isInputFillColorPickerOpen = ref(false);
		const inputFillColor = computed(() => {
			const fillColor = isHoverState.value
				? currentElement.value.inputFillColorHover || currentElement.value.inputFillColor
				: currentElement.value.inputFillColor;

			return fillColor || getDefaultThemeColor.value;
		});
		// #endregion

		// #region Form fields font
		const isFormFontSelectOpen = ref(false);
		const formFontFamily = computed(() => {
			const currentFontFamily = currentElement.value.formFontFamily;
			const isPrimaryFont = siteStyles.value.body['font-family'].includes('primary');
			const defaultFontFamily = getDefaultFontFamilyName(siteStyles.value, isPrimaryFont);

			return currentFontFamily || defaultFontFamily;
		});
		// #endregion

		// #region Form label
		const isLabelTextColorPickerOpen = ref(false);
		const labelTextColor = computed(() => currentElement.value.labelTextColor || getDefaultThemeColor.value);
		const labelTextSize = computed(() => currentElement.value[mediaKey.value]?.labelTextSize || globalBodyFontSize.value);
		// #endregion

		// #region Form input
		const isInputTextColorPickerOpen = ref(false);
		const isInputBorderColorPickerOpen = ref(false);
		const inputTextColor = computed(() => {
			const textColor = isHoverState.value
				? currentElement.value.inputTextColorHover || currentElement.value.inputTextColor
				: currentElement.value.inputTextColor;

			return textColor || siteStyles.value.body.color;
		});
		const inputTextSize = computed(() => currentElement.value[mediaKey.value]?.inputTextSize || globalBodyFontSize.value);
		const inputBorderColor = computed(() => {
			const borderColor = isHoverState.value
				? currentElement.value.inputBorderColorHover || currentElement.value.inputBorderColor
				: currentElement.value.inputBorderColor;

			return borderColor || DEFAULT_FIELDS_STYLES.inputBorderColor;
		});
		const inputBorderWidth = computed(() => currentElement.value.inputBorderWidth || DEFAULT_FIELDS_STYLES.inputBorderWidth);
		const inputBorderRadius = computed(() => currentElement.value.inputBorderRadius || DEFAULT_FIELDS_STYLES.inputBorderRadius);

		// #endregion
		const verticalSpacing = computed(() => currentElement.value[mediaKey.value]?.formElementsVerticalSpacing
			?? DEFAULT_FIELDS_STYLES.formElementsVerticalSpacing);

		const setFieldsStyles = (stylesToMerge) => {
			dispatch('mergeCurrentElementData', {
				elementData: {
					...stylesToMerge,
				},
			});
		};

		const setMediaFieldStyles = (stylesToMerge) => {
			dispatch('mergeCurrentElementData', {
				elementData: {
					[mediaKey.value]: {
						...stylesToMerge,
					},

				},
			});
		};

		const setFormFontFamily = ({
			fontFamily,
			fontWeight,
			fileType,
		}) => {
			const stylesToMerge = {
				formFontFamily: fontFamily,
				formFontWeight: Number.parseInt(fontWeight, 10),
				fontFileType: fileType,
			};

			setFieldsStyles(stylesToMerge);
		};

		return {
			formFieldsStates,
			currentFormFieldsState,
			updateCurrentFormFieldState,
			inputFillColor,
			formFontFamily,
			labelTextColor,
			labelTextSize,
			inputTextColor,
			inputTextSize,
			inputBorderColor,
			inputBorderWidth,
			inputBorderRadius,
			verticalSpacing,
			isFormFontSelectOpen,
			isInputFillColorPickerOpen,
			isLabelTextColorPickerOpen,
			isInputTextColorPickerOpen,
			isInputBorderColorPickerOpen,
			setFieldsStyles,
			setMediaFieldStyles,
			setFormFontFamily,
			isHoverState,
			MAX_FIELDS_STYLES_VALUES,
			MIN_FIELDS_STYLES_VALUES,
		};
	},
});
</script>

<style lang="scss" scoped>
.form-fields-style-settings {
	&__group {
		padding: 16px 0;

		&:not(:last-child) {
			border-bottom: 1px solid $color-gray-light;
		}
	}

	&__item:not(:first-child) {
		margin-top: 16px;
	}

	&__item-horizontal {
		display: flex;
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
