<template>
	<div>
		<div
			ref="colorPickerButton"
			data-qa="builder-colorpicker-toggle-btn"
			@click="$emit('toggle')"
		>
			<slot>
				<ColorPickerButton :color="modelValue" />
			</slot>
		</div>

		<Popup
			v-if="isOpen"
			:target-ref="$refs.colorPickerButton"
			:placement="placement"
			:portal-selector="portalSelector"
			:offset="offset"
			:flip="flip"
			:auto-update="autoUpdate"
			@click-outside="$emit('click-outside')"
		>
			<div
				v-show="!isEyeDropperActive"
				class="color-picker-content"
			>
				<div
					v-if="showWebsiteColors"
					class="color-picker-content__website-colors"
				>
					<div class="color-picker-content__header">
						<div class="color-picker-content__title">
							{{ $t('common.colorStyles') }}
						</div>
						<!-- Temporary don't show this button, as global styles color tab has breaking bugs -->
						<button
							v-show="false"
							class="color-picker-content__edit"
						>
							{{ $t('common.edit') }}
						</button>
					</div>

					<div class="color-picker-content__colors">
						<button
							v-for="color in top16UsedColorValues"
							:key="color"
							v-qa="'builder-colorpicker-websitecolor-btn'"
							class="color-picker-content__color"
							:class="{ 'active': color === currentColor }"
							:style="{ backgroundColor: color }"
							@click="handleColorChange({ value: color })"
						/>
					</div>
				</div>

				<button
					v-if="isEyeDropperAPISupported"
					class="color-picker-content__eye-dropper-button"
					@click="handleEyeDropper"
				>
					<ZyroSvgDeprecated
						class="color-picker-content__eye-dropper-icon"
						name="eye-dropper"
					/>
					{{ $t('common.pickColor') }}
				</button>

				<rgba-string-color-picker
					:color="colorThatRerendersColorPickerComponent"
					@color-changed="handleColorChange({
						value: $event.detail.value,
						reinitializeColorPicker: false,
					})"
				/>

				<input
					ref="textInput"
					:value="textInputValue"
					class="color-picker-content__text-input"
					type="text"
					@keydown.enter="handleTextInput($event.target.value)"
					@blur="handleTextInput($event.target.value)"
					@input="debounceInputChange"
					@focus="$refs.textInput.select()"
				>

				<button
					v-if="showApply"
					class="color-picker-content__apply-button"
					@click="$emit('apply', currentColor)"
				>
					{{ $t('common.save') }}
				</button>
			</div>
		</Popup>
	</div>
</template>

<script>
import Popup from '@/components/global/Popup.vue';
import ColorPickerButton from '@/components/global/ColorPickerButton.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

// eslint-disable-next-line import/extensions
import 'vanilla-colorful/rgba-string-color-picker.js';
import tinycolor from 'tinycolor2';
import { useWebsiteColors } from '@/use/useWebsiteColors';
import { debounce } from '@zyro-inc/site-modules/utils/debounce';

import {
	defineComponent,
	onMounted,
	ref,
	computed,
	watch,
	nextTick,
	onBeforeUnmount,
} from 'vue';
import { useStore } from 'vuex';

const DEFAULT_COLOR = 'rgb(255, 255, 255)';

