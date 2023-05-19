<template>
	<div class="global-colors">
		<ul class="color-list">
			<li
				v-for="(useCount, color) in mostUsedColors"
				:key="color"
				class="color-list__item"
				:class="{ 'selected': selectedColor === color }"
				:data-qa="`website-color-${getHexColor(color)}`"
				@click="selectColor(color, $event)"
			>
				<div
					class="color-circle"
					:style="{ backgroundColor: color }"
				/>

				<i18n-t
					v-if="(useCount === 1)"
					tag="span"
					keypath="builder.userStyles.colorChangeUsedOnce"
				>
					<strong>{{ $t('common.once') }}</strong>
				</i18n-t>

				<i18n-t
					v-else
					tag="span"
					keypath="builder.userStyles.colorChangeUsedMultiple"
				>
					<strong>{{ useCount }}</strong>
				</i18n-t>

				<button
					class="item__change-button"
					data-qa="change-website-color"
				>
					{{ $t("common.change") }}
				</button>
			</li>
		</ul>

		<Popup
			v-if="selectedColor"
			portal-selector="[data-portal='builder-preview']"
			placement="bottom-end"
			auto-update
			:flip="false"
			:offset="6"
			:target-ref="selectedElementRef"
			@click-outside="handleClose"
		>
			<div class="global-colors__popup">
				<div class="popup-header">
					<span class="popup-header__text">{{ $t("builder.userStyles.colorChange") }}</span>
					<CloseButton
						data-qa="close-website-color-change-modal"
						@click="handleClose"
					/>
				</div>
				<div
					class="popup-content"
					:[DATA_ATTRIBUTE_SELECTOR]="DATA_ATTRIBUTE_SELECTOR_POPUP_CONTENT"
					data-portal="global-colors-color-picker"
				>
					<div class="popup-content__color-selection">
						<div
							class="color-circle"
							:style="{ backgroundColor: selectedColor }"
						/>
						<div class="color-selection__color-name">
							{{ getHexColor(selectedColor) }}
						</div>
						<ZyroSvgDeprecated
							name="arrow"
							dimension="16px"
							class="color-selection__color-arrow"
						/>
						<button
							v-if="!isColorPickerOpen"
							class="color-selection__color-button"
							data-qa="select-new-website-color"
							@click="handleSelectClick"
						>
							{{ $t('common.select') }}
						</button>
						<div
							v-else
							class="color-selection__color-picker-color"
						>
							<div
								class="color-circle"
								:style="{ backgroundColor: newColorPickerColor }"
							/>
							<div class="color-selection__color-name">
								{{ getHexColor(newColorPickerColor) }}
							</div>
						</div>
					</div>

					<div
						class="popup-content__disclaimer"
					>
						{{ $t('builder.userStyles.colorChangeDisclaimer') }}
					</div>

					<ColorPicker
						:show-website-colors="false"
						class="color-picker-disabled"
						:model-value="selectedColor"
						placement="left"
						:offset="250"
						:is-open="(isColorPickerOpen)"
						portal-selector="[data-portal='global-colors-color-picker']"
						@update:model-value="updateColorPickerColor"
					/>
				</div>
				<div
					v-if="isColorPickerOpen"
					class="popup-footer"
				>
					<button
						class="footer-cancel-button"
						@click="handleClose"
					>
						{{ $t('common.cancel') }}
					</button>
					<button
						:disabled="!showFooterButtons"
						class="footer-accept-button"
						@click="handleAccept"
					>
						{{ $t('common.accept') }}
					</button>
				</div>
			</div>
		</Popup>
	</div>
	<NpsRateFeature
		:feature-name="$t('builder.npsRateGlobalStyles')"
		:type="NPS_TYPE_FEATURE_GLOBAL_STYLES_COLORS"
	/>
</template>

<script>
import { NPS_TYPE_FEATURE_GLOBAL_STYLES_COLORS } from '@/constants';

import {
	updateColor,
	useWebsiteColors,
} from '@/use/useWebsiteColors';
import {
	computed,
	defineComponent,
	ref,
} from 'vue';
import { useStore } from 'vuex';
import ColorPicker from '@/components/global/ColorPicker.vue';
import Popup from '@/components/global/Popup.vue';
import CloseButton from '@zyro-inc/site-modules/components/CloseButton.vue';
import tinycolor from 'tinycolor2';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';
import cloneDeep from 'lodash.clonedeep';
import {
	DATA_ATTRIBUTE_SELECTOR,
	DATA_ATTRIBUTE_SELECTOR_POPUP_CONTENT,
} from '@zyro-inc/site-modules/constants';
import NpsRateFeature from '@/components/ui/NpsRateFeature.vue';

