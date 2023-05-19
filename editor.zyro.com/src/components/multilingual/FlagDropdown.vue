<template>
	<div
		ref="dropdownRef"
		v-qa="'multilanguage-flag-selectbox'"
		class="dropdown"
		:class="{ 'dropdown--empty': isEmptyDropdown }"
		@click="isDropdownOpen = !isDropdownOpen"
	>
		<Flag
			:src="currentFlag.src"
			:alt="currentFlag.alt"
		/>
		<ZyroSvgDeprecated
			name="chevron"
			:direction="isDropdownOpen ? 'up' : 'down'"
			class="dropdown__chevron"
			:class="{ 'dropdown__chevron--hidden': isEmptyDropdown }"
		/>
		<div
			v-if="isDropdownOpen"
			class="dropdown__flag-list"
		>
			<div
				v-for="flag in flags"
				:key="`${flag.name}-${flag.country}`"
				v-qa="'multilanguage-flag-option'"
				class="dropdown__flag-wrapper"
				@click.stop="setFlag(flag)"
			>
				<Flag
					:src="flag.src"
					:alt="flag.alt"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import {
	mapGetters,
	mapActions,
} from 'vuex';
import { MULTILINGUAL_SUPPORTED_LANGUAGES } from '@/data';
import { FLAG_CDN_PREFIX } from '@zyro-inc/site-modules/constants';
import Flag from '@zyro-inc/site-modules/components/Flag.vue';
import { onClickOutside } from '@vueuse/core';

import {
	defineComponent,
	ref,
} from 'vue';

export default defineComponent({
	components: {
		ZyroSvgDeprecated,
		Flag,
	},

	props: {
		language: {
			type: Object,
			required: true,
		},
	},

	setup() {
		const isDropdownOpen = ref(false);
		const dropdownRef = ref(null);

		onClickOutside(dropdownRef, () => {
			isDropdownOpen.value = false;
		});

		return {
			isDropdownOpen,
			dropdownRef,
		};
	},

	computed: {
		...mapGetters(['siteLanguages']),
		currentFlag() {
			const isEmpty = this.language.country === null;

			return isEmpty ? {
				src: '/assets/icons/empty-flag.svg',
				alt: 'empty flag',
			} : {
				src: `${FLAG_CDN_PREFIX}/${this.language.flagPath}`,
				alt: `${this.language.locale} flag`,
			};
		},
		flags() {
			const localeLanguages = MULTILINGUAL_SUPPORTED_LANGUAGES
				.filter((languageData) => languageData.locale === this.language.locale);
			const languageFlags = localeLanguages
				.filter((languageData) => !!languageData.flagPath)
				.map((languageData) => ({
					...languageData,
					src: `${FLAG_CDN_PREFIX}/${languageData.flagPath}`,
					alt: `${languageData.locale} flag`,
				}));

			// languageWithoutFlag is a placeholder for language without a flag
			const languageWithoutFlag = {
				locale: localeLanguages[0].locale,
				country: null,
				src: '/assets/icons/empty-flag.svg',
				alt: 'empty flag',
				name: localeLanguages[0].name.split(' (')[0],
			};

			return [
				languageWithoutFlag,
				...languageFlags,
			];
		},
		isEmptyDropdown() {
			// 1 because of the languageWithoutFlag
			return this.flags.length === 1;
		},
	},

	methods: {
		...mapActions(['updateLanguages']),
		setFlag(currentLanguage) {
			// By default there is system locale
			const updatedLanguagesEntries = Object.entries(this.siteLanguages).map(([locale, languageData]) => {
				if (locale === currentLanguage.locale) {
					return [
						locale,
						{
							...languageData,
							...currentLanguage,
						},
					];
				}

				return [
					locale,
					languageData,
				];
			});

			this.updateLanguages(Object.fromEntries(updatedLanguagesEntries));

			this.isDropdownOpen = false;
		},
	},
});
</script>

<style lang="scss" scoped>
.dropdown {
	$flag-height: 15px;
	$drop-down-top-gap: 4px;

	position: relative;
	display: flex;
	gap: 8px;
	align-items: center;
	width: 40px;

	&--empty {
		pointer-events: none;
	}

	&__flag-list {
		position: absolute;
		top: calc($flag-height + $drop-down-top-gap);
		left: 50%;
		z-index: 2;
		padding: 4px 0;
		background: var(--color-light);
		border-radius: 5px;
		box-shadow: $box-shadow;
		transform: translateX(-50%);
	}

	&__flag-wrapper {
		padding: 4px 8px;

		&:hover {
			background: var(--color-gray-light);
		}
	}

	&__chevron {
		color: var(--grey-700);

		&--hidden {
			opacity: 0;
		}
	}
}
</style>
