<template>
	<div>
		<nav
			class="navigation"
			:class="{ 'navigation--open' : isMenuOpen }"
			@click="$emit('close')"
		>
			<ul>
				<li
					v-for="navigationLink in NAVIGATION_LINKS"
					:key="`${navigationLink.qa}-section`"
				>
					<div
						v-if="navigationLink.name === EXPORT_SETTINGS_ROUTE"
						class="navigation__link__divider"
					/>
					<RouterLink
						v-qa="`sitesettings-link-${navigationLink.qa}`"
						:to="{ name: navigationLink.name }"
						replace
						class="navigation__link z-body-small"
						:class="{ 'navigation__link--active': $route.name === navigationLink.name }"
						@click="logNavigationClick({ eventName: navigationLink.eventName })"
					>
						<span class="z-font-weight-bold">{{ $t(navigationLink.titlePath) }}</span>
					</RouterLink>
				</li>
			</ul>
		</nav>

		<div
			v-show="isMenuOpen"
			class="navigation__backdrop"
			@click="$emit('close')"
		/>
	</div>
</template>

<script>
import { defineComponent } from 'vue';

import {
	GENERAL_SETTINGS_ROUTE,
	INTEGRATIONS_SETTINGS_ROUTE,
	ANALYTICS_SETTINGS_ROUTE,
	FORMS_SETTINGS_ROUTE,
	EXPORT_SETTINGS_ROUTE,
	SEO_SETTINGS_ROUTE,
} from '@/constants/routes';
import EventLogApi from '@/api/EventLogApi';

export default defineComponent({
	props: {
		isMenuOpen: {
			type: Boolean,
			required: true,
		},
	},

	setup() {
		const NAVIGATION_LINKS = [
			{
				titlePath: 'siteSettings.nav.general',
				qa: 'sitesettings-link-general',
				name: GENERAL_SETTINGS_ROUTE,
				eventName: 'website_builder.website_settings_general_settings.enter',
			},
			{
				titlePath: 'siteSettings.nav.integrations',
				qa: 'sitesettings-link-integrations',
				name: INTEGRATIONS_SETTINGS_ROUTE,
				eventName: 'website_builder.website_settings_integrations.enter',
			},
			{
				titlePath: 'builder.analytics',
				qa: 'sitesettings-link-analytics',
				name: ANALYTICS_SETTINGS_ROUTE,
				eventName: 'website_builder.website_settings_analytics.enter',
			},
			{
				titlePath: 'common.seo',
				qa: 'sitesettings-link-seo',
				name: SEO_SETTINGS_ROUTE,
				eventName: 'website_builder.website_settings_seo.enter',
			},
			{
				titlePath: 'siteSettings.nav.forms',
				qa: 'sitesettings-link-forms',
				name: FORMS_SETTINGS_ROUTE,
				eventName: 'website_builder.website_settings_form_submissions.enter',
			},
			{
				titlePath: 'siteSettings.nav.export',
				qa: 'sitesettings-link-export',
				name: EXPORT_SETTINGS_ROUTE,
				eventName: 'website_builder.website_settings_export_wordpress.enter',
			},
		];

		const logNavigationClick = ({ eventName }) => {
			EventLogApi.logEvent({
				eventName,
				eventProperties: {
					location: 'settings_navigation',
				},
				isHostingerEvent: true,
			});
		};

		return {
			logNavigationClick,
			NAVIGATION_LINKS,
			EXPORT_SETTINGS_ROUTE,
		};
	},
});
</script>

<style lang="scss" scoped>
.navigation {
	position: fixed;
	width: 224px;
	height: calc(100vh - #{$header-height-editor});
	background-color: $color-light;

	@media screen and (max-width: $media-tablet) {
		top: 0;
		z-index: $z-index-site-settings-navigation-mobile;
		width: 100%;
		height: auto;
		transition: all 0.6s cubic-bezier(0.45, 0, 0.1, 1);
		transition-property: opacity, transform, background-color;
		transform: translateY(-100%);

		&--open {
			transform: translateY(0);
		}
	}

	&__backdrop {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: $z-index-site-settings-navigation-backdrop;
		width: 100%;
		height: 100%;
		background: rgba($color-dark, 0.7);
	}

	&__link {
		display: inline-block;
		width: 100%;
		padding: 20px 37px;
		text-decoration: none;
		transition: 0.2s ease-out;
		transition-property: color, background-color, border;

		@media screen and (max-width: $media-tablet) {
			padding: 20px 16px;
			border-bottom: 1px solid $color-gray-light;
		}

		&:hover,
		&:focus,
		&--active {
			color: $color-primary;
			background: $color-primary-light;
			outline: none;
		}

		&__divider {
			padding-top: 15px;
			margin: 15px 37px 0;
			border-top: 1px solid $color-gray-border;

			@media screen and (max-width: $media-tablet) {
				padding-top: 20px;
				margin: 20px 0 0;
			}
		}

		&--active {
			border-right: 2px solid $color-primary;

			@media screen and (max-width: $media-tablet) {
				border-right: none;
				border-bottom: 2px solid $color-primary;
			}
		}
	}
}
</style>
