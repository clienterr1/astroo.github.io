<template>
	<div class="layout">
		<ZyroFieldToggle
			:id="`${id}-toggle`"
			:model-value="shouldShowIconsVertically"
			:label="$t('builder.editSocialIcons.tabLayout.displayVertically')"
			data-qa="edit-social-icons-popup-layout-toglefield-vertical"
			@update:model-value="updateShouldShowIconsVertically"
		/>
		<ZyroSeparator />
		<ZyroLabel class="layout__spacing-label">
			{{ $t('builder.editSocialIcons.tabLayout.iconSpacing') }}
		</ZyroLabel>
		<ZyroIconControls
			:model-value="iconSpacing"
			:icons="iconsSpacing"
			:class="{ 'layout__spacing--rotated': shouldShowIconsVertically }"
			:toggleable="false"
			data-qa="edit-social-icons-popup-layout-controls-spacing"
			@update:model-value="updateIconSpacing"
		/>
		<template v-if="!iconSpacing">
			<ZyroLabel>
				{{ $t('builder.editSocialIcons.tabLayout.spaceBetween') }}
			</ZyroLabel>
			<ZyroRange
				:model-value="spaceBetweenIcons"
				class="layout__spacing-input"
				min="0"
				step="1"
				max="64"
				data-qa="edit-social-icons-popup-layout-rangefield-space-between"
				@update:model-value="updateSpaceBetweenIcons"
			/>
		</template>
		<template v-if="showAlignmentOptions">
			<ZyroSeparator />
			<ZyroLabel class="layout__alignment-label">
				{{ $t('builder.editButton.tabLayoutLabel') }}
			</ZyroLabel>
			<div class="layout__alignment">
				<ZyroIconControls
					v-if="shouldShowIconsVertically || !iconSpacing"
					:model-value="align"
					:toggleable="false"
					:icons="$options.iconsAlign"
					data-qa="edit-social-icons-popup-layout-controls-align"
					@update:model-value="updateAlign"
				/>
				<ZyroIconControls
					v-if="!shouldShowIconsVertically || !iconSpacing"
					:model-value="justify"
					:toggleable="false"
					:icons="$options.iconsJustify"
					data-qa="edit-social-icons-popup-layout-controls-justify"
					@update:model-value="updateJustify"
				/>
			</div>
		</template>
	</div>
</template>

<script>
import ZyroFieldToggle from '@/components/global/ZyroFieldToggle.vue';
import ZyroIconControls from '@/components/global/ZyroIconControls.vue';
import ZyroLabel from '@/components/global/ZyroLabel.vue';
import ZyroRange from '@/components/global/ZyroRange.vue';
import ZyroSeparator from '@/components/global/ZyroSeparator.vue';

import { useDeviceElementHeight } from '@/use/useDeviceElementHeight';

import {
	useStore,
	mapGetters,
	mapActions,
} from 'vuex';

import {
	defineComponent,
	computed,
} from 'vue';

const iconsSpacing = [
	{
		value: 'space-between',
		icon: 'align-space-between-h',
	},
	{
		value: 'space-around',
		icon: 'align-space-around-h',
	},
	{
		value: '',
		icon: 'align-fixed',
		id: 'fixed',
	},
];

const iconsAlign = [
	{
		value: 'flex-start',
		icon: 'align',
		direction: 'left',
	},
	{
		value: 'center',
		icon: 'align-middle-h',
	},
	{
		value: 'flex-end',
		icon: 'align',
		direction: 'right',
	},
];
const iconsJustify = [
	{
		value: 'flex-start',
		icon: 'align',
		direction: 'up',
	},
	{
		value: 'center',
		icon: 'align-middle',
	},
	{
		value: 'flex-end',
		icon: 'align',
		direction: 'down',
	},
];

export default defineComponent({
	components: {
		ZyroFieldToggle,
		ZyroIconControls,
		ZyroLabel,
		ZyroRange,
		ZyroSeparator,
	},

	iconsAlign,
	iconsJustify,

	setup() {
		const { getters } = useStore();
		const currentElementId = computed(() => getters.currentElementId);
		const { updateElementHeightOnDevices } = useDeviceElementHeight();

		return {
			currentElementId,
			updateElementHeightOnDevices,
		};
	},

	computed: {
		...mapGetters([
			'currentElementStyles',
			'currentElementBlockType',
		]),
		shouldShowIconsVertically() {
			return this.currentElementStyles['icon-direction'] === 'column';
		},
		spaceBetweenIcons() {
			return Number.parseInt(this.currentElementStyles['space-between-icons'], 10);
		},
		iconSpacing() {
			return this.currentElementStyles['icon-spacing'];
		},
		align() {
			return this.currentElementStyles.align;
		},
		justify() {
			return this.currentElementStyles.justify;
		},
		isBlockLayoutBlock() {
			return this.currentElementBlockType === 'BlockLayout';
		},
		showAlignmentOptions() {
			return !this.isBlockLayoutBlock;
		},
		iconsSpacing() {
			if (this.isBlockLayoutBlock) {
				return iconsSpacing.filter((tab) => tab?.id !== 'fixed');
			}

			return iconsSpacing;
		},
	},

	methods: {
		...mapActions(['mergeCurrentElementData']),

		updateShouldShowIconsVertically(newValue) {
			if (newValue && !this.align) {
				this.align = this.$options.iconsAlign[1].value;
			} else if (!this.justify) {
				this.justify = this.$options.iconsJustify[1].value;
			}

			this.mergeCurrentElementData({
				elementData: {
					settings: {
						styles: {
							'icon-direction': newValue ? 'column' : 'row',
						},
					},
				},
			});

			this.updateElementHeightOnDevices({
				elementId: this.currentElementId,
			});
		},
		updateSpaceBetweenIcons(newValue) {
			this.mergeCurrentElementData({
				elementData: {
					settings: {
						styles: {
							'space-between-icons': `${newValue}px`,
						},
					},
				},
			});
		},
		updateIconSpacing(newValue) {
			if (this.shouldShowIconsVertically) {
				this.justify = !newValue ? this.$options.iconsJustify[1].value : '';
			} else {
				this.align = !newValue ? this.$options.iconsAlign[1].value : '';
			}

			this.mergeCurrentElementData({
				elementData: {
					settings: {
						styles: {
							'icon-spacing': newValue,
						},
					},
				},
			});
		},
		updateAlign(newValue) {
			this.mergeCurrentElementData({
				elementData: {
					settings: {
						styles: {
							align: newValue,
						},
					},
				},
			});
		},
		updateJustify(newValue) {
			this.mergeCurrentElementData({
				elementData: {
					settings: {
						styles: {
							justify: newValue,
						},
					},
				},
			});
		},
	},
});
</script>

<style lang="scss" scoped>
.layout {
	display: flex;
	flex-direction: column;

	&__spacing {
		&-label {
			margin-top: 16px;
		}

		&-input {
			margin-bottom: 16px;
		}

		&--rotated {
			:deep(svg) {
				transform: rotateZ(90deg);
			}
		}
	}

	&__alignment {
		display: flex;

		> *:not(:last-child) {
			margin-right: 24px;
		}

		&-label {
			margin: 16px 0 8px;
		}
	}
}
</style>
