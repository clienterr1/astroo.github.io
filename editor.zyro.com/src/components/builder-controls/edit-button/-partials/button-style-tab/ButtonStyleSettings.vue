<template>
	<div class="style-content">
		<div
			v-for="(buttonName, buttonType) in buttonNames"
			:key="buttonType"
			class="style-content__item"
			:class="{ 'style-content__item--active': buttonType === currentButtonType }"
			@click="$emit('set-button-type', buttonType)"
		>
			<GridButton
				:style="buttonStyle(buttonType)"
				:content="buttonName"
				:type="buttonType"
				@click.prevent
			/>
		</div>

		<div class="style-controler">
			<ZyroLabel>
				{{ buttonLabel }}
			</ZyroLabel>
			<ZyroSegmentControl
				is-background-dark
				class="style-controler__tabs"
				:controls="tabs"
				:active-control="currentTab"
				@update:active-control="currentTab = $event"
			/>
			<ul class="style-controler__content">
				<li v-if="currentTab.property === PROPERTY_BORDER_COLOR">
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
				</li>
				<li class="style-controler__item">
					<ZyroLabel>
						{{ currentTab.text }}
					</ZyroLabel>
					<ColorPicker
						:model-value="styleDefault"
						placement="left"
						:offset="250"
						:is-open="isDefaultStyleColorsOpen"
						@click-outside="isDefaultStyleColorsOpen = false"
						@toggle="isDefaultStyleColorsOpen = !isDefaultStyleColorsOpen"
						@update:model-value="$emit('set-button-style', $event), $emit('set-button-style-active', $event)"
					/>
				</li>
				<li class="style-controler__item">
					<ZyroLabel>{{ currentTab.textHover }}</ZyroLabel>
					<ColorPicker
						placement="left"
						:model-value="styleHover"
						:offset="250"
						:is-open="isTextHoverColorsOpen"
						@click-outside="isTextHoverColorsOpen = false"
						@toggle="isTextHoverColorsOpen = !isTextHoverColorsOpen"
						@update:model-value="$emit('set-button-style-hover', $event)"
					/>
				</li>
			</ul>
			<ZyroLabel class="style-controler__label">
				{{ $t('builder.buttonSize') }}
			</ZyroLabel>
			<ZyroIconSelect
				v-model="currentButtonSize"
				:options="SIZE_OPTIONS"
				:items-per-row="3"
				icon-container-padding="0 10px"
				is-togglable
				active-icon-color="var(--color-azure)"
				active-background-color="var(--color-azure-lighter)"
				class="style-controler__size-select"
				@update:model-value="$emit('set-button-size', currentButtonSize)"
			/>
		</div>
	</div>
</template>

<script>
import {
	defineComponent,
	ref,
	computed,
} from 'vue';
import { useI18n } from 'vue-i18n';

import ZyroIconSelect from '@/components/global/ZyroIconSelect.vue';
import ZyroLabel from '@/components/global/ZyroLabel.vue';
import ZyroSegmentControl from '@/components/global/ZyroSegmentControl.vue';
import ColorPicker from '@/components/global/ColorPicker.vue';

import GridButton from '@zyro-inc/site-modules/components/elements/button/GridButton.vue';
import {
	PROPERTY_BORDER_COLOR,
	PROPERTY_BORDER_WIDTH,
	PROPERTY_BACKGROUND_COLOR,
	PROPERTY_COLOR,
} from '@zyro-inc/site-modules/constants/globalStyles';
import {
	BUTTON_PROPERTY_SIZE_SMALL,
	BUTTON_PROPERTY_SIZE_MEDIUM,
	BUTTON_PROPERTY_SIZE_LARGE,
} from '@/constants';
import ZyroRange from '@/components/global/ZyroRange.vue';
import { useStore } from 'vuex';

const MIN_BORDER_WIDTH = 0;
const MAX_BORDER_WIDTH = 10;

const PROPERTY_SIZE = 'size';

const SIZE_OPTIONS = {
	[BUTTON_PROPERTY_SIZE_SMALL]: {
		name: 'Small',
		icon: 'button-size-small',
		iconDimensions: '50px',
	},
	[BUTTON_PROPERTY_SIZE_MEDIUM]: {
		name: 'Medium',
		icon: 'button-size-medium',
		iconDimensions: '50px',
	},
	[BUTTON_PROPERTY_SIZE_LARGE]: {
		name: 'Large',
		icon: 'button-size-large',
		iconDimensions: '50px',
	},
};

