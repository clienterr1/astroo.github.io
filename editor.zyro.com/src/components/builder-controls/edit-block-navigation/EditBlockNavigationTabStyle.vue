<template>
	<div class="navigation-style">
		<ZyroFieldColorPicker
			v-qa="'editblocknavigation-tabstyle-backgroundcolor'"
			:is-open="isBackgroundColorPickerOpen"
			:model-value="backgroundColor"
			placement="left-start"
			class="navigation-style__item"
			:label="$t('builder.editBlockNavigation.tabStyle.headerBackground')"
			@update:model-value="handleBackgroundColorInput"
			@toggle="isBackgroundColorPickerOpen = !isBackgroundColorPickerOpen"
			@click-outside="isBackgroundColorPickerOpen = false"
		/>
		<ZyroFieldToggle
			v-if="!isMobileMode"
			id="isTransparentToggle"
			v-qa="`editblocknavigation-tabstyle-istransparent-${currentBlock.background.isTransparent}`"
			class="navigation-style__item"
			:label="$t('builder.editBlockNavigation.tabStyle.headerTransparent')"
			:model-value="currentBlock.background.isTransparent"
			@update:model-value="updateIsBackgroundTransparent"
		/>
		<ZyroSeparator class="navigation-style__separator" />
		<ZyroFieldFontSelect
			:current-font-family="currentNavigationFont"
			:is-open="isFontSelectOpen"
			@set-font-family="handleTextFontFamilyChange"
			@toggle="isFontSelectOpen = !isFontSelectOpen"
			@close="isFontSelectOpen = false"
		/>
		<ZyroFieldColorPicker
			v-qa="'editblocknavigation-tabstyle-headertextcolor-btn'"
			class="navigation-style__item"
			:model-value="navLinkTextColors.normal || siteStyles['nav-link'].color"
			:is-open="isTextColorPickerOpen"
			placement="left-start"
			:label="$t('builder.editBlockNavigation.tabStyle.textColor')"
			@update:model-value="handleTextColorInput"
			@toggle="isTextColorPickerOpen = !isTextColorPickerOpen"
			@click-outside="isTextColorPickerOpen = false"
		/>
		<ZyroFieldColorPicker
			v-qa="'editblocknavigation-tabstyle-hovercolor-btn'"
			:model-value="navLinkTextColors.hover || siteStyles['nav-link']['color-hover'] || siteStyles['nav-link'].color"
			class="navigation-style__item"
			:is-open="isTextHoverColorPickerOpen"
			placement="left-start"
			:label="$t('builder.editBlockNavigation.tabStyle.hoverColor')"
			@update:model-value="handleTextColorHoverInput"
			@toggle="isTextHoverColorPickerOpen = !isTextHoverColorPickerOpen"
			@click-outside="isTextHoverColorPickerOpen = false"
		/>
		<ZyroSeparator class="navigation-style__separator" />
		<ZyroButton
			v-qa="'editblocknavigation-tabstyle-edittextstyles-btn'"
			theme="outline"
			class="navigation-style__edit-text-styles-button"
			@click="openLinkStylesDrawer"
		>
			{{ $t('builder.editBlockNavigation.tabStyle.editTextStyles') }}
		</ZyroButton>
	</div>
</template>

<script>
import tinycolor from 'tinycolor2';
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroFieldColorPicker from '@/components/global/ZyroFieldColorPicker.vue';
import ZyroFieldFontSelect from '@/components/global/ZyroFieldFontSelect.vue';

import ZyroFieldToggle from '@/components/global/ZyroFieldToggle.vue';
import ZyroSeparator from '@/components/global/ZyroSeparator.vue';

import {
	mapState,
	mapGetters,
	mapMutations,
	mapActions,
} from 'vuex';

import { TYPOGRAPHY_NAV_LINK } from '@zyro-inc/site-modules/constants/globalStyles';

import {
	DRAWER_STYLES_TAB_ID_TYPOGRAPHY,
	DRAWER_GLOBAL_STYLES_TAB_ID_TYPOGRAPHY,
	DRAWER_USER_STYLES,
	DRAWER_GLOBAL_STYLES,
	USER_STYLES_SELECT_KEY_PARAGRAPH,
	COLOR_LIGHT,
} from '@/constants';
import { useDrawerTabs } from '@/components/builder-drawers/drawers/use/useDrawerTabs';
import {
	CHANGE_DRAWER_PAGE,
	mapActionsGui,
	TOGGLE_DRAWER,
} from '@/store/builder/gui';
import { useElementContrast } from '@/use/useElementContrast';

import { defineComponent } from 'vue';
import {
	extractFontName,
	extractFontTypeFromVariable,
	websiteFontNames,
} from '@zyro-inc/site-modules/utils/font';

const DEFAULT_BACKGROUND = {
	color: 'rgb(255, 255, 255)',
	current: 'color',
};

