<template>
	<div
		v-if="!isAppPrerendering && !hasUserConsentedCookieBanner"
		class="cookie-banner"
	>
		<div class="cookie-banner__frame">
			<p class="cookie-banner__text">
				{{ disclaimer }}
			</p>
			<div class="cookie-banner__controls">
				<button
					class="control-button primary"
					@click="acceptCookies"
				>
					{{ acceptText }}
				</button>
				<button
					class="control-button"
					@click="declineCookies"
				>
					{{ declineText }}
				</button>
			</div>
		</div>
	</div>
</template>

<script>
import { defineComponent } from 'vue';
import { useCookieBanner } from '@/utils/useCookieBanner';
import { isAppPrerendering } from '@zyro-inc/site-modules/utils/prerenderingFlags';

export default defineComponent({
	props: {
		disclaimer: {
			type: String,
			required: true,
		},
		acceptText: {
			type: String,
			default: 'Accept',
		},
		declineText: {
			type: String,
			default: 'Decline',
		},
		siteMeta: {
			type: Object,
			required: true,
		},
	},

	setup(props) {
		const {
			acceptCookies,
			declineCookies,
			hasUserAcceptedCookies,
			hasUserConsentedCookieBanner,
		} = useCookieBanner(props.siteMeta);

		return {
			isAppPrerendering,
			hasUserConsentedCookieBanner,
			acceptCookies,
			declineCookies,
			hasUserAcceptedCookies,
		};
	},
});
</script>

<style lang="scss">
.cookie-banner {
	position: fixed;
	right: 0;
	bottom: 0;
	left: 0;
	z-index: $z-index-site-engine-cookies;
	background-color: $color-light;
	border-top: 1px solid $color-gray-light;

	&__frame {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		justify-content: space-between;
		width: 100%;
		padding: 22px 24px;
		margin: auto;

		@media screen and (max-width: $media-mobile) {
			flex-direction: column;
			gap: 16px;
		}

		.cookie-banner {
			&__controls {
				display: flex;
				gap: 16px;
				margin: auto 0;

				.control-button {
					padding: 8px 16px;
					font-family: Arial, sans-serif;
					text-decoration: underline;
					border-radius: 4px;

					&.primary {
						color: $color-light;
						text-decoration: none;
						background: $color-dark;
					}

					&:hover {
						cursor: pointer;
						opacity: 0.8;
					}
				}
			}
		}
	}

	&__text {
		padding-right: 16px;
		font-family: Arial, Helvetica, sans-serif;
		font-size: 14px;
		font-style: normal;
		font-weight: 400;
		line-height: 20px;
		text-align: left;
		letter-spacing: 0.25px;
	}

	&__close {
		display: block;
		flex-basis: 20px;
		flex-shrink: 0;
		width: 20px;
		height: 20px;
		margin-left: auto;
		color: $color-gray;
		cursor: pointer;
		transition: color 0.2s;

		&:hover,
		&:focus {
			color: $color-gray;
		}
	}
}
</style>
