<template>
	<EditBlockTabBackground>
		<template #top>
			<div>
				<div class="colors-wrapper">
					<ZyroLabel>{{ $t('builder.editText.textColor') }}</ZyroLabel>
					<ColorPicker
						:model-value="textColor"
						:offset="250"
						placement="left"
						:is-open="isTextColorsOpen"
						@update:model-value="updateTextColor"
						@click-outside="isTextColorsOpen = false"
						@toggle="isTextColorsOpen = !isTextColorsOpen"
					/>
				</div>
				<template v-if="blockTypeProduct">
					<div class="divider" />
					<div class="colors-wrapper">
						<ZyroLabel>{{ $t('builder.colorsOfArrows') }}</ZyroLabel>
						<ColorPicker
							:model-value="navigationArrowsColor"
							:offset="250"
							placement="left"
							:is-open="isNavigationArrowsColorsOpen"
							@update:model-value="updateBlockDataByKey('navigationArrowsColor', $event)"
							@click-outside="isNavigationArrowsColorsOpen = false"
							@toggle="isNavigationArrowsColorsOpen = !isNavigationArrowsColorsOpen"
						/>
					</div>
					<div class="colors-wrapper">
						<ZyroLabel>{{ $t('builder.colorsOfArrowsForThumbnails') }}</ZyroLabel>
						<ColorPicker
							:model-value="navigationThumbnailArrowsColor"
							:offset="250"
							placement="left"
							:is-open="isNavigationThumbnailArrowsColorsOpen"
							@update:model-value="updateBlockDataByKey('navigationThumbnailArrowsColor', $event)"
							@click-outside="isNavigationThumbnailArrowsColorsOpen = false"
							@toggle="isNavigationThumbnailArrowsColorsOpen = !isNavigationThumbnailArrowsColorsOpen"
						/>
					</div>
					<div class="divider" />
				</template>
				<ZyroLabel class="background-label">
					{{ $t('builder.ecommerceSectionBackground') }}
				</ZyroLabel>
			</div>
		</template>
	</EditBlockTabBackground>
</template>

<script>
import ZyroLabel from '@/components/global/ZyroLabel.vue';
import ColorPicker from '@/components/global/ColorPicker.vue';

import cloneDeep from 'lodash.clonedeep';
import {
	mapState,
	mapGetters,
	mapActions,
} from 'vuex';

import setCustomTextStyleVariables from '@/components/builder-controls/common-ecommerce/setCustomTextStyleVariables';
import EditBlockTabBackground from '@/components/builder-controls/edit-block/EditBlockTabBackground.vue';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroLabel,
		ColorPicker,
		EditBlockTabBackground,
	},

	props: {
		blockTypeProduct: {
			type: Boolean,
			default: false,
		},
	},

	data() {
		return {
			blockId: '',
			initialCurrentBlockData: null,
			isNavigationArrowsColorsOpen: false,
			isNavigationThumbnailArrowsColorsOpen: false,
			isTextColorsOpen: false,
		};
	},

	computed: {
		...mapState(['currentBlockId']),
		...mapGetters(['currentBlock']),
		textColor() {
			const { textColorVars } = this.currentBlock;

			return textColorVars && Object.keys(textColorVars).length ? textColorVars[Object.keys(textColorVars)[0]] : 'var(--body-color)';
		},
		navigationArrowsColor() {
			return this.currentBlock.navigationArrowsColor || 'rgb(0, 0, 0)';
		},
		navigationThumbnailArrowsColor() {
			return this.currentBlock.navigationThumbnailArrowsColor || 'rgb(0, 0, 0)';
		},
	},

	mounted() {
		this.blockId = this.currentBlockId;
		this.initialCurrentBlockData = cloneDeep(this.currentBlock);
	},

	beforeUnmount() {
		this.createSnapshot();
	},

	methods: {
		...mapActions(['updateBlockData']),
		...mapActions('undoRedo', ['createSnapshot']),
		updateTextColor(newValue) {
			this.updateBlockData({
				blockId: this.blockId,
				blockData: {
					textColorVars: setCustomTextStyleVariables('color', newValue),
				},
				merge: true,
			});
		},
		updateBlockDataByKey(key, value) {
			this.updateBlockData({
				blockId: this.blockId,
				blockData: {
					[key]: value,
				},
				merge: true,
			});
		},
	},
});
</script>

<style lang="scss" scoped>
.colors-wrapper {
	display: flex;
	margin-bottom: 16px;
}

.separator {
	margin-bottom: 16px;
}

.background-label {
	margin-bottom: 18px;
}

.divider {
	margin-top: 24px;
	margin-bottom: 24px;
	border-top: 1px solid $color-gray-light;
}
</style>
