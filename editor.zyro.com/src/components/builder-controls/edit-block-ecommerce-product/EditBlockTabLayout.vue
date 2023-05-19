<template>
	<div class="ecommerce-tab-layout">
		<ZyroLabel>{{ $t('builder.ecommerceSectionTextAlignment') }}</ZyroLabel>
		<ZyroIconSelect
			:model-value="textAlignment"
			:options="TEXT_ALIGNMENT_OPTIONS"
			label-padding="0"
			:items-per-row="3"
			icon-container-padding="4px 12px"
			class="ecommerce-tab-layout__controls ecommerce-tab-layout__controls--grey"
			group-name="text-alignment"
			active-icon-color="var(--color-azure)"
			active-background-color="var(--color-azure-lighter)"
			@update:model-value="updateTextAlignment"
		/>
		<ZyroLabel>{{ $t('builder.ecommerceSectionGalleryPlacement') }}</ZyroLabel>
		<ZyroIconSelect
			:model-value="galleryPlacement"
			:options="GALLERY_PLACEMENT_OPTIONS"
			label-padding="0"
			:items-per-row="3"
			icon-container-padding="15px 24px"
			class="ecommerce-tab-layout__controls ecommerce-tab-layout__controls--grey"
			group-name="text-alignment"
			active-icon-color="var(--color-azure)"
			active-background-color="var(--color-azure-lighter)"
			@update:model-value="updateBlockDataByKey('galleryPlacement', $event)"
		/>
		<ZyroLabel>
			{{ $t('builder.zyroEcommerceImageRatio') }}
		</ZyroLabel>
		<ZyroRadioList
			:model-value="imageRatio"
			:options="IMAGE_RATIO_OPTIONS"
			class="ecommerce-tab-layout__controls"
			@update:model-value="updateBlockDataByKey('imageRatio', $event)"
		/>
		<div
			v-if="imageRatio === 'cover'"
			class="ecommerce-tab-layout__image-border"
		>
			<ZyroLabel>
				{{ $t('builder.imageCornerRadius') }}
			</ZyroLabel>
			<ZyroRange
				:model-value="borderRadiusForImage"
				class="ecommerce-tab-layout__controls ecommerce-tab-layout__controls--range"
				min="0"
				units="%"
				has-number-input
				step="1"
				max="50"
				@update:model-value="updateBorderRadiusForImage"
			/>
		</div>
		<EditBlockPadding />
	</div>
</template>

<script>
import ZyroIconSelect from '@/components/global/ZyroIconSelect.vue';
import ZyroLabel from '@/components/global/ZyroLabel.vue';
import ZyroRadioList from '@/components/global/ZyroRadioList.vue';
import ZyroRange from '@/components/global/ZyroRange.vue';

import cloneDeep from 'lodash.clonedeep';
import {
	mapState,
	mapGetters,
	mapActions,
} from 'vuex';

import EditBlockPadding from '@/components/builder-controls/reusable-controls/block/EditBlockPadding.vue';
import { useI18n } from 'vue-i18n';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroIconSelect,
		ZyroLabel,
		ZyroRadioList,
		ZyroRange,
		EditBlockPadding,
	},

	setup() {
		const { t } = useI18n();

		const TEXT_ALIGNMENT_OPTIONS = {
			left: {
				name: t('common.left'),
				icon: 'layout-left',
				iconDimensions: '56px',
			},
			center: {
				name: t('common.center'),
				icon: 'layout-center',
				iconDimensions: '56px',
			},
		};

		const GALLERY_PLACEMENT_OPTIONS = {
			bottom: {
				name: t('common.bottom'),
				icon: 'gallery-bottom',
				iconDimensions: '32px',
			},
			left: {
				name: t('common.left'),
				icon: 'gallery-left',
				iconDimensions: '32px',
			},
		};

		const IMAGE_RATIO_OPTIONS = {
			cover: {
				name: t('common.square'),
			},
			contain: {
				name: t('common.original'),
			},
		};

		return {
			TEXT_ALIGNMENT_OPTIONS,
			GALLERY_PLACEMENT_OPTIONS,
			IMAGE_RATIO_OPTIONS,
		};
	},

	data() {
		return {
			blockId: '',
			initialCurrentBlockData: null,
		};
	},

	computed: {
		...mapState(['currentBlockId']),
		...mapGetters([
			'currentBlock',
			'currentBlockStyles',
		]),
		textAlignment() {
			return this.currentBlockStyles?.textAlign || 'left';
		},
		galleryPlacement() {
			return this.currentBlock.galleryPlacement || 'bottom';
		},
		imageRatio() {
			return this.currentBlock.imageRatio || 'cover';
		},
		borderRadiusForImage() {
			return Number.parseFloat(this.currentBlock.imageBorderRadius || 0);
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

		updateTextAlignment(newValue) {
			this.updateBlockData({
				blockId: this.blockId,
				blockData: {
					settings: {
						styles: {
							textAlign: newValue,
						},
					},
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
		updateBorderRadiusForImage(newValue) {
			this.updateBlockData({
				blockId: this.blockId,
				blockData: {
					imageBorderRadius: `${newValue || 0}%`, // OR needed for input field to display correct value
				},
				merge: true,
			});
		},
	},
});
</script>

<style lang="scss" scoped>
.ecommerce-tab-layout {
	--select-background: #{$color-light};

	&__controls {
		margin: 8px 0 24px;

		&:last-child {
			margin-bottom: 0;
		}

		&--grey {
			color: $color-gray;
		}
	}
}

:deep() {
	.zyro-range {
		&__input-wrapper::after {
			top: 0;
			margin-left: 5px;
			content: "%";
		}
	}
}

</style>
