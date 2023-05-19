<template>
	<div>
		<Fonts
			v-if="!isDemoMode"
			:font-type="currentFontType"
			:label="$t('common.font')"
			@font-change="setDefaultTypographyStyles($event)"
		/>
		<i18n-t
			v-if="!isHostingerBrand && !isDemoMode"
			tag="p"
			class="typography__preview-tip z-body-small"
			keypath="builder.userStyles.typography.previewTips"
		>
			<a
				href="https://fonts.google.com"
				target="_blank"
				rel="noopener noreferrer"
				v-text="$t('builder.userStyles.typography.previewTipLink')"
			/>

			<a
				href="https://support.zyro.com/en/articles/5496449-why-does-my-font-display-inconsistent-characters-on-my-website"
				target="_blank"
				v-text="$t('builder.userStyles.typography.previewTipLinkFont')"
			/>
		</i18n-t>
		<ZyroCollapse
			v-for="({ title, previewElement, previewClass }, typographyName) in typographyCategoryElements"
			:key="typographyName"
			size="x-large"
			has-seperator
			class="typography__collapse"
			:is-open="selectedTypographyElement === typographyName"
			@toggle="toggleElementEdit(typographyName)"
		>
			<template #trigger>
				<h2 class="z-body-small z-body-small--strong">
					{{ title }}
				</h2>
			</template>
			<div>
				<TypographyControls
					:element="typographyName"
					:font-type="currentFontType"
					class="typography__controls"
				/>
				<TextBoxPreview
					:element="previewElement"
					:preview-class="previewClass"
				/>
			</div>
		</ZyroCollapse>
	</div>
</template>

<script>
import { defineComponent } from 'vue';
import {
	mapActions,
	mapGetters,
	mapMutations,
	mapState,
} from 'vuex';
import { useI18n } from 'vue-i18n';

import ZyroCollapse from '@/components/global/ZyroCollapse.vue';

import {
	PROPERTY_FONT_PRIMARY,
	TYPOGRAPHY_BODY,
	TYPOGRAPHY_BODY_LARGE,
	TYPOGRAPHY_BODY_SMALL,
	TYPOGRAPHY_H1,
	TYPOGRAPHY_H2,
	TYPOGRAPHY_H3,
	TYPOGRAPHY_H6,
	TYPOGRAPHY_H4,
	TYPOGRAPHY_H5,
	PROPERTY_FONT_FAMILY,
	TYPOGRAPHY_NAV_LINK,
} from '@zyro-inc/site-modules/constants/globalStyles';
import {
	extractFontName,
	transformFontTypeToVariable,
} from '@zyro-inc/site-modules/utils/font';

import Fonts from '@/components/builder-drawers/drawers/partials/globalStylesDrawer/typography/Fonts.vue';
import {
	TYPOGRAPHY_DEFAULT_STYLES_TEXT,
	DRAWER_USER_STYLES,
} from '@/constants';
import TypographyControls
	from '@/components/builder-drawers/drawers/partials/stylesDrawer/typograpghy/controls/TypographyControls.vue';
import { useTypographyStylesLibrary } from '@/components/builder-drawers/drawers/partials/stylesDrawer/typograpghy/use/useTypographyStylesLibrary';
import TextBoxPreview from '@/components/builder-drawers/drawers/partials/stylesMisc/TextBoxPreview.vue';
import {
	CHANGE_DRAWER_OPTIONS,
	mapActionsGui,
} from '@/store/builder/gui';
import { isHostingerBrand } from '@/utils/isHostingerBrand';