export default defineComponent({
	components: {
		ColorPicker,
		ZyroIconSelect,
		ZyroLabel,
		ZyroSegmentControl,
		GridButton,
		ZyroRange,
	},

	props: {
		siteStyles: {
			type: Object,
			default: () => ({}),
		},
		buttonSize: {
			type: String,
			default: null,
		},
		currentButtonType: {
			type: String,
			default: null,
		},
		currentButtonStyles: {
			type: Object,
			default: () => ({}),
		},
		styleDefault: {
			type: String,
			default: '',
		},
		styleActive: {
			type: String,
			default: '',
		},
		styleHover: {
			type: String,
			default: '',
		},
	},

	setup(props) {
		const {
			getters,
			state,
			dispatch,
		} = useStore();
		const { t } = useI18n();
		const tabs = [
			{
				property: PROPERTY_BACKGROUND_COLOR,
				title: t('builder.editButton.customButtonStyles.fill.title'),
				text: t('builder.editButton.customButtonStyles.fill.text'),
				textHover: t('builder.editButton.customButtonStyles.fill.textHover'),
			},
			{
				property: PROPERTY_COLOR,
				title: t('builder.editButton.customButtonStyles.text.title'),
				text: t('builder.editButton.customButtonStyles.text.text'),
				textHover: t('builder.editButton.customButtonStyles.text.textHover'),
			},
			{
				property: PROPERTY_BORDER_COLOR,
				title: t('builder.editButton.customButtonStyles.border.title'),
				text: t('builder.editButton.customButtonStyles.border.text'),
				textHover: t('builder.editButton.customButtonStyles.border.textHover'),
			},
		];
		const buttonNames = {
			primary: t('common.primary'),
			secondary: t('common.secondary'),
		};

		const currentTab = ref(tabs[0]);

		const borderWidth = computed(() => getters.currentBlock?.buttonBorderWidth || 0);
		const setBorderWidth = (newBorderWidth) => {
			const hasBorderColor = !!props.currentButtonStyles[`grid-button-${props.currentButtonType}-${PROPERTY_BORDER_COLOR}`];

			dispatch('updateBlockData', {
				blockId: state.currentBlockId,
				blockData: {
					buttonBorderWidth: newBorderWidth,
					...(!hasBorderColor ? {
						buttonStyle: {
							[`grid-button-${props.currentButtonType}-${PROPERTY_BORDER_COLOR}`]: 'rgb(26, 26, 26)',
						},
					} : {}
					),
				},
				pushToHistory: true,
				merge: true,
			});
		};

		return {
			PROPERTY_BORDER_COLOR,
			borderWidth,
			setBorderWidth,
			MIN_BORDER_WIDTH,
			MAX_BORDER_WIDTH,
			tabs,
			currentTab,
			buttonNames,
		};
	},

	data() {
		return {
			PROPERTY_SIZE,
			SIZE_OPTIONS,
			currentButtonSize: this.buttonSize,
			isTextHoverColorsOpen: false,
			isDefaultStyleColorsOpen: false,
		};
	},

	computed: {
		hasBorder() {
			const borderWidth = this.siteStyles[`grid-button-${this.currentButtonType}`][PROPERTY_BORDER_WIDTH];

			return (borderWidth && ![
				'0',
				'0px',
				'none',
			].includes(borderWidth));
		},
		buttonLabel() {
			return this.$t(`builder.editButton.${this.currentButtonType === 'primary' ? 'primaryButtonStyles' : 'secondaryButtonStyles'}`);
		},
	},

	methods: {
		buttonStyle(type) {
			return {
				[PROPERTY_BACKGROUND_COLOR]: this.currentButtonStyles[`grid-button-${type}-${PROPERTY_BACKGROUND_COLOR}`]
				|| this.siteStyles[`grid-button-${type}`][PROPERTY_BACKGROUND_COLOR],
				[PROPERTY_COLOR]: this.currentButtonStyles[`grid-button-${type}-${PROPERTY_COLOR}`]
				|| this.siteStyles[`grid-button-${type}`][PROPERTY_COLOR],
				[PROPERTY_BORDER_COLOR]: this.currentButtonStyles[`grid-button-${type}-${PROPERTY_BORDER_COLOR}`]
				|| this.siteStyles[`grid-button-${type}`][PROPERTY_BORDER_COLOR],
			};
		},
	},
});
</script>

<style lang="scss" scoped>
.style-content {
	--select-background: #{$color-light};

	&__item {
		display: flex;
		justify-content: center;
		padding: 8px 0;
		margin: 8px 0;
		background: $color-light;
		border: 1px solid $color-gray-light;
		border-radius: 3px;

		&--active {
			background: $color-azure-light;
			border: 1px solid $color-azure;
		}

		&:hover {
			border: 1px solid $color-gray;
		}
	}
}

.style-controler {
	margin-top: 16px;

	&__tabs {
		margin: 8px 0 16px;
	}

	&__content {
		margin-top: 8px;
		list-style: none;
	}

	&__item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 16px 0 8px;
		border-bottom: 1px solid $color-gray-light;
	}

	&__size-select {
		color: $color-gray;
	}

	&__label {
		margin: 16px 0 8px;
	}
}
</style>
