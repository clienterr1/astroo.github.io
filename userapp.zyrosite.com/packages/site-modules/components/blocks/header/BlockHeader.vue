<template>
	<header
		ref="headerRef"
		:class="{
			[BLOCK_HEADER_CLASS]: true,
			[BLOCK_HEADER_STICKY_CLASS]: isSticky,
			'block-header--with-shadow': isWithShadow,
		}"
	>
		<BlockHeaderBackground
			v-if="background"
			:type="background.current"
			:image-url="backgroundImageUrl"
			:color="background.color"
			:overlay-opacity="Number(background['overlay-opacity'])"
			:is-transparent="isCurrentlyTransparent"
		/>
		<div
			class="block-header__content"
			:class="{ 'block-header__content--open': isOpen }"
			:style="computedStyles"
		>
			<BlockHeaderLogo
				v-if="isLogoVisible"
				class="block-header__logo"
				:class="{ 'block-header__logo--m-with-cart': isCartVisible }"
				:logo-src="logoSrc"
				:logo-svg="logoSvg"
				:href="logoHref"
				:site-name="siteName"
				:max-width="logoMaxWidth"
				:max-width-mobile="logoMaxWidthMobile"
				:height="logoHeight"
				:height-mobile="logoHeightMobile"
				:is-optimized="isLogoOptimized"
				:object-position="logoObjectPosition"
				:object-position-mobile="logoObjectPositionMobile"
			/>

			<ZyroHamburger
				v-if="items.length || isLanguageSwitcherVisible"
				v-qa="'builder-siteheader-btn-hamburger'"
				class="block-header__burger"
				:class="{ 'block-header__burger--m-with-cart': isCartVisible }"
				:is-open="isOpen"
				@click.stop="$emit('toggle-visibility')"
			/>

			<nav class="block-header__nav">
				<ul
					v-qa="'builder-siteheader-emptyspace'"
					class="block-header__links"
					:class="[
						{ 'block-header__links--open': isOpen },
						`block-header__links--align-${ navigationPlacementMobile || navigationPlacement }`,
					]"
				>
					<BlockHeaderItem
						v-for="item in items"
						:key="item.id"
						:item="item"
						:are-dropdowns-hidden="areDropdownsHidden"
					/>
					<LanguageSwitcher
						v-if="isLanguageSwitcherVisible"
						:class="{ 'mouse-disabled': areDropdownsHidden }"
						:languages="languageSwitcherLanguages"
						:current-locale="currentLocale"
					/>
				</ul>
			</nav>

			<BlockHeaderCart
				v-if="isCartVisible"
				class="block-header__cart"
				:cart-text="cartText"
				:cart-icon-size="cartIconSize"
				:cart-url="cartUrl"
				:items-in-cart="itemsInCart"
				@cart-click="$emit('cart-click')"
			/>
		</div>
	</header>
</template>

<script>
import LanguageSwitcher from '@zyro-inc/site-modules/components/LanguageSwitcher.vue';
import ZyroHamburger from '@zyro-inc/site-modules/components/ZyroHamburger.vue';
import BlockHeaderBackground from '@zyro-inc/site-modules/components/blocks/header/BlockHeaderBackground.vue';
import BlockHeaderCart from '@zyro-inc/site-modules/components/blocks/header/BlockHeaderCart.vue';
import BlockHeaderItem from '@zyro-inc/site-modules/components/blocks/header/BlockHeaderItem.vue';
import BlockHeaderLogo from '@zyro-inc/site-modules/components/blocks/header/BlockHeaderLogo.vue';
import {
	NAVIGATION_LOGO_SPACING_MAP,
	NAVIGATION_LOGO_MENU_POSITION_MAP,
	NAVIGATION_JUSTIFY_CONTENT_MAP,
	NAVIGATION_LOGO_IMAGE_OBJECT_POSITION_MAP,
	BLOCK_HEADER_CLASS,
	BLOCK_HEADER_STICKY_CLASS,
} from '@zyro-inc/site-modules/constants';
import { useStickyTrigger } from '@zyro-inc/site-modules/use/useStickyTrigger';
import { onClickOutside } from '@vueuse/core';
import {
	onMounted,
	ref,
	defineComponent,
} from 'vue';

