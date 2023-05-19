<template>
	<div class="layout">
		<ZyroFieldToggle
			id="isStickyToggle"
			v-qa="`editblocknavigation-tablayout-issticky-${isSticky}`"
			:model-value="isSticky"
			:label="$t('builder.editBlockNavigation.tabLayout.stickyHeader')"
			@update:model-value="updateIsSticky"
		/>
		<ZyroSeparator />
		<div
			v-if="isMenuPositionSettingsEnabled"
			class="layout__menu-position"
		>
			<ZyroLabel class="layout__menu-position-label">
				{{ $t('builder.editBlockNavigation.tabLayout.menuPosition') }}
			</ZyroLabel>
			<ZyroIconControls
				:model-value="navigationPlacement"
				class="layout__menu-position-icons"
				:icons="$options.iconsJustify"
				:toggleable="false"
				@update:model-value="updateNavigationPlacement"
			/>
		</div>
		<ZyroSeparator />
		<ZyroFieldRange
			:model-value="menuItemSpacing"
			:qa="`editblocknavigation-tablayout-menuitemspacing-${menuItemSpacing}`"
			min="0"
			max="64"
			:label="$t('builder.editBlockNavigation.tabLayout.itemSpacing')"
			@update:model-value="updateMenuItemSpacing"
		/>
		<ZyroSeparator />
		<ZyroCssShorthandControlRange
			:model-value="padding"
			:qa="`editblocknavigation-tablayout-padding-${padding.replace(/ /g, '-')}`"
			class="layout__padding"
			:label="$t('common.padding')"
			@update:model-value="updatePadding"
		/>
	</div>
</template>

<script>
import ZyroCssShorthandControlRange from '@/components/global/ZyroCssShorthandControlRange.vue';
import ZyroFieldRange from '@/components/global/ZyroFieldRange.vue';
import ZyroFieldToggle from '@/components/global/ZyroFieldToggle.vue';
import ZyroIconControls from '@/components/global/ZyroIconControls.vue';
import ZyroLabel from '@/components/global/ZyroLabel.vue';
import ZyroSeparator from '@/components/global/ZyroSeparator.vue';

import {
	mapActions,
	useStore,
} from 'vuex';

import { useBuilderStyles } from '@/components/builder-controls/useBuilderStyles';

import {
	defineComponent,
	computed,
} from 'vue';

const iconsJustify = [
	{
		value: 'left',
		icon: 'align',
		direction: 'left',
	},
	{
		value: 'center',
		icon: 'align-middle-h',
	},
	{
		value: 'right',
		icon: 'align',
		direction: 'right',
	},
];

export default defineComponent({
	components: {
		ZyroCssShorthandControlRange,
		ZyroFieldRange,
		ZyroFieldToggle,
		ZyroIconControls,
		ZyroLabel,
		ZyroSeparator,
	},

	iconsJustify,

	setup() {
		const {
			getStyleValue,
			getStyleKey,
		} = useBuilderStyles();
		const {
			state,
			getters,
		} = useStore();

		const currentBlockId = computed(() => state.currentBlockId);
		const isMobileView = computed(() => state.gui.isMobileView);
		const currentBlockStyles = computed(() => getters.currentBlockStyles);
		const currentBlockSettings = computed(() => getters.currentBlockSettings);
		const isLocaleWithStore = computed(() => getters['ecwid/isLocaleWithEcwid'] || getters['ecommerce/isLocaleWithEcommerceItems']);
		const isMenuPositionSettingsEnabled = computed(() => (
			!isLocaleWithStore.value || !isMobileView.value || (isMobileView.value && !currentBlockSettings.value.isCartVisible)
		));

		return {
			getStyleValue,
			getStyleKey,
			currentBlockStyles,
			currentBlockSettings,
			isMobileView,
			currentBlockId,
			isMenuPositionSettingsEnabled,
		};
	},

	computed: {
		isSticky() {
			return this.currentBlockSettings.isSticky;
		},
		menuItemSpacing() {
			return Number.parseInt(this.getStyleValue('menu-item-spacing', this.currentBlockStyles), 10);
		},
		padding() {
			return this.getStyleValue('padding', this.currentBlockStyles);
		},
		navigationPlacement() {
			return this.isMobileView
				? this.currentBlockSettings['m-navigationPlacement'] || this.currentBlockSettings.navigationPlacement
				: this.currentBlockSettings.navigationPlacement;
		},
	},

	methods: {
		...mapActions(['updateBlockData']),

		updateIsSticky(newValue) {
			this.updateBlockData({
				blockId: this.currentBlockId,
				blockData: {
					settings: {
						isSticky: newValue,
					},
				},
				merge: true,
			});
		},
		updateMenuItemSpacing(newValue) {
			const key = this.getStyleKey('menu-item-spacing');

			this.updateBlockData({
				blockId: this.currentBlockId,
				blockData: {
					settings: {
						styles: {
							[key]: `${newValue}px`,
						},
					},
				},
				merge: true,
			});
		},
		updatePadding(newValue) {
			const key = this.getStyleKey('padding');

			this.updateBlockData({
				blockId: this.currentBlockId,
				blockData: {
					settings: {
						styles: {
							[key]: newValue,
						},
					},
				},
				merge: true,
			});
		},
		updateNavigationPlacement(newValue) {
			const key = this.isMobileView ? 'm-navigationPlacement' : 'navigationPlacement';

			this.updateBlockData({
				blockId: this.currentBlockId,
				blockData: {
					settings: {
						[key]: newValue,
					},
				},
				merge: true,
			});
		},
	},
});
</script>

<style lang="scss" scoped>
.layout {
	&__menu-position {
		&-label {
			margin: 16px 0 8px;
		}

		&-icons {
			margin: 8px 0;
		}
	}

	&__padding {
		margin: 16px 0 8px;
	}
}
</style>
