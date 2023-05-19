<template>
	<div class="lang-switcher">
		<div
			v-for="locale in availableLocales"
			:key="locale.code"
			v-qa="`builder-header-localeslist-link-${locale.code}`"
			class="locale"
			@click="setLocale(locale.code)"
		>
			<img
				class="locale__img"
				:src="getImgSrc(locale.code)"
				:alt="`${locale.code}-flag`"
			>
			<label
				class="locale__label z-body-small"
			>
				{{ locale.region }}
				<span class="locale__text">{{ locale.language }}</span>
			</label>
		</div>
	</div>
</template>

<script>
import LOCALES from '@/i18n/locales.json';
import { setLocaleCodeToCookie } from '@/utils/i18n/cookieLocale';
import { selectLocale } from '@/api/UsersApi';
import * as Sentry from '@sentry/browser';

import { defineComponent } from 'vue';

export default defineComponent({
	computed: {
		availableLocales() {
			return LOCALES;
		},
	},

	methods: {
		async setLocale(localeCode) {
			if (this.$i18n.locale !== localeCode) {
				setLocaleCodeToCookie(localeCode);
				try {
					await selectLocale(localeCode);
				} catch (error) {
					Sentry.captureException(new Error(`Failed to select locale ${localeCode} in backend`));
				}

				window.location.reload();
			}
		},
		getImgSrc(code) {
			return new URL(`../../../assets/images/i18n/${code}.png`, import.meta.url).href;
		},
	},
});
</script>

<style lang="scss" scoped>
.lang-switcher {
	width: 222px;
	max-height: 80vh;
	padding: 10px 0;
	overflow-y: auto;
	background: $color-light;
	border-radius: $border-radius-small;
	box-shadow: $box-shadow;
}

.locale {
	display: flex;
	align-items: center;
	padding: 8px 14px;
	color: $color-dark;

	&:hover {
		cursor: pointer;
		background: $color-gray-light;
	}

	&__img {
		width: 20px;
	}

	&__label {
		padding-left: 10px;
		cursor: pointer;
	}

	&__text {
		color: $color-gray;
	}
}

</style>
