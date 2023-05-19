<template>
	<div
		ref="switcher"
		class="header-switcher"
	>
		<div
			v-qa="`dropdown-button-select-${currentLocale}`"
			class="header-switcher__trigger z-body-small"
			:class="{ 'header-switcher__trigger--interactive' : showDropDown }"
			tabindex="0"
			@click="isOpen = !isOpen"
		>
			<div class="header-switcher__label">
				{{ $t('builder.multilingualDrawerLanguage') }}
			</div>
			<div class="header-switcher__language">
				<Flag
					class="header-switcher__flag"
					:src="currentLanguageData.src"
					:alt="currentLanguageData.alt"
				/>
				<span class="header-switcher__language-title z-body-small">
					{{ currentLanguageName }}
				</span>
			</div>
		</div>
		<ZyroSvgDeprecated
			v-if="showDropDown"
			class="header-switcher__chevron"
			name="chevron"
			direction="down"
			@click="isOpen = !isOpen"
		/>

		<Popup
			v-if="isOpen && showDropDown"
			placement="bottom"
			auto-update
			:target-ref="$refs.switcher"
			@click-outside="isOpen = false"
		>
			<MultilingualList
				:show-flags="true"
				class="header-switcher__list"
				:languages="languageList"
				@language-click="handleLanguageClick"
			/>
		</Popup>
	</div>
</template>

<script>
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';
import Popup from '@/components/global/Popup.vue';

import {
	mapState,
	mapGetters,
	mapActions,
} from 'vuex';
import Flag from '@zyro-inc/site-modules/components/Flag.vue';

import MultilingualList from '@/components/multilingual/MultilingualList.vue';
import { FLAG_CDN_PREFIX } from '@zyro-inc/site-modules/constants';
import {
	ref,
	defineComponent,
} from 'vue';

export default defineComponent({
	components: {
		ZyroSvgDeprecated,
		MultilingualList,
		Flag,
		Popup,
	},

	setup() {
		const isOpen = ref(false);

		return {
			isOpen,
		};
	},

	computed: {
		...mapState(['currentLocale']),
		...mapGetters(['siteLanguagesArray']),
		currentLanguageData() {
			const languageData = this.siteLanguagesArray.find(({ locale }) => locale === this.currentLocale);

			return {
				...languageData,
				src: languageData.country ? `${FLAG_CDN_PREFIX}/${languageData.flagPath}` : '/assets/icons/empty-flag.svg',
				alt: languageData.country ? `${languageData.locale} flag` : 'empty flag',
			};
		},
		currentLanguageName() {
			return this.currentLanguageData?.name;
		},
		languageList() {
			return this.siteLanguagesArray.filter(({ locale }) => locale !== this.currentLocale);
		},
		showDropDown() {
			return this.siteLanguagesArray.length > 1;
		},
	},

	methods: {
		...mapActions(['updateCurrentLocale']),
		handleLanguageClick(language) {
			this.updateCurrentLocale(language.locale);
			this.isOpen = false;
		},
	},
});
</script>
<style lang="scss" scoped>
.header-switcher {
	$this: &;

	position: relative;
	padding: 6px 24px 6px 16px;

	@media screen and (max-width: $media-mobile) {
		padding: 6px 8px;
	}

	&__language {
		position: relative;
		display: flex;
		align-items: center;
		height: 100%;
	}

	&__trigger {
		position: relative;
		width: 100%;
		overflow: hidden;

		&--interactive {
			cursor: pointer;
		}
	}

	&__label {
		font-size: 12px;
		font-weight: 500;
		line-height: 1.33;
		color: $color-gray;
		white-space: nowrap;
	}

	&__flag {
		margin-right: 10px;
	}

	&__language-title {
		width: 88px; // size with currentlty lenghtiest language name
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	&__chevron {
		position: absolute;
		top: 24px;
		right: 16px;

		@media screen and (max-width: $media-mobile) {
			right: 8px;
		}
	}

	&__list {
		width: 100%;
		background-color: $color-light;
		box-shadow: 0 6px 14px rgb(0 0 0 / 10%);
	}
}

</style>
