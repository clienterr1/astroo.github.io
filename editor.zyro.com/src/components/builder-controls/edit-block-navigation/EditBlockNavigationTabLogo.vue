<template>
	<div class="layout">
		<ZyroFieldToggle
			id="showLogoToggle"
			v-qa="`editblocknavigation-tablogo-showLogo-${isLogoShown}`"
			:label="$t('builder.editBlockNavigation.tabLogo.showLogo')"
			:model-value="isLogoShown"
			@update:model-value="updateIsLogoShown"
		/>
		<template v-if="isLogoShown">
			<ZyroImageSelector
				:origin="currentBlockSettings.logoImageOrigin"
				:path="currentBlockSettings.logoImagePath"
				@update="updateLogo"
			/>
			<i18n-t
				tag="p"
				class="layout__generator-subtitle z-body-small"
				keypath="builder.editBlockNavigation.tabLogo.logoGeneratorLink"
			>
				<a
					class="z-link"
					:href="logoMakerLink"
					target="_blank"
					rel="noopener"
					@click="logLogoClick"
					v-text="$t('builder.editBlockNavigation.tabLogo.logoGeneratorSlotText')"
				/>
			</i18n-t>
			<ZyroFieldRange
				:model-value="isMobileView ? logoMobileWidth : logoWidth"
				:qa="`editblocknavigation-tablogo-logowidth-${isMobileView ? logoMobileWidth : logoWidth}`"
				min="30"
				:max="maxLogoWidth"
				:label="$t('builder.editBlockNavigation.tabLogo.logoWidth')"
				@update:model-value="updateLogoWidth"
			/>
			<ZyroSeparator />
			<ZyroFieldRange
				:model-value="spaceBetweenMenu"
				:qa="`editblocknavigation-tablogo-spacebetweenmenu-${spaceBetweenMenu}`"
				min="0"
				max="64"
				:label="$t('builder.editBlockNavigation.tabLogo.itemSpacing')"
				@update:model-value="updateSpaceBetweenMenu"
			/>
			<template v-if="isLogoPositionSettingsEnabled">
				<div
					class="layout__menu-position"
				>
					<ZyroLabel class="layout__menu-position-label">
						{{ $t('builder.editBlockNavigation.tabLogo.logoPosition') }}
					</ZyroLabel>
					<ZyroIconControls
						:model-value="logoPlacement"
						class="layout__menu-position-icons"
						:icons="$options.iconsJustify"
						:toggleable="false"
						@update:model-value="updateLogoPlacement"
					/>
				</div>
			</template>
		</template>
	</div>
</template>

<script>
import ZyroFieldRange from '@/components/global/ZyroFieldRange.vue';
import ZyroFieldToggle from '@/components/global/ZyroFieldToggle.vue';
import ZyroIconControls from '@/components/global/ZyroIconControls.vue';
import ZyroImageSelector from '@/components/global/ZyroImageSelector.vue';
import ZyroLabel from '@/components/global/ZyroLabel.vue';
import ZyroSeparator from '@/components/global/ZyroSeparator.vue';
import {
	mapActions,
	useStore,
} from 'vuex';

import EventLogApi from '@/api/EventLogApi';
import { getLogoMakerUrl } from '@zyro-inc/site-modules/utils/getLogoMakerUrl';

import {
	defineComponent,
	computed,
} from 'vue';
import { useUpdateLogo } from '@/components/builder-controls/edit-block-navigation/useUpdateLogo';
import {
	ELEMENT_POSITION_KEY_MOBILE,
	ELEMENT_POSITION_KEY_DESKTOP,
} from '@zyro-inc/site-modules/constants';
import { useGamification } from '@/use/useGamification';
import { GAMIFICATION_TASK_CHANGE_LOGO } from '@/constants';

