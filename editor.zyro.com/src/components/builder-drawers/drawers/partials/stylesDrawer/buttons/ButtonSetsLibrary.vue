<template>
	<div>
		<ZyroButton
			v-for="(buttonSet, buttonSetId) in BUTTON_SET_LIST"
			:key="buttonSetId"
			class="style-container"
			:class="{ 'style-container--selected': isButtonSetSelected(buttonSetId) }"
			@click="selectButtonSet(buttonSetId)"
		>
			<div class="button-style__container">
				<GridButton
					v-for="(buttonStyle, buttonType) in buttonSet"
					:key="buttonType"
					:content="buttonNames[buttonType]"
					:type="buttonType"
					:style="buttonStyle"
					class="button-style__button"
					@click.prevent
				/>
			</div>
		</ZyroButton>
	</div>
	<NpsRateFeature
		:feature-name="$t('builder.npsRateGlobalStyles')"
		:type="NPS_TYPE_FEATURE_GLOBAL_STYLES_BUTTONS"
	/>
</template>

<script>
import ZyroButton from '@/components/global/ZyroButton.vue';
import { NPS_TYPE_FEATURE_GLOBAL_STYLES_BUTTONS } from '@/constants';

import GridButton from '@zyro-inc/site-modules/components/elements/button/GridButton.vue';
import { PROPERTY_BORDER_RADIUS } from '@zyro-inc/site-modules/constants/globalStyles';

import EventLogApi from '@/api/EventLogApi';
import { useButtonSetsLibrary } from '@/components/builder-drawers/drawers/partials/stylesDrawer/buttons/use/useButtonSetsLibrary';
import { BUTTON_SET_LIST } from '@/data';

import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import NpsRateFeature from '@/components/ui/NpsRateFeature.vue';

export default defineComponent({
	components: {
		ZyroButton,
		GridButton,
		NpsRateFeature,
	},

	setup() {
		const { t } = useI18n();
		const {
			setButtonSet,
			currentButtonSetId,
		} = useButtonSetsLibrary();

		const buttonNames = {
			primary: t('common.primary'),
			secondary: t('common.secondary'),
		};

		return {
			NPS_TYPE_FEATURE_GLOBAL_STYLES_BUTTONS,
			PROPERTY_BORDER_RADIUS,
			setButtonSet,
			currentButtonSetId,
			buttonNames,
			BUTTON_SET_LIST,
		};
	},

	methods: {
		selectButtonSet(buttonSetId) {
			this.setButtonSet(buttonSetId);

			EventLogApi.logEvent({
				eventName: 'builder.styles.replace_button_styles',
				eventProperties: {
					buttonSetId,
				},
			});
		},
		isButtonSetSelected(buttonSetId) {
			return buttonSetId === this.currentButtonSetId;
		},
	},
});
</script>

<style lang="scss" scoped>
@import "@/components/builder-drawers/drawers/partials/stylesDrawer/UserStyles";

.style-container {
	padding: 24px 0;
	margin-bottom: 16px;
	background-color: $color-gray-light;

	:deep(.zyro-button__text) {
		width: 100%;
	}
}

.button-style {
	&__container {
		display: flex;
		justify-content: space-evenly;
		width: 100%;
	}

	&__button {
		padding: 14px 28px;
	}
}
</style>