export default defineComponent({
	components: {
		ZyroButton,
		ZyroFieldColorPicker,
		ZyroFieldFontSelect,
		ZyroFieldToggle,
		ZyroSeparator,
	},

	setup() {
		const {
			getContrastColor,
			getLighterColorShade,
			getDarkerColorShade,
		} = useElementContrast();

		const { changeCurrentTab } = useDrawerTabs();

		return {
			getContrastColor,
			getLighterColorShade,
			getDarkerColorShade,
			changeCurrentTab,
		};
	},

	data() {
		return {
			isBackgroundColorPickerOpen: false,
			isTextColorPickerOpen: false,
			isTextHoverColorPickerOpen: false,
			isFontSelectOpen: false,
		};
	},

	computed: {
		...mapState(['currentBlockId']),
		...mapState('gui', ['isMobileMode']),
		...mapState('fonts', ['siteFonts']),
		...mapGetters([
			'currentBlock',
			'siteStyles',
			'siteFonts',
		]),
		backgroundColor() {
			const { background } = this.currentBlock;

			return ('current' in background) ? background.color : DEFAULT_BACKGROUND.color;
		},
		navLinkTextColors() {
			return {
				normal: this.currentBlock.navLinkTextColor,
				hover: this.currentBlock.navLinkTextColorHover,
			};
		},
		currentNavigationFont() {
			const localFont = this.currentBlock?.fontFamily;
			const globalFontVar = extractFontName(this.siteStyles['nav-link']['font-family']);
			const globalFontType = extractFontTypeFromVariable(globalFontVar);
			const globalFont = websiteFontNames(this.siteFonts)[globalFontType];

			return localFont ?? globalFont;
		},
	},

	methods: {
		...mapMutations(['setStyleProperty']),
		...mapActions(['updateBlockData']),
		...mapActionsGui({
			toggleDrawer: TOGGLE_DRAWER,
			changeDrawerPage: CHANGE_DRAWER_PAGE,
		}),
		handleTextFontFamilyChange({
			fontFamily,
			fontWeight,
		}) {
			this.updateBlockData({
				blockId: this.currentBlockId,
				blockData: {
					fontFamily,
					fontWeight,
				},
				merge: true,
			});

			this.isFontSelectOpen = false;
		},
		handleBackgroundColorInput(color) {
			const constrastColor = tinycolor(color).isDark() ? 'light' : 'dark';
			const colorShadeOffset = 12;
			const contrastBackgroundColor = (constrastColor === COLOR_LIGHT
				? tinycolor(color).lighten(colorShadeOffset)
				: tinycolor(color).darken(colorShadeOffset)).toRgbString();

			this.updateBlockData({
				blockId: this.currentBlockId,
				blockData: {
					settings: {
						styles: {
							contrastBackgroundColor,
						},
					},
					background: {
						color,
						current: 'color',
					},
				},
				merge: true,
			});
		},
		// Taken mostly from EditTextTypeControls.vue
		openLinkStylesDrawer() {
			if (import.meta.env.DEV) {
				this.toggleDrawer(DRAWER_GLOBAL_STYLES);
				this.changeCurrentTab({
					drawer: DRAWER_GLOBAL_STYLES,
					tabId: DRAWER_GLOBAL_STYLES_TAB_ID_TYPOGRAPHY,
				});
			} else {
				this.toggleDrawer(DRAWER_USER_STYLES);
				this.changeCurrentTab({
					drawer: DRAWER_USER_STYLES,
					tabId: DRAWER_STYLES_TAB_ID_TYPOGRAPHY,
				});
				this.changeDrawerPage({
					drawerKey: DRAWER_USER_STYLES,
					pageKey: USER_STYLES_SELECT_KEY_PARAGRAPH,
					options: {
						currentTypographyType: TYPOGRAPHY_NAV_LINK,
					},
				});
			}
		},
		handleTextColorInput(value) {
			this.setStyleProperty({
				element: 'nav-link',
				property: 'color',
				value,
			});

			// Support for Global Colors
			this.updateBlockData({
				blockId: this.currentBlockId,
				blockData: {
					navLinkTextColor: value,
				},
				merge: true,
			});
		},
		handleTextColorHoverInput(value) {
			this.setStyleProperty({
				element: 'nav-link',
				property: 'color-hover',
				value,
			});

			// Support for Global Colors
			this.updateBlockData({
				blockId: this.currentBlockId,
				blockData: {
					navLinkTextColorHover: value,
				},
				merge: true,
			});
		},
		updateIsBackgroundTransparent(newValue) {
			this.updateBlockData({
				blockId: this.currentBlockId,
				blockData: {
					background: {
						isTransparent: newValue,
						current: 'color',
					},
				},
				merge: true,
			});
		},
	},
});
</script>

<style lang="scss" scoped>
	.navigation-style {
		&__item {
			padding: 8px 0;
		}

		&__separator {
			margin: 8px 0;
		}

		&__edit-text-styles-button {
			display: block;
			align-self: center;
			margin: 12px auto 0;
		}
	}
</style>