export default defineComponent({
	name: 'BlockHeader',

	components: {
		ZyroHamburger,
		BlockHeaderCart,
		BlockHeaderLogo,
		BlockHeaderItem,
		BlockHeaderBackground,
		LanguageSwitcher,
	},

	props: {
		siteName: {
			type: String,
			default: null,
		},
		languageSwitcherLanguages: {
			type: Array,
			default: () => [],
		},
		items: {
			type: Array,
			default: () => [],
		},
		logoHref: {
			type: String,
			default: '/',
		},
		logoSrc: {
			type: String,
			default: null,
		},
		logoSvg: {
			type: String,
			default: null,
		},
		backgroundImageUrl: {
			type: String,
			default: null,
		},
		isOpen: {
			type: Boolean,
			default: false,
		},
		isSticky: {
			type: Boolean,
			default: false,
		},
		isTransparent: {
			type: Boolean,
			default: false,
		},
		isLogoVisible: {
			type: Boolean,
			default: false,
		},
		isCartVisible: {
			type: Boolean,
			default: false,
		},
		isLanguageSwitcherVisible: {
			type: Boolean,
			default: false,
		},
		currentLocale: {
			type: String,
			default: null,
		},
		backgroundColor: {
			type: String,
			default: '',
		},
		backgroundColorContrast: {
			type: String,
			default: '',
		},
		navLinkTextColor: {
			type: String,
			default: '',
		},
		navLinkTextColorHover: {
			type: String,
			default: '',
		},
		cartText: {
			type: String,
			default: null,
		},
		cartUrl: {
			type: String,
			default: null,
		},
		itemsInCart: {
			type: Number,
			default: 0,
		},
		logoPlacement: {
			type: String,
			default: null,
		},
		logoPlacementMobile: {
			type: String,
			default: null,
		},
		navigationPlacement: {
			type: String,
			default: null,
		},
		navigationPlacementMobile: {
			type: String,
			default: null,
		},
		areDropdownsHidden: {
			type: Boolean,
			default: false,
		},
		isLogoOptimized: {
			type: Boolean,
			default: false,
		},
		background: {
			type: Object,
			default: null,
		},
		// CSS Properties
		cartIconSize: {
			type: String,
			default: null,
		},
		logoMaxWidth: {
			type: String,
			default: null,
		},
		logoHeight: {
			type: Number,
			default: null,
		},
		logoHeightMobile: {
			type: Number,
			default: null,
		},
		logoMaxWidthMobile: {
			type: String,
			default: null,
		},
		logoObjectPosition: {
			type: String,
			default: null,
		},
		logoObjectPositionMobile: {
			type: String,
			default: null,
		},
		fontFamily: {
			type: String,
			default: null,
		},
		fontWeight: {
			type: Number,
			default: null,
		},
	},
	emits: ['toggle-visibility'],
	setup(props, context) {
		const headerRef = ref(null);

		onMounted(() => {
			onClickOutside(headerRef, () => {
				if (props.isOpen) {
					context.emit('toggle-visibility');
				}
			});
		});

		const { hasUserScrolled } = useStickyTrigger();

		return {
			hasUserScrolled,
			BLOCK_HEADER_CLASS,
			BLOCK_HEADER_STICKY_CLASS,
			headerRef,
		};
	},

	computed: {
		isWithShadow() {
			return this.hasUserScrolled && this.isSticky;
		},
		shouldForceTransparency() {
			return (this.isSticky && !this.hasUserScrolled) || !this.isSticky;
		},
		isCurrentlyTransparent() {
			return this.isTransparent && this.shouldForceTransparency && !this.isOpen;
		},
		// TODO: Rework after Layout presets iteration
		isLogoAndNavigationCentered() {
			return this.logoPlacement === 'center' && this.navigationPlacement === 'center';
		},
		isLogoAndNavigationCenteredMobile() {
			return this.logoPlacementMobile === 'center' && this.navigationPlacementMobile === 'center';
		},
		navigationGridRowCount() {
			if (this.isLogoVisible && this.isCartVisible) {
				return 3;
			}

			return 2;
		},
		computedStyles() {
			const placementKey = `${this.logoPlacement}-${this.navigationPlacement}`;
			const placementKeyMobile = `${this.logoPlacementMobile}-${this.navigationPlacementMobile}`;

			const { templateColumns } = NAVIGATION_LOGO_MENU_POSITION_MAP[placementKey];
			const templateColumnsMobile = this.isCartVisible
				? 'auto minmax(0, calc(var(--m-logo-width) + var(--space-between-menu) * 2)) 1fr'
				: NAVIGATION_LOGO_MENU_POSITION_MAP[placementKeyMobile].mTemplateColumns;

			return {
				'--navigation-grid-template-columns': this.isLogoVisible ? templateColumns : '1fr',
				'--m-navigation-grid-template-columns': this.isLogoVisible ? templateColumnsMobile : '1fr',

				'--logo-grid-row': `${NAVIGATION_LOGO_MENU_POSITION_MAP[placementKey].logoRow}/${this.navigationGridRowCount}`,
				'--m-logo-grid-row': `${NAVIGATION_LOGO_MENU_POSITION_MAP[placementKeyMobile].logoRow}/${this.navigationGridRowCount}`,

				'--logo-grid-column': NAVIGATION_LOGO_MENU_POSITION_MAP[placementKey].logoColumn,
				'--m-logo-grid-column': NAVIGATION_LOGO_MENU_POSITION_MAP[placementKeyMobile].logoColumn,

				'--logo-justify-self': this.getJustifyContent(this.logoPlacement),
				'--m-logo-justify-self': this.getJustifyContent(this.logoPlacementMobile),

				'--logo-image-object-position': this.getLogoImageObjectPosition(this.logoPlacement),
				'--m-logo-image-object-position': this.getLogoImageObjectPosition(this.logoPlacementMobile),

				'--links-grid-row': `${NAVIGATION_LOGO_MENU_POSITION_MAP[placementKey].menuRow}/${this.navigationGridRowCount}`,
				'--m-links-grid-row': `${NAVIGATION_LOGO_MENU_POSITION_MAP[placementKeyMobile].menuRow}/${this.navigationGridRowCount}`,

				'--links-grid-column': this.isLogoVisible ? NAVIGATION_LOGO_MENU_POSITION_MAP[placementKey].menuColumn : '1/2',
				'--m-links-grid-column': this.isLogoVisible ? NAVIGATION_LOGO_MENU_POSITION_MAP[placementKeyMobile].menuColumn : '1/2',

				'--cart-grid-row': `${NAVIGATION_LOGO_MENU_POSITION_MAP[placementKey].cartRow}/${this.navigationGridRowCount}`,
				'--cart-grid-column': this.isLogoVisible ? NAVIGATION_LOGO_MENU_POSITION_MAP[placementKey].cartColumn : '2/2',

				'--logo-spacing': this.getLogoMarginPlacement(),
				'--m-logo-spacing': this.getLogoMarginPlacement(true),

				'--navigation-text-align': this.navigationPlacement,
				'--m-navigation-text-align': this.navigationPlacementMobile,

				'--navigation-justify-self': this.getJustifyContent(this.navigationPlacement),
				'--m-navigation-justify-self': this.getJustifyContent(this.navigationPlacementMobile),

				'--mobile-background': 'var(--background-color,  var(--background-image))',

				'--dropdown-background-color': this.backgroundColor,
				'--m-dropdown-background-color': this.background.current === 'image' ? 'transparent' : this.backgroundColor,
				'--dropdown-background-contrast-color': this.backgroundColorContrast,

				'--text-font-family': this.fontFamily,
				'--text-font-weight': this.fontWeight,

				'--nav-link-text-color': this.navLinkTextColor || 'var(--nav-link-color)',
				'--nav-link-text-color-hover': this.navLinkTextColorHover || 'var(--nav-link-color-hover)',
			};
		},
	},

	methods: {
		getJustifyContent(align) {
			return NAVIGATION_JUSTIFY_CONTENT_MAP[align] || NAVIGATION_JUSTIFY_CONTENT_MAP.default;
		},
		getLogoImageObjectPosition(align) {
			return NAVIGATION_LOGO_IMAGE_OBJECT_POSITION_MAP[align] || NAVIGATION_LOGO_IMAGE_OBJECT_POSITION_MAP.default;
		},
		getLogoMarginPlacement(isMobile = false) {
			const isLogoAndNavigationCentered = isMobile ? this.isLogoAndNavigationCenteredMobile : this.isLogoAndNavigationCentered;
			const logoPlacement = isMobile ? this.logoPlacementMobile : this.logoPlacement;

			if (isMobile && this.isCartVisible) {
				return NAVIGATION_LOGO_SPACING_MAP.center;
			}

			if (isLogoAndNavigationCentered) {
				return NAVIGATION_LOGO_SPACING_MAP['center-center'];
			}

			return NAVIGATION_LOGO_SPACING_MAP[logoPlacement];
		},
	},
});
</script>

