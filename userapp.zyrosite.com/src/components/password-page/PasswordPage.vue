<template>
	<main
		class="password-page"
		:class="{
			'password-page--calm': isCalmTheme,
			'password-page--popular': isPopularTheme,
		}"
	>
		<div
			v-if="isCalmTheme"
			class="password-page__background-wave-wrapper"
		>
			<div class="password-page__background-wave" />
		</div>
		<img
			v-if=" isPopularTheme"
			class="password-page__background-image"
			src="@/assets/guest-area-background-popular.png"
		>
		<form
			class="password-page__form"
			@submit.prevent="unlock"
		>
			<img
				v-if="isCalmTheme"
				class="password-page__icon-lock"
				src="@/assets/icons/lock.svg"
			>
			<h1 class="password-page__heading">
				{{ passwordPageHeading }}
			</h1>
			<label
				for="password"
				class="password-page__label"
			>
				{{ passwordPageSubheading }}
			</label>
			<input
				id="password"
				v-model="password"
				type="password"
				autocomplete="off"
				autocapitalize="off"
				autocorrect="off"
				name="password"
				:placeholder="passwordPlaceholder"
				required
				class="password-page__input"
				:class="{ 'password-page__input--error': errorMessage }"
				@blur="errorMessage = ''"
			>
			<p
				v-if="errorMessage"
				class="password-page__error-message"
			>
				{{ errorMessage }}
			</p>
			<button
				class="password-page__button"
				type="submit"
			>
				{{ passwordPageButtonText }}
			</button>
			<p
				v-if="isHomepageLinkShown"
				class="password-page__homepage-link"
			>
				{{ passwordBackText }}
				<a
					:href="homepageLink"
					class="password-page__homepage-link-text"
				>
					{{ homepageName }}
				</a>
			</p>
		</form>
	</main>
</template>
<script>
import {
	ref,
	computed,
	defineComponent,
	onMounted,
	onBeforeUnmount,
} from 'vue';
import { usePasswordProtection } from '@/utils/usePasswordProtection';
import { generateSha256 } from '@zyro-inc/site-modules/utils/hashPassword';
import {
	PAGE_PASSWORD_DESIGN_TYPE_CALM,
	PAGE_PASSWORD_DESIGN_TYPE_POPULAR,
} from '@zyro-inc/site-modules/constants/index';

