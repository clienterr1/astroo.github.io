<template>
	<div class="background-style">
		<div class="background-style__flex-container background-style__with-margin-bottom">
			<ZyroLabel>{{ $t('builder.editButton.customButtonStyles.fillColor') }}</ZyroLabel>
			<div class="background-style__flex-container">
				<ZyroFieldColorPicker
					v-if="!!currentElement.formBackgroundColor && currentElement.formBackgroundColor !== 'transparent'"
					:is-open="isFillColorPickerOpen"
					placement="right-start"
					class="background-style__with-margin-right"
					:model-value="formFillColor"
					@update:model-value="setStyles({
						formBackgroundColor: $event,
						innerBackground: { color: $event }
					})"
					@toggle="isFillColorPickerOpen = !isFillColorPickerOpen"
					@click-outside="isFillColorPickerOpen = false"
				/>
				<ZyroToggle
					id="form-background-fill-color"
					:model-value="!!currentElement.formBackgroundColor && currentElement.formBackgroundColor !== 'transparent'"
					@update:model-value="setStyles({
						formBackgroundColor: $event ? currentElement.innerBackground.color : 'transparent',
						innerBackground: { color: currentElement.formBackgroundColor, }
					})"
				/>
			</div>
		</div>
		<ZyroSeparator class="background-style__with-margin-bottom" />
		<div class="background-style__flex-container background-style__with-margin-bottom">
			<ZyroLabel>{{ $t('builder.editButton.customButtonStyles.borderColor') }}</ZyroLabel>
			<ZyroFieldColorPicker
				:is-open="isBorderColorPickerOpen"
				placement="right-start"
				:model-value="formBorderColor"
				@update:model-value="setStyles({ formBorderColor: $event })"
				@toggle="isBorderColorPickerOpen = !isBorderColorPickerOpen"
				@click-outside="isBorderColorPickerOpen = false"
			/>
		</div>
		<div>
			<ZyroLabel>{{ $t('builder.editButton.customButtonStyles.borderWidth') }}</ZyroLabel>
			<ZyroRange
				:min="DEFAULT_BORDER_WIDTH"
				:max="MAX_BORDER_WIDTH"
				:step="1"
				has-number-input
				:model-value="formBorderWidth"
				@update:model-value="setStyles({ formBorderWidth: $event })"
			/>
		</div>
		<div class="background-style__border-radius">
			<ZyroLabel>{{ $t('common.cornerRadius') }}</ZyroLabel>
			<ZyroRange
				:min="DEFAULT_BORDER_RADIUS"
				:max="MAX_BORDER_RADIUS"
				:step="1"
				has-number-input
				:model-value="formBorderRadius"
				@update:model-value="setStyles({ formBorderRadius: $event })"
			/>
		</div>
		<ZyroSeparator class="background-style__with-margin-bottom" />
		<div class="background-style__with-margin-bottom">
			<ZyroLabel>{{ $t('builder.editButton.customButtonStyles.spacing') }}</ZyroLabel>
			<ZyroRange
				:min="MIN_SPACING"
				:max="MAX_SPACING"
				:step="1"
				has-number-input
				:model-value="formPadding"
				@update:model-value="setStyles({ formPadding: $event })"
			/>
		</div>
	</div>
</template>

<script>
import {
	defineComponent,
	ref,
} from 'vue';

import {
	mapGetters,
	mapActions,
} from 'vuex';

import ZyroLabel from '@/components/global/ZyroLabel.vue';
import ZyroToggle from '@/components/global/ZyroToggle.vue';
import ZyroFieldColorPicker from '@/components/global/ZyroFieldColorPicker.vue';
import ZyroSeparator from '@/components/global/ZyroSeparator.vue';
import ZyroRange from '@/components/global/ZyroRange.vue';

const DEFAULT_BORDER_COLOR = 'rgb(0, 0, 0)';
const DEFAULT_BORDER_WIDTH = 0;
const MAX_BORDER_WIDTH = 8;
const DEFAULT_BORDER_RADIUS = 0;
const MAX_BORDER_RADIUS = 100;
const MIN_SPACING = 0;
const MAX_SPACING = 80;

export default defineComponent({
	components: {
		ZyroLabel,
		ZyroToggle,
		ZyroFieldColorPicker,
		ZyroSeparator,
		ZyroRange,
	},
	setup() {
		const isFillColorPickerOpen = ref(false);
		const isBorderColorPickerOpen = ref(false);

		return {
			isFillColorPickerOpen,
			isBorderColorPickerOpen,
			DEFAULT_BORDER_WIDTH,
			MAX_BORDER_WIDTH,
			DEFAULT_BORDER_RADIUS,
			MAX_BORDER_RADIUS,
			MIN_SPACING,
			MAX_SPACING,
		};
	},
	computed: {
		...mapGetters(['currentElement']),
		formFillColor() {
			const currentBackgroundColor = this.currentElement.formBackgroundColor;
			const defaultBackgroundColor = this.currentElement.innerBackground.color;

			return currentBackgroundColor || defaultBackgroundColor;
		},
		formBorderColor() {
			return this.currentElement.formBorderColor || DEFAULT_BORDER_COLOR;
		},
		formBorderWidth() {
			return this.currentElement.formBorderWidth || DEFAULT_BORDER_WIDTH;
		},
		formBorderRadius() {
			return this.currentElement.formBorderRadius || DEFAULT_BORDER_RADIUS;
		},
		formPadding() {
			return this.currentElement.formPadding;
		},
	},
	methods: {
		...mapActions(['mergeCurrentElementData']),
		setStyles(stylesToMerge) {
			this.mergeCurrentElementData({
				elementData: {
					...stylesToMerge,
				},
			});
		},
	},
});
</script>

<style lang="scss" scoped>
.background-style {
	display: flex;
	flex-direction: column;

	&__flex-container {
		display: flex;
		align-items: center;
	}

	&__with-margin-right {
		margin-right: 8px;
	}

	&__with-margin-bottom {
		margin-bottom: 16px;
	}

	&__border-radius {
		margin-bottom: 24px;
	}
}
</style>
