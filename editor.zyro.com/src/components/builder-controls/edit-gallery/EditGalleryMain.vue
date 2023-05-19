<template>
	<div>
		<div v-if="!isMobileView">
			<ZyroLabel class="layout-label">
				{{ $t('builder.editGallery.layout') }}
			</ZyroLabel>
			<ZyroIconSelect
				:model-value="layout"
				:options="layoutOptions"
				group-name="gallery-layout"
				@update:model-value="updateLayout({ layout: $event })"
			/>
		</div>
		<ZyroFieldRange
			qa="items-per-row-slider"
			:label="$t('builder.editCommon.itemsPerRow')"
			units=""
			:model-value="columnCount"
			min="1"
			max="16"
			@update:model-value="updateColumnStyles({ columnCount: $event })"
		/>
		<ZyroFieldRange
			qa="gap-between-photos-slider"
			:label="$t('builder.editCommon.gapBetweenPhotos')"
			:model-value="columnGap"
			min="0"
			max="64"
			step="2"
			@update:model-value="updateColumnStyles({ columnGap: $event })"
		/>
		<ZyroDropdown
			v-if="!isMobileView"
			:model-value="imageClickAction"
			:options="imageClickActions"
			:label="$t('builder.onClick')"
			button-size="large"
			@update:model-value="updateImageSettings({ imageClickAction: $event.value })"
		/>
		<NpsRateFeature
			:feature-name="$t('builder.npsRateGallery')"
			:type="NPS_TYPE_FEATURE_GALLERY"
		/>
	</div>
</template>

<script>

import {
	mapState,
	mapGetters,
	mapActions,
} from 'vuex';
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

import ZyroDropdown from '@/components/global/ZyroDropdown.vue';
import ZyroFieldRange from '@/components/global/ZyroFieldRange.vue';
import ZyroIconSelect from '@/components/global/ZyroIconSelect.vue';
import ZyroLabel from '@/components/global/ZyroLabel.vue';
import { useDeviceElementHeight } from '@/use/useDeviceElementHeight';

import {
	IMAGE_CLICK_ACTION_NONE,
	IMAGE_CLICK_ACTION_LIGHTBOX,
	ELEMENT_POSITION_KEY_MOBILE,
	ELEMENT_POSITION_KEY_DESKTOP,
} from '@zyro-inc/site-modules/constants';

import EventLogApi from '@/api/EventLogApi';
import { useBuilderStyles } from '@/components/builder-controls/useBuilderStyles';
import NpsRateFeature from '@/components/ui/NpsRateFeature.vue';
import { NPS_TYPE_FEATURE_GALLERY } from '@/constants';

export default defineComponent({
	components: {
		ZyroDropdown,
		ZyroFieldRange,
		ZyroIconSelect,
		ZyroLabel,
		NpsRateFeature,
	},

	setup() {
		const {
			getStyleValue,
			getStyleKey,
		} = useBuilderStyles();
		const { t } = useI18n();
		const { updateElementHeightOnDevices } = useDeviceElementHeight();

		const layoutOptions = {
			grid: {
				name: t('builder.editGallery.grid'),
				icon: 'grid',
			},
			masonry: {
				name: t('builder.editGallery.masonry'),
				icon: 'masonry',
			},
		};

		const imageClickActions = [
			{
				title: t('builder.imageClickAction.action.none'),
				value: IMAGE_CLICK_ACTION_NONE,
			},
			{
				title: t('builder.imageClickAction.action.lightbox'),
				value: IMAGE_CLICK_ACTION_LIGHTBOX,
			},
		];

		const getImageClickAction = (action) => imageClickActions
			.find((actionSet) => actionSet.value === action);

		return {
			getStyleValue,
			getStyleKey,
			getImageClickAction,
			NPS_TYPE_FEATURE_GALLERY,
			layoutOptions,
			imageClickActions,
			updateElementHeightOnDevices,
		};
	},

	computed: {
		...mapState('gui', ['isMobileView']),
		...mapGetters([
			'currentElement',
			'currentElementId',
			'currentElementSettings',
			'currentElementStyles',
		]),
		layout() {
			return this.currentElementSettings.layout;
		},
		elementPositionKey() {
			return this.isMobileView ? ELEMENT_POSITION_KEY_MOBILE : ELEMENT_POSITION_KEY_DESKTOP;
		},
		columnCount() {
			return this.currentElement[this.elementPositionKey].columnCount;
		},
		columnGap() {
			return this.currentElement[this.elementPositionKey].columnGap;
		},
		imageClickAction() {
			return this.getImageClickAction(this.currentElementSettings.imageClickAction);
		},
	},

	methods: {
		...mapActions(['mergeCurrentElementData']),
		updateLayout(layout) {
			EventLogApi.logEvent({
				eventName: 'builder.image_gallery.set_layout',
				eventProperties: {
					layout,
				},
			});

			this.updateImageSettings(layout);

			this.updateElementHeightOnDevices({
				elementId: this.currentElementId,
			});
		},
		updateImageSettings(settingsToMerge) {
			this.mergeCurrentElementData({
				elementData: {
					settings: {
						...settingsToMerge,
					},
				},
			});
		},
		updateColumnStyles(stylesToMerge) {
			this.mergeCurrentElementData({
				elementData: {
					[this.elementPositionKey]: {
						...stylesToMerge,
					},
				},
			});
		},
	},
});
</script>

<style lang="scss" scoped>
.layout-label {
	margin-bottom: 8px;
}
</style>
