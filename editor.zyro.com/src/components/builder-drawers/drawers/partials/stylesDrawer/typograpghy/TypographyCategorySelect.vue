<template>
	<div class="category-selection">
		<div
			v-for="{ title, fontType } in typographyCategories"
			:key="title"
			v-qa="'builder-sidemenu-globalstyles-font-headings'"
			@click="goToTypographyTypeSelect(title)"
		>
			<div class="category">
				<span class="category__title z-body-small z-body-small--strong">{{ title }}</span>
				<span
					class="category__font-name z-body-small z-body-small--strong"
				>
					{{ getFontNames[fontType] }}
				</span>
				<ZyroButton class="category__icon">
					<template #icon>
						<ZyroSvgDeprecated
							name="chevron"
							dimensions="8px"
							direction="right"
						/>
					</template>
				</ZyroButton>
			</div>
			<ZyroSeparator />
		</div>
		<ZyroButton
			v-qa="'userstyles-typography-resettextstyles-openmodal-btn'"
			theme="primary"
			color="white"
			class="category-selection__restore-button"
			@click="openModal({ name: MODAL_USER_TYPOGRAPHY_STYLES_RESET })"
		>
			<template #icon-left>
				<Icon
					name="loop"
					dimensions="16px"
				/>
			</template>
			{{ $t('builder.userStyles.typography.resetBtn') }}
		</ZyroButton>
	</div>
</template>

<script>

import { defineComponent } from 'vue';
import {
	mapGetters,
	mapMutations,
} from 'vuex';
import { useI18n } from 'vue-i18n';

import Icon from '@/components/global/Icon.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroSeparator from '@/components/global/ZyroSeparator.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import {
	PROPERTY_FONT_PRIMARY,
	PROPERTY_FONT_SECONDARY,
} from '@zyro-inc/site-modules/constants/globalStyles';

import { useTypographyStylesLibrary } from '@/components/builder-drawers/drawers/partials/stylesDrawer/typograpghy/use/useTypographyStylesLibrary';
import {
	USER_STYLES_SELECT_KEY_HEADING,
	USER_STYLES_SELECT_KEY_PARAGRAPH,

	DRAWER_USER_STYLES,
	MODAL_USER_TYPOGRAPHY_STYLES_RESET,
} from '@/constants';
import {
	mapActionsGui,
	CHANGE_DRAWER_PAGE,
	OPEN_MODAL,
} from '@/store/builder/gui';

export default defineComponent({
	components: {
		Icon,
		ZyroButton,
		ZyroSeparator,
		ZyroSvgDeprecated,
	},

	setup() {
		const { t } = useI18n();
		const { currentTypographyStyleLibrary } = useTypographyStylesLibrary();

		const titleHeadings = t('builder.userStyles.typography.headings');
		const titleParagraphsAndNavLinks = t('builder.userStyles.typography.paragraphsAndNavigation');

		const typographyCategories = [
			{
				title: titleHeadings,
				fontType: PROPERTY_FONT_PRIMARY,
			},
			{
				title: titleParagraphsAndNavLinks,
				fontType: PROPERTY_FONT_SECONDARY,
			},
		];

		const PAGE_KEY_MAP = {
			[titleHeadings]: USER_STYLES_SELECT_KEY_HEADING,
			[titleParagraphsAndNavLinks]: USER_STYLES_SELECT_KEY_PARAGRAPH,
		};

		return {
			currentTypographyStyleLibrary,
			typographyCategories,
			MODAL_USER_TYPOGRAPHY_STYLES_RESET,
			PAGE_KEY_MAP,
		};
	},

	computed: {
		...mapGetters('fonts', ['getFontNames']),
	},

	methods: {
		...mapMutations(['setStyleProperties']),
		...mapActionsGui({
			openModal: OPEN_MODAL,
			changeDrawerPage: CHANGE_DRAWER_PAGE,
		}),
		goToTypographyTypeSelect(type) {
			this.changeDrawerPage({
				drawerKey: DRAWER_USER_STYLES,
				pageKey: this.PAGE_KEY_MAP[type],
			});
		},
	},
});
</script>

<style lang="scss" scoped>
@import "@/components/builder-drawers/drawers/partials/stylesDrawer/UserStyles";

.category {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 16px 36px 16px 0;
	cursor: pointer;

	&__font-name {
		color: $color-gray;
	}

	&__icon {
		position: absolute;
		right: 14px;
	}
}
</style>