export default defineComponent({
	props: {
		pageId: {
			type: String,
			required: true,
		},
		locale: {
			type: String,
			required: true,
		},
		currentPageData: {
			type: Object,
			required: true,
		},
		isCurrentPageHomepage: {
			type: Boolean,
			default: false,
		},
		inPreviewMode: {
			type: Boolean,
			default: false,
		},
		defaultLocale: {
			type: String,
			required: true,
		},
		homepageName: {
			type: String,
			required: true,
		},

	},
	setup(props) {
		const password = ref('');
		const errorMessage = ref('');

		const passwordPageStyle = computed(() => props.currentPageData?.meta?.passwordDesign ?? '');
		const currentPagePassword = computed(() => props.currentPageData?.meta?.password ?? '');
		const passwordPageHeading = computed(() => props.currentPageData?.meta?.passwordHeadingText ?? 'Guest Area');
		const passwordPageSubheading = computed(() => props.currentPageData?.meta?.passwordSubheadingText ?? 'Please enter the password to access the page');
		const passwordPageButtonText = computed(() => props.currentPageData?.meta?.passwordButtonText ?? 'Enter');
		const passwordPlaceholder = computed(() => props.currentPageData?.meta?.passwordPlaceholderText ?? 'Type password');
		const passwordBackText = computed(() => props.currentPageData?.meta?.passwordBackText ?? 'Back to');

		const isCalmTheme = computed(() => passwordPageStyle.value === PAGE_PASSWORD_DESIGN_TYPE_CALM);
		const isPopularTheme = computed(() => passwordPageStyle.value === PAGE_PASSWORD_DESIGN_TYPE_POPULAR);

		const { openUnlockedPage } = usePasswordProtection({
			pagePassword: currentPagePassword.value,
			locale: props.locale,
			pageId: props.pageId,
		});

		const unlock = async () => {
			const hashedPassword = await generateSha256(password.value);

			if (!password.value || hashedPassword !== currentPagePassword.value) {
				errorMessage.value = 'Please enter the correct password';

				return;
			}

			openUnlockedPage();
		};

		const homepageLink = computed(() => (props.locale && props.locale !== props.defaultLocale ? `/${props.locale}` : '/'));

		const isHomepageLinkShown = computed(() => !props.inPreviewMode && !props.isCurrentPageHomepage);

		onMounted(() => {
			document.body.style.overflow = 'hidden';
		});

		onBeforeUnmount(() => {
			document.body.style.overflow = '';
		});

		return {
			passwordPageHeading,
			passwordPageSubheading,
			passwordPlaceholder,
			passwordPageButtonText,
			isHomepageLinkShown,
			passwordBackText,
			homepageLink,
			isCalmTheme,
			isPopularTheme,
			errorMessage,
			password,
			unlock,
		};
	},
});
</script>
<style lang="scss" scoped>
.password-page {
	$this: &;

	position: relative;
	display: flex;
	flex-direction: column;
	width: 100%;
	overflow-y: auto;
	overflow-x: hidden;
	height: 100vh;
	font-family: "DM Sans", sans-serif;
	background-color: $color-light;

	&__heading {
		margin-bottom: 16px;
		font-size: 36px;
		font-weight: 700;
		line-height: 40px;
		text-align: center;
	}

	&__label {
		padding-bottom: 64px;
		font-size: 16px;
		font-weight: 400;
		line-height: 24px;
		text-align: center;
	}

	&__form {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		max-width: 341px;
		margin: auto;
	}

	&__input {
		width: 100%;
		padding: 16px;
		margin-bottom: 16px;
		font-size: 16px;
		font-weight: 400;
		line-height: 24px;
		color: $color-dark;
		background-color: $color-light;
		border: 1px solid $color-gray-border;
		border-radius: 4px;

		&--error {
			margin-bottom: 0;
			border-color: $color-danger-dark;
		}

		&:hover {
			border-color: $color-dark;

			&--error {
				border-color: $color-danger-dark;
			}
		}
	}

	&__error-message {
		width: 100%;
		margin-bottom: 16px;
		font-size: 12px;
		font-weight: 400;
		line-height: 20px;
		color: $color-danger-dark;
	}

	&__button {
		width: 100%;
		padding: 16px;
		font-size: 16px;
		font-weight: 700;
		line-height: 24px;
		color: $color-light;
		cursor: pointer;
		background-color: $color-dark;
		border: none;

		&:hover {
			background-color: $color-dark;
		}

		&:focus {
			background-color: $color-dark;
			border: 2px solid $color-azure;
		}
	}

	&__icon-lock {
		width: 40px;
		height: 40px;
		margin-bottom: 32px;
		color: $color-gray-dark;
	}

	&__background-wave-wrapper {
		height: 100vh;
		position: absolute;
		overflow: hidden;
		width: 100%;
	}

	&__background-wave,
	&__background-wave::before,
	&__background-wave::after {
		position: absolute;
		top: 50%;
		left: 50%;
		z-index: 0;
		width: 250vw;
		height: 250vw;
		margin-left: -125vw;
		background-color: transparent;
		border-radius: 38% 42%;
		box-shadow: inset 0 0 10vw rgba(219, 219, 211, 80%);
		mix-blend-mode: multiply;
		transform-origin: 50% 50%;
		animation: spin 30s infinite linear;
	}

	&__background-wave::before {
		width: 105%;
		height: 95%;
		margin-top: -100vw;
		content: "";
		border-radius: 40% 38%;
		box-shadow: inset 0 0 10vw rgba(219, 219, 211, 80%);
		transform-origin: 49% 51%;
		animation: spin 23s infinite linear;
	}

	&__background-wave::after {
		width: 102%;
		height: 98%;
		margin-top: -150vw;
		content: "";
		border-radius: 48% 42%;
		box-shadow: inset 0 0 10vw rgba(219, 219, 211, 80%);
		transform-origin: 51% 49%;
		animation: spin 25s infinite linear;
	}

	&__background-image {
		width: 50vw;
		object-fit: cover;
		position: fixed;
		height: 100%;

		@media screen and (max-width: $media-mobile) {
			display: none;
		}
	}

	&__homepage-link {
		position: fixed;
		bottom: 40px;
	}

	&__homepage-link-text {
		color: $color-azure;
	}

	&--calm {
		background: $color-warning-light;

		#{$this}__form {
			z-index: 1;
			width: 720px;
			max-width: 720px;
			padding: 60px 200px 100px;
			background: white;
			border-radius: 20px;

			@media screen and (max-width: $media-mobile) {
				width: auto;
				max-width: 320px;
				padding: 40px 40px 80px;
			}
		}

		#{$this}__input {
			margin-bottom: 36px;
			border: none;
			border-bottom: 1px solid $color-gray-border;
			border-radius: 0;

			&::placeholder {
				color: $color-gray-light;
			}

			&--error {
				margin-bottom: 0;
				border-color: $color-danger-dark;
			}
		}

		#{$this}__button {
			border-radius: 100px;
		}
	}

	&--popular {
		flex-direction: row;
		margin: 0;

		@media screen and (max-width: $media-mobile) {
			flex-direction: column;
			width: 100%;
			background: $color-primary;
		}

		#{$this}__form {
			margin: auto 0 auto auto;
			min-width: 50%;
			padding: 60px 125px 100px;
			background: white;

			@media screen and (max-width: $media-mobile) {
				width: auto;
				max-width: 320px;
				padding: 60px 40px 100px;
				border-radius: 16px;
				margin: auto;
			}
		}

		#{$this}__input {
			margin-bottom: 36px;
			border: none;
			border-bottom: 1px solid $color-gray-border;
			border-radius: 0;

			&--error {
				margin-bottom: 0;
				border-color: $color-danger-dark;
			}
		}

		#{$this}__button {
			background: $color-meteorite-dark;
			border-radius: 8px;

			&:hover {
				background: $color-gray-dark;
			}
		}
	}
}

@keyframes spin {
	100% { transform: rotate(360deg); }
}
</style>