export const MAX_LOGO_WIDTH = 350;
export const MAX_LOGO_WIDTH_MOBILE = 250;

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
		ZyroFieldRange,
		ZyroFieldToggle,
		ZyroIconControls,
		ZyroImageSelector,
		ZyroLabel,
		ZyroSeparator,
	},

	iconsJustify,

	setup() {
		const {
			state,
			getters,
		} = useStore();
		const { updateLogo } = useUpdateLogo();
		const {
			completeAchievement,
			isGamificationVisible,
		} = useGamification();
		const currentBlockId = computed(() => state.currentBlockId);
		const isMobileView = computed(() => state.gui.isMobileView);
		const headerBlock = computed(() => getters.headerBlock);
		const currentBlock = computed(() => getters.currentBlock);
		const currentBlockSettings = computed(() => getters.currentBlockSettings);
		const currentBlockStyles = computed(() => getters.currentBlockStyles);
		const isLocaleWithStore = computed(() => getters['ecwid/isLocaleWithEcwid'] || getters['ecommerce/isLocaleWithEcommerceItems']);
		const isLogoPositionSettingsEnabled = computed(() => (
			!isLocaleWithStore.value || !isMobileView.value || (isMobileView.value && !headerBlock.value.settings.isCartVisible)
		));
		const changeLogoStep = state.gamification.achievements.find(({ id }) => id === GAMIFICATION_TASK_CHANGE_LOGO);

		return {
			updateLogo,
			changeLogoStep,
			completeAchievement,
			isGamificationVisible,
			MAX_LOGO_WIDTH,
			MAX_LOGO_WIDTH_MOBILE,
			isLogoPositionSettingsEnabled,
			currentBlock,
			currentBlockSettings,
			currentBlockStyles,
			isMobileView,
			headerBlock,
			currentBlockId,
		};
	},

	data() {
		return {
			align: '',
		};
	},

	computed: {
		isLogoShown() {
			return this.currentBlockSettings.showLogo;
		},
		spaceBetweenMenu() {
			return Number.parseInt(this.currentBlockStyles?.['space-between-menu'], 10);
		},
		logoMobileWidth() {
			return Number.parseInt(this.currentBlockStyles?.['m-logo-width'], 10);
		},
		logoWidth() {
			return Number.parseInt(this.currentBlockStyles?.['logo-width'], 10);
		},
		logoAspectRatio() {
			return this.currentBlock.logoAspectRatio;
		},
		logoPlacement() {
			return this.isMobileView
				? this.currentBlockSettings['m-logoPlacement'] || this.currentBlockSettings.logoPlacement
				: this.currentBlockSettings.logoPlacement;
		},
		navigationPlacement() {
			const key = this.isMobileView ? 'm-navigationPlacement' : 'navigationPlacement';

			return this.currentBlockSettings[key];
		},
		maxLogoWidth() {
			return this.isMobileView ? this.MAX_LOGO_WIDTH_MOBILE : this.MAX_LOGO_WIDTH;
		},
		logoMakerLink() {
			return getLogoMakerUrl({
				ref: 'navigation-edit',
			});
		},
	},

	methods: {
		...mapActions(['updateBlockData']),

		updateIsLogoShown(newValue) {
			if (newValue === false && this.changeLogoStep?.isCompleted === false && this.isGamificationVisible) {
				this.completeAchievement(GAMIFICATION_TASK_CHANGE_LOGO);
			}

			this.updateBlockData({
				blockId: this.currentBlockId,
				blockData: {
					settings: {
						showLogo: newValue,
					},
				},
				merge: true,
			});
		},
		logLogoClick() {
			EventLogApi.logEvent({
				eventName: 'builder.header.replace_logo',
			});
		},

		updateSpaceBetweenMenu(newValue) {
			this.updateBlockData({
				blockId: this.currentBlockId,
				blockData: {
					settings: {
						styles: {
							'space-between-menu': `${newValue}px`,
						},
					},
				},
				merge: true,
			});
		},
		updateLogoWidth(newValue) {
			const key = this.isMobileView ? 'm-logo-width' : 'logo-width';
			const elementPositionKey = this.isMobileView ? ELEMENT_POSITION_KEY_MOBILE : ELEMENT_POSITION_KEY_DESKTOP;

			if (this.logoAspectRatio) {
				const logoHeight = newValue / this.logoAspectRatio;

				this.updateBlockData({
					blockId: this.currentBlockId,

					blockData: {
						[elementPositionKey]: {
							logoHeight,
						},
						settings: {
							styles: {
								[key]: `${newValue}px`,
							},
						},
					},
					merge: true,
				});

				return;
			}

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
		updateLogoPlacement(newValue) {
			const key = this.isMobileView ? 'm-logoPlacement' : 'logoPlacement';

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
	&__menu-position-label {
		margin: 16px 0 8px;
	}

	&__menu-position-icons {
		margin: 8px 0;
	}

	&__generator-subtitle {
		margin-top: 8px;
		color: $color-gray;
	}
}
</style>