<style lang="scss" scoped>
/* stylelint-disable no-descending-specificity */
@import "@zyro-inc/site-modules/scss/mixins/site-engine-mobile";

$sub-item-indentation: 16px;

@mixin transition-slide-down {
	transition-timing-function: cubic-bezier(0.45, 0, 0.1, 1);
	transition-duration: 0.2s;
	transition-property: opacity, transform;
}

.mouse-disabled {
	pointer-events: none;
}

.block-header {
	position: relative;
	z-index: $z-index-site-engine-header;
	display: grid;
	grid-area: 1 / 1 / -1 / -1;
	grid-template-rows: 100%;
	grid-template-columns: 100%;
	width: 100%;
	transition: box-shadow 0.15s linear;

	&--is-sticky {
		position: sticky;
		top: 0;

		@include site-engine-mobile {
			top: 0;
		}
	}

	&--with-shadow {
		box-shadow: $box-shadow;
	}

	&__content {
		z-index: $z-index-site-engine-header;
		display: grid;
		grid-area: 1 / 1 / -1 / -1;
		grid-template-columns: var(--navigation-grid-template-columns);
		align-items: center;
		width: 100%;
		max-width: var(--width, 1200px);
		padding: var(--padding, 24px 0);
		margin: 0 auto;
	}

	&__logo {
		display: inline-flex;
		grid-row: var(--logo-grid-row);
		grid-column: var(--logo-grid-column);
		align-self: center;
		justify-self: var(--logo-justify-self);
		margin: var(--logo-spacing);
	}

	&__nav {
		grid-row: var(--links-grid-row);
		grid-column: var(--links-grid-column);
		justify-self: var(--navigation-justify-self);
		height: 100%;
		margin-left: calc(-1 * var(--menu-item-spacing));
	}

	&__links {
		display: inline-flex;
		flex-flow: row wrap;
		row-gap: 16px;
		align-items: center;
		height: 100%;
		text-align: var(--navigation-text-align);
		list-style: none;
	}

	&__cart {
		display: inline-flex;
		grid-row: var(--cart-grid-row);
		grid-column: var(--cart-grid-column);
		align-self: center;
		justify-content: flex-end;
		width: 100%;
		height: 100%;
		background: transparent;
	}

	&__burger {
		display: none;
		grid-row: var(--links-grid-row);
		grid-column: var(--links-grid-column);
		justify-self: var(--navigation-justify-self);
		text-align: var(--navigation-text-align);
	}
}

