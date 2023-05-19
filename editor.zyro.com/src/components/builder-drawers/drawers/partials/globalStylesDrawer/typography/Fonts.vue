<template>
	<div
		v-if="!isLoadingFonts"
		class="fonts"
	>
		<div class="fonts__inputs-container">
			<div class="fonts__font-select-container">
				<ZyroLabel>
					{{ label || capitalizeFirstLetter(fontType) }}
				</ZyroLabel>

				<div class="fonts__field">
					<ZyroSelect
						v-qa="`builder-globalstyles-typography-fontselector-${fontType}`"
						:options="availableFonts"
						label-key="family"
						:model-value="selectedFontFamily"
						@update:model-value="setFont($event.family)"
					/>
				</div>
			</div>

			<div class="fonts__language-select-container">
				<ZyroDropdown
					v-model="selectedLanguage"
					:options="availableLanguages"
					class="fonts__language-select"
					button-size="large"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import {
	defineComponent,
	ref,
} from 'vue';
import {
	mapGetters,
	mapMutations,
} from 'vuex';
import { useI18n } from 'vue-i18n';

import ZyroDropdown from '@/components/global/ZyroDropdown.vue';
import ZyroLabel from '@/components/global/ZyroLabel.vue';

import {
	FONT,
	PROPERTY_FONT_WEIGHT,
	FONT_WEIGHT_ELEMENTS,
	PROPERTY_FONT_FAMILY,
	PROPERTY_FONT_PRIMARY,
} from '@zyro-inc/site-modules/constants/globalStyles';
import {
	constructFontForCSS,
	convertWeightStringToNumber,
	extractFontName,
	extractFontTypeFromVariable,
} from '@zyro-inc/site-modules/utils/font';
import { capitalizeFirstLetter } from '@zyro-inc/site-modules/utils/modifyString';

import ZyroSelect from '@/components/global/ZyroSelect.vue';
import {
	mapActionsFonts,
	mapStateFonts,
	UPDATE_FONT_STYLES,
} from '@/store/builder/fonts';
import { getClosestNumberInArray } from '@/utils/array';

export default defineComponent({

	components: {
		ZyroDropdown,
		ZyroLabel,
		ZyroSelect,
	},

	props: {
		fontType: {
			type: String,
			default: PROPERTY_FONT_PRIMARY,
		},
		label: {
			type: String,
			default: null,
		},
	},
	emits: ['font-change'],

	setup() {
		const { t } = useI18n();

		const allLanguagesOption = {
			title: t('builder.userStyles.typography.optionAllLanguages'),
			value: 'all languages',
		};

		const availableLanguages = [
			{
				...allLanguagesOption,
			},
			{
				title: t('builder.userStyles.typography.optionCyrillic'),
				value: 'cyrillic',
			},
			{
				title: t('builder.userStyles.typography.optionCyrillicExtended'),
				value: 'cyrillic-ext',
			},
			{
				title: t('builder.userStyles.typography.optionLatin'),
				value: 'latin',
			},
			{
				title: t('builder.userStyles.typography.optionLatinExtended'),
				value: 'latin-ext',
			},
		];

		const selectedLanguage = ref(allLanguagesOption);

		return {
			extractFontName,
			capitalizeFirstLetter,
			availableLanguages,
			selectedLanguage,
			allLanguagesOption,
		};
	},

	data() {
		return {
			selectedFontFamily: null,
			lastFontFamilyValue: null,
		};
	},

	computed: {
		...mapStateFonts([
			'isLoadingFonts',
			'googleFonts',
		]),
		...mapGetters('fonts', ['getAvailableFontWeights']),
		...mapGetters([
			'siteStyles',
			'siteFonts',
		]),

		availableFonts() {
			return this.googleFonts.filter((font) => {
				if (this.selectedFontFamily === font.family) {
					return false;
				}

				if (this.selectedLanguage.value === this.allLanguagesOption.value) {
					return true;
				}

				return font.subsets.includes(this.selectedLanguage.value);
			});
		},
	},

	mounted() {
		this.setInitialFontFamily();
	},

	methods: {
		...mapMutations([
			'setStyleProperty',
			'setWebsiteMeta',
		]),
		...mapActionsFonts({
			updateFontStyles: UPDATE_FONT_STYLES,
		}),
		setInitialFontFamily() {
			const currentFont = this.googleFonts.find((font) => {
				const currentFontName = extractFontName(this.siteFonts[this.fontType]);

				return font.family === currentFontName;
			});

			// Chaining is needed for playground to not break styling drop-downs
			this.selectedFontFamily = currentFont?.family;
		},
		setFont(fontNameInput) {
			const newFont = this.availableFonts.find((font) => font.family === fontNameInput);

			if (!newFont) {
				return;
			}

			this.setGlobalStyleFont(newFont.family, newFont.category, this.fontType);
			this.replaceUnavailableFontWeights(this.fontType);

			this.updateFontStyles({
				family: newFont.family,
				type: this.fontType,
			});

			this.$emit('font-change', {
				family: newFont.family,
				type: this.fontType,
			});

			this.selectedFontFamily = newFont.family;
		},
		setGlobalStyleFont(family, category, type) {
			this.setStyleProperty({
				element: FONT,
				property: type,
				value: constructFontForCSS(family, category),
			});
		},
		replaceUnavailableFontWeights(type) {
			FONT_WEIGHT_ELEMENTS.forEach((element) => {
				const styleElement = this.siteStyles[element];
				// TODO remove after a mapper is complete
				const elementFontWeight = convertWeightStringToNumber(
					styleElement[PROPERTY_FONT_WEIGHT],
				);
				const elementFontType = extractFontTypeFromVariable(
					styleElement[PROPERTY_FONT_FAMILY],
				);

				const closestFontWeight = getClosestNumberInArray(
					this.getAvailableFontWeights[type],
					elementFontWeight,
				);

				if (elementFontType === type) {
					this.setStyleProperty({
						element,
						property: PROPERTY_FONT_WEIGHT,
						value: closestFontWeight,
					});
				}
			});
		},
	},
});
</script>

<style lang="scss" scoped>
.fonts {
	margin-bottom: 16px;

	&__inputs-container {
		display: flex;
	}

	&__font-select-container {
		width: 60%;
		margin-right: 8px;
	}

	&__subset-input {
		width: 100%;
		height: 45px;
		padding: 0 16px;
		cursor: pointer;
		background: $color-gray-light;
		border: none;
		appearance: none;

		&::-webkit-calendar-picker-indicator {
			opacity: 0;
		}

		&:hover,
		&:active {
			background: $color-gray-light;
		}

		&:focus,
		&:focus-within {
			border: $color-dark 1px solid;
			outline: none;
		}
	}

	&__field {
		position: relative;
		margin-top: 8px;

		:deep(.datalist) {
			.vs__dropdown-menu {
				max-height: 350px;
			}
		}
	}

	&__language-select-container {
		display: flex;
		align-items: flex-end;
		width: 40%;
	}

	&__language-select {
		margin-bottom: 0;
	}
}
</style>
