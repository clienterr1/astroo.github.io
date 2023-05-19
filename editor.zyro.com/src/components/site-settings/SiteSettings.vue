<template>
	<ZyroDrawer
		v-if="isCurrentRouteSiteSetting"
		:show-close-button="false"
		width="85%"
		left="0"
		@close="redirectToBuilder"
	>
		<div :class="{ 'settings__layout--fixed' : isMenuOpen }">
			<Navigation
				:is-menu-open="isMenuOpen"
				@close="isMenuOpen = false"
			/>
			<main class="settings__page">
				<div
					class="settings__page-inner"
					:class="{ 'settings__page-inner--full-width': activeSection === 'forms' }"
				>
					<div class="settings__actions">
						<ZyroHamburger
							class="settings__hamburger"
							:is-open="isMenuOpen"
							color="var(--color-dark)"
							:title="$t('common.menu')"
							@click="isMenuOpen = !isMenuOpen"
						/>

						<ZyroButton
							data-qa="settings-drawer-close-button"
							class="settings__closeButton"
							@click="redirectToBuilder"
						>
							<template #icon>
								<Icon
									name="close"
									dimensions="26px"
								/>
							</template>
						</ZyroButton>
					</div>
					<General v-if="$route.name === GENERAL_SETTINGS_ROUTE" />
					<Integrations v-if="$route.name === INTEGRATIONS_SETTINGS_ROUTE" />
					<Analytics v-if="$route.name === ANALYTICS_SETTINGS_ROUTE" />
					<Forms v-if="$route.name === FORMS_SETTINGS_ROUTE" />
					<Export v-if="$route.name === EXPORT_SETTINGS_ROUTE" />
				</div>
			</main>
		</div>
	</ZyroDrawer>
</template>

<script>
import {
	defineComponent,
	ref,
	computed,
} from 'vue';

import {
	useRoute,
	useRouter,
} from 'vue-router';

import {
	BUILDER_ROUTE,
	SITE_SETTINGS_ROUTES,
	INTEGRATIONS_SETTINGS_ROUTE,
	GENERAL_SETTINGS_ROUTE,
	ANALYTICS_SETTINGS_ROUTE,
	FORMS_SETTINGS_ROUTE,
	EXPORT_SETTINGS_ROUTE,
} from '@/constants/routes';

import Icon from '@/components/global/Icon.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroHamburger from '@zyro-inc/site-modules/components/ZyroHamburger.vue';
import ZyroDrawer from '@/components/global/ZyroDrawer.vue';
import Navigation from '@/components/site-settings/components/Navigation.vue';
import Forms from '@/components/site-settings/pages/forms/Forms.vue';
import General from '@/components/site-settings/pages/general/General.vue';
import Analytics from '@/components/site-settings/pages/analytics/Analytics.vue';
import Integrations from '@/components/site-settings/pages/integrations/Integrations.vue';
import Export from '@/components/site-settings/pages/export/Export.vue';

export default defineComponent({
	components: {
		Icon,
		ZyroButton,
		ZyroHamburger,
		ZyroDrawer,
		Navigation,
		Forms,
		General,
		Analytics,
		Integrations,
		Export,
	},

	props: {
		activeSection: {
			type: String,
			default: 'general',
		},
	},

	setup() {
		const route = useRoute();
		const router = useRouter();

		const isCurrentRouteSiteSetting = computed(() => SITE_SETTINGS_ROUTES.includes(route.name));
		const isMenuOpen = ref(false);

		const redirectToBuilder = () => {
			router.push({
				name: BUILDER_ROUTE,
				params: {
					siteId: route.params.siteId,
				},
			});
		};

		return {
			isMenuOpen,
			isCurrentRouteSiteSetting,
			redirectToBuilder,
			SITE_SETTINGS_ROUTES,
			INTEGRATIONS_SETTINGS_ROUTE,
			GENERAL_SETTINGS_ROUTE,
			ANALYTICS_SETTINGS_ROUTE,
			FORMS_SETTINGS_ROUTE,
			EXPORT_SETTINGS_ROUTE,
		};
	},
});
</script>

<style lang="scss" scoped>
$side-margin: 78px;

.settings {
	&__layout--fixed {
		position: fixed;
		width: 100%;
	}

	&__page {
		position: relative;
		min-height: 100vh;
		padding: 34px 16px;
		margin-left: 224px;
		background: $color-gray-light;

		@media screen and (max-width: $media-tablet) {
			margin-left: 0;
		}

		@media screen and (max-width: $media-mobile) {
			padding: 24px 16px;
		}
	}

	&__page-inner {
		position: relative;
		max-width: 966px;
		margin: 0 auto;

		&--full-width {
			max-width: 97%;
		}
	}

	&__actions {
		position: absolute;
		right: 0;
		display: flex;
		align-items: center;
	}

	&__hamburger {
		margin-right: 20px;

		@media screen and (min-width: $media-tablet) {
			display: none;
		}
	}
}
</style>
