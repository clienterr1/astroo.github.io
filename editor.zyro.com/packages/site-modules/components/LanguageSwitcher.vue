<template>
	<div
		ref="languageSwitcher"
		class="language-switcher"
		tabindex="0"
	>
		<div
			v-qa="'navigation-language-switcher'"
			class="language-switcher__button"
		>
			<Flag
				v-if="selectedLanguage.country"
				v-qa="`navigation-selected-language-${selectedLanguage.name}`"
				class="language-switcher__flag"
				:src="selectedLanguage.src"
				:alt="selectedLanguage.alt"
			/>

			<div
				v-else
				class="language-switcher__locale"
			>
				{{ selectedLanguage.locale }}
			</div>
			<svg
				class="language-switcher__icon"
				width="10"
				height="7"
				viewBox="0 0 10 7"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M5 6.5L0.669873 0.5L9.33013 0.500001L5 6.5Z"
					fill="currentColor"
				/>
			</svg>
		</div>
		<div class="language-switcher__dropdown-area">
			<ul class="language-switcher__dropdown">
				<li
					v-for="language in languageSwitcherLanguages"
					:key="language.locale"
					v-qa="`navigation-language-switcher-${language.locale}`"
					class="language-switcher__dropdown-item"
				>
					<a
						:href="language.href"
						class="language-switcher__dropdown-link"
						:class="{ '--current': language.locale === currentLocale }"
					>
						<Flag
							v-if="language.country"
							class="language-switcher__dropdown-flag"
							:src="language.src"
							:alt="language.alt"
						/>
						{{ language.name }}
					</a>
				</li>
			</ul>
		</div>
	</div>
</template>
<script>
import Flag from '@zyro-inc/site-modules/components/Flag.vue';
import { FLAG_CDN_PREFIX } from '@zyro-inc/site-modules/constants';

import { defineComponent } from 'vue';

export default defineComponent({
	name: 'LanguageSwitcher',

	components: {
		Flag,
	},

	props: {
		languages: {
			type: Array,
			required: true,
		},
		currentLocale: {
			type: String,
			default: null,
		},
	},

	computed: {
		languageSwitcherLanguages() {
			return this.languages.filter(({ isHidden }) => !isHidden).map((language) => ({
				...language,
				src: `${FLAG_CDN_PREFIX}/${language.flagPath}`,
				alt: `${language.locale} flag`,
			}));
		},
		selectedLanguage() {
			return this.languageSwitcherLanguages.find(({ locale }) => locale === this.currentLocale);
		},
	},
});
</script>

<style lang="scss">
@import "@zyro-inc/site-modules/scss/mixins/site-engine-mobile";

.language-switcher {
	$this: &;

	position: relative;
	font-family: var(--text-font-family, var(--nav-link-m-font-family, var(--nav-link-font-family)));
	font-size: var(--nav-link-font-size, var(--nav-link-m-font-size));
	font-style: var(--nav-link-m-font-style, var(--nav-link-font-style));
	font-weight: var(--nav-link-font-weight);
	line-height: var(--nav-link-line-height);
	color: var(--nav-link-m-color, var(--nav-link-text-color));

	&:hover {
		#{$this}__dropdown-area {
			height: auto;
			overflow: visible;
			visibility: visible;
		}

		#{$this}__icon {
			transform: rotate(180deg);
		}
	}

	&__button {
		display: flex;
		gap: 8px;
		align-items: center;
		margin-left: var(--menu-item-spacing);
		font-weight: 400;
	}

	&__locale {
		text-transform: uppercase;

		&:hover {
			cursor: pointer;
		}
	}

	&__icon {
		margin: 4px 7px;
		color: var(--nav-link-text-color);
		transition: transform 0.1s;
	}

	&__dropdown-area {
		position: absolute;
		right: 0;
		height: 0;
		overflow: hidden;
		visibility: hidden;
	}

	&__dropdown {
		display: flex;
		flex-direction: column;
		padding: 16px 24px;
		white-space: nowrap;
		list-style: none;
		background-color: var(--dropdown-background-color);
		border-radius: 5px;
		box-shadow: 0 2px 14px rgb(0 0 0 / 10%);
	}

	&__dropdown-link {
		display: flex;
		align-items: center;
		padding: 4px 0;
		text-decoration: none;
		cursor: pointer;
		user-select: none;
		border-radius: 5px;

		&.--current,
		&:hover {
			text-decoration: underline;
			text-underline-offset: 7px;
		}

		&:hover {
			color: var(--nav-link-text-color-hover, var(--nav-link-text-color));
		}
	}

	&__dropdown-flag {
		margin-top: 0;
		margin-right: 8px;
	}
}

@include site-engine-mobile {
	.language-switcher {
		$this: &;

		&__button {
			margin-left: 0;
		}

		&__dropdown-area {
			position: relative;
			top: 8px;
		}

		&__dropdown {
			padding: 0;
			margin-bottom: 8px;
			background-color: var(--m-dropdown-background-color);
			box-shadow: none;
		}

		&__dropdown-item {
			margin: 0 calc(-1 * var(--padding-left)) 0 calc(-1 * var(--padding-right));
			background-color: var(--m-dropdown-background-color);
		}

		&__dropdown-link {
			padding: 8px;
			text-align: inherit;
			border-radius: 0;
		}

		&:focus,
		&:active {
			#{$this}__dropdown-area {
				height: auto;
				overflow: visible;
				visibility: visible;
			}

			#{$this}__icon {
				transform: rotate(180deg);
			}
		}
	}
}
</style>
