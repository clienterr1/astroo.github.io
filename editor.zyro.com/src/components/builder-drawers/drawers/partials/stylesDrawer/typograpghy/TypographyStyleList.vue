<template>
	<div>
		<ZyroButton
			v-for="({ title, textElementData, textElementData: { font: { primary, secondary } } }, index) in typographyStylesList"
			:key="`${index}${title}`"
			data-qa="builder-sidemenu-globalstyles-btn-font"
			class="style-container style-container--hovered"
			:class="{ 'style-container--selected': isTypographyStyleSelected(title), }"
			@click="handleFontClick(title, textElementData, primary, secondary)"
		>
			<div class="style-container__content">
				<Edited
					:is-active="isWebsiteTypographyStylesEdited && isTypographyStyleSelected(title)"
				/>
				<div
					class="font z-h4 z-font-weight-normal"
					:style="{ fontFamily: primary }"
				>
					{{ extractFontName(primary) }}
					<p
						class="font--secondary z-body-small"
						:style="{ fontFamily: secondary }"
					>
						{{ $t('builder.userStyles.typography.paragraphText') }}
						- {{ extractFontName(secondary) }}
					</p>
				</div>
				<EditStyleSeparator
					:is-active="isTypographyStyleSelected(title)"
					:title="$t('builder.userStyles.typography.customizeTypography')"
				/>
			</div>
		</ZyroButton>
	</div>
	<NpsRateFeature
		:feature-name="$t('builder.npsRateGlobalStyles')"
		:type="NPS_TYPE_FEATURE_GLOBAL_STYLES_TEXT"
	/>
</template>

<script>
import ZyroButton from '@/components/global/ZyroButton.vue';
import {
	NPS_TYPE_FEATURE_GLOBAL_STYLES_TEXT,
	DRAWER_USER_STYLES,
	MODAL_USER_TYPOGRAPHY_RESET_ALL_CHANGES,
	USER_STYLES_SELECT_KEY_TYPOGRAPHY_CATEGORY,
} from '@/constants';

import {
	PROPERTY_FONT_PRIMARY,
	PROPERTY_FONT_SECONDARY,
} from '@zyro-inc/site-modules/constants/globalStyles';
import { extractFontName } from '@zyro-inc/site-modules/utils/font';

import EventLogApi from '@/api/EventLogApi';
import EditStyleSeparator from '@/components/builder-drawers/drawers/partials/stylesDrawer/Misc/EditStyleSeparator.vue';
import Edited from '@/components/builder-drawers/drawers/partials/stylesDrawer/Misc/Edited.vue';
import { useTypographyStylesLibrary } from '@/components/builder-drawers/drawers/partials/stylesDrawer/typograpghy/use/useTypographyStylesLibrary';
import {
	mapActionsGui,
	CHANGE_DRAWER_PAGE,
	OPEN_MODAL,
} from '@/store/builder/gui';
import NpsRateFeature from '@/components/ui/NpsRateFeature.vue';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroButton,
		Edited,
		EditStyleSeparator,
		NpsRateFeature,
	},

	setup() {
		const {
			typographyStylesList,
			updateTypographyStylesLibrary,
			updateTypographyStyleListWithWebsiteStyles,
			isWebsiteTypographyStylesEdited,
			typographyStylesId,
		} = useTypographyStylesLibrary();

		return {
			PROPERTY_FONT_PRIMARY,
			PROPERTY_FONT_SECONDARY,
			NPS_TYPE_FEATURE_GLOBAL_STYLES_TEXT,
			typographyStylesList,
			updateTypographyStylesLibrary,
			updateTypographyStyleListWithWebsiteStyles,
			isWebsiteTypographyStylesEdited,
			typographyStylesId,
			extractFontName,
		};
	},

	mounted() {
		this.updateTypographyStyleListWithWebsiteStyles();
	},

	methods: {
		...mapActionsGui({
			openModal: OPEN_MODAL,
			changeDrawerPage: CHANGE_DRAWER_PAGE,
		}),
		setFontSet(title, textElementData, primaryFont, secondaryFont) {
			if (this.isWebsiteTypographyStylesEdited) {
				this.openModal({
					name: MODAL_USER_TYPOGRAPHY_RESET_ALL_CHANGES,
					settings: {
						title,
						textElementData,
						primaryFont,
						secondaryFont,
					},
				});
			} else {
				const typographyStyleId = this.constructTypographyStyleId(primaryFont, secondaryFont);

				this.updateTypographyStylesLibrary(title, textElementData, primaryFont, secondaryFont);

				EventLogApi.logEvent({
					eventName: 'builder.styles.replace_typography',
					eventProperties: {
						typographyStyleId,
					},
				});
			}
		},
		handleFontClick(title, textElementData, primary, secondary) {
			return this.isTypographyStyleSelected(title)
				? this.goToTypographyCategorySelect()
				: this.setFontSet(title, textElementData, primary, secondary);
		},
		constructTypographyStyleId(primaryFont, secondaryFont) {
			return `${this.extractFontName(primaryFont)}, ${this.extractFontName(secondaryFont)}`;
		},
		isTypographyStyleSelected(id) {
			return this.typographyStylesId === id;
		},
		goToTypographyCategorySelect() {
			this.changeDrawerPage({
				drawerKey: DRAWER_USER_STYLES,
				pageKey: USER_STYLES_SELECT_KEY_TYPOGRAPHY_CATEGORY,
			});
		},
	},
});
</script>

<style lang="scss" scoped>
@import "@/components/builder-drawers/drawers/partials/stylesDrawer/UserStyles";

.title {
	margin: 16px 0;
}

.font {
	text-align: left;
}
</style>