export default defineComponent({
	components: {
		ColorPicker,
		Popup,
		ZyroSvgDeprecated,
		CloseButton,
		NpsRateFeature,
	},
	setup() {
		const {
			getters,
			dispatch,
		} = useStore();

		const { mostUsedColors } = useWebsiteColors();

		const isColorPickerOpen = ref(false);
		const selectedColor = ref(null);
		const newColorPickerColor = ref(null);
		const showFooterButtons = computed(() => !!selectedColor.value
			&& !!newColorPickerColor.value
			&& selectedColor.value !== newColorPickerColor.value);
		const selectedElementRef = ref();

		const handleClose = () => {
			selectedColor.value = null;
			newColorPickerColor.value = null;
			isColorPickerOpen.value = false;
		};

		const selectColor = (color, event) => {
			if (selectedColor.value) {
				handleClose();

				return;
			}

			selectedColor.value = color;
			selectedElementRef.value = event.target;
		};

		const getHexColor = (color) => tinycolor(color).toHexString();

		const handleSelectClick = () => {
			newColorPickerColor.value = selectedColor.value;
			isColorPickerOpen.value = true;
		};

		const updateColorPickerColor = (newColor) => {
			newColorPickerColor.value = newColor;
		};

		const handleAccept = async () => {
			const languagesWithUpdatedColors = updateColor(
				// cloneDeep required to avoid direct store mutation
				cloneDeep(getters.siteLanguages),
				selectedColor.value,
				newColorPickerColor.value,
			);

			dispatch('updateLanguages', languagesWithUpdatedColors);

			handleClose();
		};

		return {
			DATA_ATTRIBUTE_SELECTOR,
			DATA_ATTRIBUTE_SELECTOR_POPUP_CONTENT,
			NPS_TYPE_FEATURE_GLOBAL_STYLES_COLORS,
			handleAccept,
			handleClose,
			showFooterButtons,
			newColorPickerColor,
			updateColorPickerColor,
			handleSelectClick,
			getHexColor,
			selectedColor,
			selectedElementRef,
			selectColor,
			isColorPickerOpen,
			mostUsedColors,
		};
	},
});
</script>

<style lang="scss" scoped>
@import "@/components/builder-drawers/drawers/partials/stylesDrawer/UserStyles";

@keyframes horizontal-pulse {
	from { transform: translateX(-2px) rotate(90deg); }
	to { transform: translateX(2px) rotate(90deg); }
}

.color-circle {
	width: 24px;
	height: 24px;
	margin-right: 4px;
	border: 1px solid $color-gray-border;
	border-radius: 50%;
}

.global-colors {
	margin-bottom: 24px;

	.color-list {
		list-style: none;

		&__item {
			display: flex;
			gap: 12px;
			align-items: center;
			padding: 4px;
			margin-bottom: 8px;
			font-size: 12px;
			color: $color-gray;
			background-color: $color-gray-light;
			border: 1px solid $color-gray-light;
			border-radius: 20px;

			// Because popup uses clicked element as a targetRef,
			// disabling click events for all .color_list__item descendants
			& > * {
				pointer-events: none;
			}

			&.selected {
				background-color: $color-gray-border;
				border: 1px solid $color-gray-border;
			}

			.item__change-button {
				display: none;
				margin: 0 12px 0 auto;
				font-size: 14px;
				font-weight: 500;
				color: $color-azure;
				background: none;
			}

			&:hover {
				cursor: pointer;

				& > .item__change-button {
					display: block;
				}
			}
		}
	}

	&__popup {
		width: 252px;
		padding: 8px 16px 16px;
		background: $color-light;
		border-radius: 5px;
		box-shadow: 0 6px 14px 0 rgba(0, 0, 0, 10%);

		.popup-header {
			display: flex;
			align-items: center;
			justify-content: space-between;

			&__text {
				font-size: 14px;
				font-weight: 700;
			}
		}

		.popup-content {
			&__color-selection {
				display: flex;
				align-items: center;
				margin-bottom: 8px;

				.color-selection__color-name {
					width: 60px;
					font-size: 12px;
					font-weight: 400;
					text-transform: uppercase;
				}

				.color-selection__color-arrow {
					margin-right: auto;
					margin-left: auto;
					animation: horizontal-pulse 800ms ease infinite alternate;
				}

				.color-selection__color-button {
					width: 82px;
					height: 24px;
					font-size: 14px;
					font-weight: 500;
					color: $color-azure;
					border: 1px solid $color-gray-border;
					border-radius: 6px;

					&:hover {
						cursor: pointer;
					}
				}

				.color-selection__color-picker-color {
					display: flex;
					align-items: center;
				}
			}

			&__disclaimer {
				font-size: 12px;
				font-weight: 400;
				line-height: 16px;
				color: $color-gray;
			}

			.color-picker-disabled {
				display: none;
			}

			:deep(.popup-content) {
				position: relative;
				transform: none !important;

				.color-picker-content {
					margin-left: -16px;
					border-radius: 0;
					box-shadow: none;
				}
			}
		}

		.popup-footer {
			display: flex;
			justify-content: space-between;

			.footer-cancel-button {
				border: 1px solid $color-gray-border;
			}

			.footer-accept-button {
				color: $color-light;
				background-color: $color-azure;
			}

			.footer-cancel-button,
			.footer-accept-button {
				width: 106px;
				height: 32px;
				padding: 6px 0;
				font-size: 14px;
				font-weight: 500;
				line-height: 20px;
				border-radius: 6px;

				&:hover {
					cursor: pointer;
				}

				&[disabled] {
					color: $color-gray;
					cursor: not-allowed;
					background: $color-gray-border;
				}
			}
		}
	}
}
</style>