export default defineComponent({
	components: {
		Popup,
		ColorPickerButton,
		ZyroSvgDeprecated,
	},
	props: {
		isOpen: {
			type: Boolean,
			required: true,
		},
		// Positioning strategy
		placement: {
			type: String,
			default: 'bottom-start',
		},
		offset: {
			type: Number,
			default: 4,
		},
		modelValue: {
			type: String,
			default: DEFAULT_COLOR, // This will be used when prop is not passed / undefined
		},
		portalSelector: {
			type: String,
			default: "[data-portal='app']",
		},
		autoUpdate: {
			type: Boolean,
			default: false,
		},
		flip: {
			type: Boolean,
			default: true,
		},
		// UI
		showWebsiteColors: {
			type: Boolean,
			default: true,
		},
		showApply: {
			type: Boolean,
			default: false,
		},
	},
	emits: [
		'update:model-value',
		'toggle',
		'apply',
	],

	setup(props, { emit }) {
		const {
			mostUsedColors,
			getColorValue,
		} = useWebsiteColors();

		const { dispatch } = useStore();

		const isEyeDropperActive = ref(false);
		// colorThatRerendersColorPickerComponent - on change rerenders <rgba-string-color-picker> component
		// We can't use this.currentColor, as this will cause <rgba-string-color-picker> reinitialization on every single change
		// Example unwanted behavior:
		// dragging a value to be #000 while having blue hue, will cause <rgba-string-color-picker> and reset hue to red
		const colorThatRerendersColorPickerComponent = ref('');

		// currentColor - used to locally track what color is currently selected in color picker.
		// props.modelValue not always represents currently selected value in color picker, because not all use cases
		// change color on @input event. Some of them do it only on @apply.
		const currentColor = ref(DEFAULT_COLOR);

		const isEyeDropperAPISupported = computed(() => 'EyeDropper' in window);

		const top16UsedColorValues = [
			...new Set(
				Object.keys(mostUsedColors.value)
					.slice(0, 16)
					.map((color) => getColorValue(color)),
			),
		];

		const textInputValue = computed(() => tinycolor(getColorValue(currentColor.value)).toHexString());

		const setCurrentColor = (color) => {
			currentColor.value = getColorValue(color || DEFAULT_COLOR);
		};

		const handleColorChange = ({
			value,
			reinitializeColorPicker = true,
		}) => {
			setCurrentColor(value);

			if (reinitializeColorPicker) {
				colorThatRerendersColorPickerComponent.value = getColorValue(value);
			}

			emit('update:model-value', getColorValue(value));
		};

		const handleTextInput = (value) => {
			const color = tinycolor(value);

			if (!color.isValid()) {
				return;
			}

			handleColorChange({
				value,
			});
		};

		const handleEyeDropper = async () => {
			const eyeDropper = new window.EyeDropper();

			try {
				isEyeDropperActive.value = true;
				const selectedColor = await eyeDropper.open();

				handleColorChange({
					value: selectedColor.sRGBHex,
				});
			} finally {
				isEyeDropperActive.value = false;
			}
		};

		const debounceInputChange = debounce((event) => {
			handleTextInput(event.target.value);
		}, 1000);

		watch(() => props.isOpen, (newVal) => {
			dispatch('gui/updateIsColorPickerOpen', newVal);
			colorThatRerendersColorPickerComponent.value = getColorValue(props.modelValue || DEFAULT_COLOR);
		}, {
			immediate: true,
		});

		onMounted(async () => {
			// temporary, needed for ecommerce button settings to sync up
			await nextTick();

			setCurrentColor(props.modelValue);
		});

		onBeforeUnmount(() => {
			dispatch('gui/updateIsColorPickerOpen', false);
		});

		return {
			isEyeDropperActive,
			colorThatRerendersColorPickerComponent,
			isEyeDropperAPISupported,
			textInputValue,
			top16UsedColorValues,
			getColorValue,
			currentColor,
			setCurrentColor,
			handleColorChange,
			handleTextInput,
			handleEyeDropper,
			debounceInputChange,
		};
	},
});
</script>

<style lang="scss" scoped>
.color-picker-content {
	width: 252px;
	padding: 16px;
	background-color: $color-light;
	border-radius: $border-radius-small;
	box-shadow: $box-shadow;

	&__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 8px;
	}

	&__title {
		font-size: 14px;
		font-weight: 700;
		line-height: 1;
	}

	&__edit {
		font-size: 14px;
		font-weight: 700;
		line-height: 1;
		color: $color-azure;
		cursor: pointer;
	}

	&__colors {
		display: grid;
		grid-template-columns: repeat(8, 24px);
		grid-column-gap: 4px;
		margin-bottom: 12px;
	}

	&__color {
		width: 24px;
		height: 24px;
		margin-bottom: 4px;
		cursor: pointer;
		border: 1px solid rgba(221, 225, 230, 80%);
		border-radius: 50%;

		&:hover {
			border: none;
			border: 2px solid $color-azure;
		}

		&.active {
			border: 2px solid $color-light;
			outline: 2px solid $color-azure;
		}
	}

	&__text-input {
		width: 100%;
		padding: 8px 0;
		margin-top: 8px;
		font-family: Roboto, sans-serif;
		font-size: 12px;
		line-height: 1.33;
		text-align: center;
		letter-spacing: 0.25px;
		border: 1px solid $color-gray-border;
		border-radius: 5px;
		outline: none;

		&:hover,
		&:focus {
			border: 1px solid $color-azure;
		}
	}

	&__eye-dropper-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		padding: 6px 12px;
		margin-bottom: 8px;
		font-size: 14px;
		font-weight: 500;
		line-height: 1.43;
		color: $color-azure;
		cursor: pointer;
		border: 1px solid $color-gray-border;
		border-radius: 6px;
		transition: border 0.2s;

		&:hover {
			border: 1px solid $color-azure;
		}
	}

	&__eye-dropper-icon {
		width: 16px;
		height: 16px;
		margin-right: 4px;
	}

	&__apply-button {
		width: 100%;
		padding: 6px;
		margin-top: 16px;
		font-size: 14px;
		font-weight: 500;
		line-height: 1.43;
		color: $color-light;
		cursor: pointer;
		background-color: $color-azure;
		border-radius: 6px;
	}
}

rgba-string-color-picker {
	width: 100%;
	border-radius: 6px;

	&::part(saturation) {
		margin-bottom: 8px;
		border: 1px solid $color-gray-border;
		border-radius: 6px;
		box-shadow: none;
	}

	&::part(hue) {
		flex: 0 0 14px;
		margin-bottom: 8px;
		border: 1px solid $color-gray-border;
		border-radius: 6px;
	}

	&::part(alpha) {
		flex: 0 0 14px;
		border: 1px solid $color-gray-border;
		border-radius: 6px;
	}

	&::part(hue-pointer),
	&::part(saturation-pointer),
	&::part(alpha-pointer) {
		width: 20px;
		height: 20px;
		cursor: pointer;
		border: 3px solid rgb(255, 255, 255);
		box-shadow: 0 0 0 1px $color-gray-border;

		&::after {
			height: auto;
			border: 1px solid $color-gray-border;
		}
	}
}
</style>
