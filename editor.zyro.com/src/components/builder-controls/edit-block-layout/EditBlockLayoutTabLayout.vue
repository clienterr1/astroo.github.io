<template>
	<div class="layout-tab">
		<ZyroFieldToggle
			id="toggle-snapping"
			data-qa="sectionsettings-snaptoguides-toggle"
			:model-value="shouldSnapToGuides"
			:label="$t('builder.editBlockTabLayout.toggleGuideSnappingLabel')"
			:message="$t('builder.editBlockTabLayout.toggleGuideSnappingDescription')"
			class="layout-tab__snap-to-guides"
			@update:model-value="setBlockProperty('shouldSnapToGuides', $event)"
		/>

		<ZyroFieldToggle
			id="toggle-snapping-elements"
			:model-value="shouldSnapToElements"
			:label="$t('builder.editBlockTabLayout.toggleSnappingToElements')"
			@update:model-value="setBlockProperty('shouldSnapToElements', $event)"
		/>

		<div
			v-if="shouldSnapToGuides"
			class="layout-tab__range-container"
		>
			<ZyroLabel>
				{{ $t('builder.editBlockTabLayout.controlRangeRowHeight') }}
			</ZyroLabel>
			<ZyroRange
				v-qa="'section-settings-row-height-range'"
				:min="8"
				:max="40"
				step="1"
				has-number-input
				:model-value="snapRowHeight"
				@update:model-value="setBlockProperty('snapRowHeight', $event)"
			/>
		</div>

		<div
			v-if="shouldSnapToGuides"
			class="layout-tab__range-container"
		>
			<ZyroLabel>
				{{ $t('builder.editBlockTabLayout.controlRangeRowGap') }}
			</ZyroLabel>
			<ZyroRange
				v-qa="'section-settings-row-gap-range'"
				:min="8"
				:max="40"
				step="1"
				has-number-input
				:model-value="snapRowGap"
				@update:model-value="setBlockProperty('snapRowGap', $event)"
			/>
		</div>
	</div>
</template>

<script>
import ZyroFieldToggle from '@/components/global/ZyroFieldToggle.vue';
import ZyroLabel from '@/components/global/ZyroLabel.vue';
import ZyroRange from '@/components/global/ZyroRange.vue';

import { useLayout } from '@/components/block-layout/useLayout';

import { useStore } from 'vuex';

import {
	defineComponent,
	computed,
	onMounted,
	onUnmounted,
} from 'vue';
import {
	DEFAULT_SECTION_ROW_HEIGHT,
	DEFAULT_SECTION_ROW_GAP,
	DEFAULT_SNAP_TO_ELEMENTS,
	DEFAULT_SNAP_TO_GUIDES,
	DEFAULT_SNAPPING_PROPERTIES_MAP,
} from '@zyro-inc/site-modules/constants';

export default defineComponent({
	components: {
		ZyroFieldToggle,
		ZyroLabel,
		ZyroRange,
	},

	setup(props, context) {
		const {
			state,
			getters,
			dispatch,
		} = useStore();

		const currentBlock = computed(() => getters.currentBlock);
		const snapRowHeight = computed(() => currentBlock.value.snapRowHeight || DEFAULT_SECTION_ROW_HEIGHT);
		const snapRowGap = computed(() => currentBlock.value.snapRowGap || DEFAULT_SECTION_ROW_GAP);
		const shouldSnapToElements = computed(() => ('shouldSnapToElements' in currentBlock.value
			? currentBlock.value.shouldSnapToElements
			: DEFAULT_SNAP_TO_ELEMENTS));
		const shouldSnapToGuides = computed(() => ('shouldSnapToGuides' in currentBlock.value
			? currentBlock.value.shouldSnapToGuides
			: DEFAULT_SNAP_TO_GUIDES));

		const { isViewingLayoutSettings } = useLayout(props, context);

		onMounted(() => {
			isViewingLayoutSettings.value = true;
		});

		onUnmounted(() => {
			isViewingLayoutSettings.value = false;
		});

		const setBlockProperty = (propertyName, propertyValue) => {
			if (DEFAULT_SNAPPING_PROPERTIES_MAP[propertyName] === propertyValue) {
				const {
					[propertyName]: _,
					...restBlockProperties
				} = currentBlock.value;

				dispatch('updateBlockData', {
					blockId: state.currentBlockId,
					blockData: restBlockProperties,
					merge: false,
				});

				return;
			}

			dispatch('updateBlockData', {
				blockId: state.currentBlockId,
				blockData: {
					[propertyName]: propertyValue,
				},
				merge: true,
			});
		};

		return {
			snapRowHeight,
			snapRowGap,
			shouldSnapToElements,
			shouldSnapToGuides,
			setBlockProperty,
		};
	},
});
</script>

<style lang="scss" scoped>
.layout-tab {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: flex-start;

	> * {
		padding: 0 0 16px;
	}

	&__range-container {
		width: 100%;
	}
}
</style>