@include site-engine-mobile {
	.block-header {
		&__content {
			position: relative;
			grid-template-columns: var(--m-navigation-grid-template-columns);
			padding: var(--m-padding, var(--padding));
		}

		&__burger {
			display: block;
			grid-row: var(--m-links-grid-row);
			grid-column: var(--m-links-grid-column);
			justify-self: var(--m-navigation-justify-self);
			text-align: var(--m-navigation-text-align);

			&--m-with-cart {
				grid-row: 1/3;
				grid-column: 1/3;
				justify-self: flex-start;
			}
		}

		&__cart {
			margin: 0;
		}

		&__logo {
			grid-row: var(--m-logo-grid-row);
			grid-column: var(--m-logo-grid-column);
			justify-self: var(--m-logo-justify-self);
			margin: var(--m-logo-spacing);

			&--m-with-cart {
				grid-row: 1/3;
				grid-column: 2/3;
				justify-self: flex-start;
			}
		}

		&__nav {
			grid-row: unset;
			grid-column: unset;
		}

		&__links {
			$default-item-spacing: 16px;

			position: absolute;
			top: 100%;
			right: 0;
			left: 0;
			display: grid;
			grid-gap: var(--m-menu-item-spacing, $default-item-spacing) 0;
			justify-self: var(--m-navigation-justify-self);
			width: auto;
			height: 0;
			max-height: 450px;
			padding:
				var(--m-menu-item-spacing, $default-item-spacing)
				var(--padding-left) var(--m-menu-item-spacing, $default-item-spacing)
				var(--padding-right);
			margin: 0;
			overflow-y: auto;
			text-align: var(--m-navigation-text-align);
			pointer-events: none;
			background:
				linear-gradient(
					rgba($color-dark, var(--background-overlay-opacity, 0)),
					rgba($color-dark, var(--background-overlay-opacity, 0))
				),
				var(--mobile-background) no-repeat top;
			background-size: cover;
			box-shadow: 0 6px 14px -14px rgb(0 0 0 / 10%);
			opacity: 0;
			transform: translate(0, -1em);

			@include transition-slide-down;

			&--open {
				height: auto;
				pointer-events: auto;
				opacity: 1;
				transform: translate(0, 0);

				@include transition-slide-down;
			}
		}

		:deep() {
			.block-header {
				&__links {
					.item-content-wrapper {
						display: grid;
					}

					&.block-header {
						&__links--align-right {
							.block-header-item {
								&__dropdown {
									align-items: flex-end;
									padding-right: calc(var(--padding-right) + #{$sub-item-indentation});
								}
							}

							.item-content-wrapper {
								grid-template-columns: 1fr auto;

								& > .item-content {
									grid-column: 3/4;

									&__icon-container-wrapper {
										grid-row: 1;
										grid-column: 2/3;
										margin-right: 8px;
										margin-left: 0;
									}
								}
							}

							.language-switcher {
								& > .language-switcher {
									&__button {
										justify-content: flex-end;
									}

									&__dropdown-area {
										& > .language-switcher {
											&__dropdown {
												& > .language-switcher {
													&__dropdown-link {
														justify-content: flex-end;
													}
												}
											}
										}
									}
								}
							}
						}

						&__links--align-left {
							.block-header-item {
								&__dropdown {
									align-items: flex-start;
									padding-left: calc(var(--padding-right) + #{$sub-item-indentation});
								}
							}

							.item-content-wrapper {
								grid-template-columns: auto 1fr auto;

								& > .item-content {
									grid-column: 1/2;

									&__icon-container-wrapper {
										grid-column: 2/3;
										align-self: start;
									}
								}
							}

							.language-switcher {
								& > .language-switcher {
									&__button {
										justify-content: flex-start;
									}

									&__dropdown-area {
										& > .language-switcher {
											&__dropdown {
												& > .language-switcher {
													&__dropdown-link {
														justify-content: flex-start;
													}
												}
											}
										}
									}
								}
							}
						}

						&__links--align-center {
							.block-header-item {
								&__dropdown {
									align-items: center;
								}
							}

							.item-content-wrapper {
								grid-template-columns: 1fr auto 1fr;

								& > .item-content {
									grid-column: 2/3;

									&__icon-container-wrapper {
										grid-column: 3/4;
									}
								}
							}

							.language-switcher {
								& > .language-switcher {
									&__button {
										justify-content: center;
										margin-left: 30px;
									}

									&__dropdown-area {
										& > .language-switcher {
											&__dropdown {
												& > .language-switcher {
													&__dropdown-link {
														justify-content: center;
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}

			:deep(.item-content-wrapper) {
				display: grid;
			}
		}
	}
}
</style>
