<template>
	<ZyroDrawer
		class="drawer"
		:class="{ 'loading': isLoadingUserStylesDrawer }"
	>
		<ZyroLoader v-if="isLoadingUserStylesDrawer" />
		<div
			v-else
			class="style-list"
			data-qa="builder-sidemenu-globalstyles"
		>
			<div class="drawer__title z-h5">
				<ZyroButton
					v-if="currentPage.component !== 'UserStyles'"
					v-qa="'userstyles-goback-btn'"
					@click="changePreviousDrawerPage(DRAWER_USER_STYLES)"
				>
					<template #icon>
						<ZyroSvgDeprecated
							name="arrow"
							dimensions="16px"
							direction="left"
						/>
					</template>
				</ZyroButton>
				{{ $t('builder.userStyles.drawerLabel') }}
			</div>
			<p class="drawer__subtitle">
				{{ $t('builder.userStyles.drawerSubtitle') }}
			</p>
			<p
				v-if="currentPage.subtext18nPath"
				class="z-body-small style-list__subtext"
			>
				{{ $t(currentPage.subtext18nPath) }}
			</p>

			<Component :is="currentPage.component" />
		</div>
	</ZyroDrawer>
</template>

<script>
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroDrawer from '@/components/global/ZyroDrawer.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import {
	onBeforeMount,
	defineComponent,
} from 'vue';
import { mapState } from 'vuex';

import ZyroLoader from '@zyro-inc/site-modules/components/ZyroLoader.vue';

import UserStyles from '@/components/builder-drawers/drawers/partials/stylesDrawer/UserStyles.vue';
import TypographyCategorySelect from '@/components/builder-drawers/drawers/partials/stylesDrawer/typograpghy/TypographyCategorySelect.vue';
import TypographyTypeSelect from '@/components/builder-drawers/drawers/partials/stylesDrawer/typograpghy/TypographyTypeSelect.vue';
import { useTypographyStylesLibrary } from '@/components/builder-drawers/drawers/partials/stylesDrawer/typograpghy/use/useTypographyStylesLibrary';
import { useUserStyles } from '@/components/builder-drawers/drawers/partials/stylesDrawer/use/useUserStyles';
import {
	DRAWER_PAGES,
	USER_STYLES_SELECT_KEY_TYPOGRAPHY_CATEGORY,
	DRAWER_USER_STYLES,
} from '@/constants';
import {
	UPDATE_CURRENT_FONT_STYLES,
	mapActionsFonts,
} from '@/store/builder/fonts';
import {
	mapActionsGui,
	CHANGE_PREVIOUS_DRAWER_PAGE,
} from '@/store/builder/gui';

export default defineComponent({
	components: {
		ZyroButton,
		ZyroDrawer,
		ZyroSvgDeprecated,
		ZyroLoader,
		UserStyles,
		TypographyCategorySelect,
		TypographyTypeSelect,
	},

	setup() {
		const {
			getCurrentTemplateStyles,
			hasLoadedCurrentTemplateStyles,
			currentTemplateUneditedStyles,
		} = useUserStyles();
		const { addTemplateTypographyStylesToList } = useTypographyStylesLibrary();

		onBeforeMount(async () => {
			if (!hasLoadedCurrentTemplateStyles.value) {
				await getCurrentTemplateStyles();
				addTemplateTypographyStylesToList();
			}
		});

		return {
			addTemplateTypographyStylesToList,
			currentTemplateUneditedStyles,
			getCurrentTemplateStyles,
			hasLoadedCurrentTemplateStyles,
			DRAWER_PAGES,
			USER_STYLES_SELECT_KEY_TYPOGRAPHY_CATEGORY,
			DRAWER_USER_STYLES,
		};
	},

	computed: {
		...mapState('gui', ['drawerPage']),
		...mapState('fonts', ['isLoadingFonts']),
		currentPage() {
			return this.drawerPage[DRAWER_USER_STYLES];
		},
		isLoadingUserStylesDrawer() {
			return this.isLoadingFonts || !this.hasLoadedCurrentTemplateStyles;
		},
	},

	created() {
		this.updateCurrentFontStyles();
	},

	methods: {
		...mapActionsFonts({
			updateCurrentFontStyles: UPDATE_CURRENT_FONT_STYLES,
		}),
		...mapActionsGui({
			changePreviousDrawerPage: CHANGE_PREVIOUS_DRAWER_PAGE,
		}),
	},
});
</script>

<style lang="scss" scoped>
@import "@/components/builder-drawers/drawers/StylesDrawer";

.drawer {
	&__nps-rate {
		margin-top: 0;
		margin-bottom: 24px;
	}

	&__title {
		margin-bottom: 8px;
	}

	&__subtitle {
		margin-bottom: 24px;
		font-size: 14px;
		line-height: 20px;
		color: $color-gray;
		letter-spacing: 0.25px;
	}
}

.loading {
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