export default defineComponent({
	components: {
		ZyroCollapse,
		Fonts,
		TextBoxPreview,
		TypographyControls,
	},

	setup() {
		const { currentTypographyStyleLibrary } = useTypographyStylesLibrary();
		const { t } = useI18n();

		const headings = {
			[TYPOGRAPHY_H1]: {
				title: `${t('common.heading')} 1`,
				previewElement: TYPOGRAPHY_H1,
			},
			[TYPOGRAPHY_H2]: {
				title: `${t('common.heading')} 2`,
				previewElement: TYPOGRAPHY_H2,
			},
			[TYPOGRAPHY_H3]: {
				title: `${t('common.heading')} 3`,
				previewElement: TYPOGRAPHY_H3,
			},
			[TYPOGRAPHY_H4]: {
				title: `${t('common.heading')} 4`,
				previewElement: TYPOGRAPHY_H4,
			},
			[TYPOGRAPHY_H5]: {
				title: `${t('common.heading')} 5`,
				previewElement: TYPOGRAPHY_H5,
			},
			[TYPOGRAPHY_H6]: {
				title: `${t('common.heading')} 6`,
				previewElement: TYPOGRAPHY_H6,
			},
		};

		const paragraphsAndLinks = {
			[TYPOGRAPHY_BODY_LARGE]: {
				title: `${t('common.paragraph')} 1`,
				previewElement: 'p',
				previewClass: TYPOGRAPHY_BODY_LARGE,
			},
			[TYPOGRAPHY_BODY]: {
				title: `${t('common.paragraph')} 2`,
				previewElement: 'p',
				previewClass: TYPOGRAPHY_BODY,
			},
			[TYPOGRAPHY_BODY_SMALL]: {
				title: `${t('common.paragraph')} 3`,
				previewElement: 'p',
				previewClass: TYPOGRAPHY_BODY_SMALL,
			},
			[TYPOGRAPHY_NAV_LINK]: {
				title: `${t('common.navigationLinks')}`,
				previewElement: 'a',
				previewClass: TYPOGRAPHY_NAV_LINK,
			},
		};

		return {
			isHostingerBrand,
			currentTypographyStyleLibrary,
			headings,
			paragraphsAndLinks,
			DRAWER_USER_STYLES,
		};
	},

	data() {
		return {
			currentFont: '',
		};
	},

	computed: {
		...mapState(['isDemoMode']),
		...mapGetters('fonts', ['getFontNames']),
		...mapState('gui', ['drawerPage']),
		userStyleDrawer() {
			return this.drawerPage[DRAWER_USER_STYLES];
		},
		currentFontType() {
			return this.userStyleDrawer.fontType;
		},
		currentFontByType() {
			return this.getFontNames[this.currentFontType];
		},
		selectedTypographyElement() {
			return this.userStyleDrawer.options.currentTypographyType;
		},
		typographyCategoryElements() {
			return this.currentFontType === PROPERTY_FONT_PRIMARY ? this.headings : this.paragraphsAndLinks;
		},
	},

	mounted() {
		this.setDefaultFontTypes();
		this.currentFont = this.currentFontByType;
	},

	methods: {
		...mapActionsGui({
			changeDrawerOptions: CHANGE_DRAWER_OPTIONS,
		}),
		...mapMutations([
			'setStyleProperties',
			'setStyleProperty',
		]),
		...mapActions(['updateBlockData']),
		setDefaultTypographyStyles() {
			const currentTypographyLibraryFont = this.currentTypographyStyleLibrary.textElementData.font[this.currentFontType];

			this.updateBlockData({
				blockId: 'header',
				blockData: {
					fontFamily: null,
					fontWeight: null,
				},
				merge: true,
			});

			if (this.currentFont === extractFontName(currentTypographyLibraryFont)) {
				Object.keys(this.typographyCategoryElements).forEach((element) => {
					this.setStyleProperties({
						element,
						value: TYPOGRAPHY_DEFAULT_STYLES_TEXT[element],
					});
				});

				this.currentFont = this.currentFontByType;
			}
		},
		setDefaultFontTypes() {
			Object.keys(this.typographyCategoryElements).forEach((element) => {
				this.setStyleProperty({
					element,
					property: PROPERTY_FONT_FAMILY,
					value: transformFontTypeToVariable(this.drawerPage[DRAWER_USER_STYLES].fontType),
				});
			});
		},
		toggleElementEdit(element) {
			this.changeDrawerOptions({
				drawerKey: DRAWER_USER_STYLES,
				options: {
					currentTypographyType: element,
				},
			});
		},
	},
});
</script>

<style lang="scss" scoped>
.typography {
	&__preview-tip {
		margin-bottom: 16px;
		color: $color-gray;
	}

	&__collapse {
		border-bottom: 1px solid $color-gray-border;
	}

	&__controls {
		margin-bottom: 16px;
	}
}
</style>
