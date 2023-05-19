<template>
	<ZyroDrawer
		v-qa="`help-resources-drawer`"
		class="help-resources-drawer"
	>
		<header class="help-resources-drawer__header">
			<p class="z-h5 help-resources-drawer__title">
				{{ $t('builder.helpResources.title') }}
			</p>
			<p class="z-body-small help-resources-drawer__description">
				{{ $t('builder.helpResources.info') }}
			</p>
		</header>
		<iframe
			v-if="!isHostingerBrand && !isDemoMode"
			width="100%"
			height="232"
			:src="ONBOARDING_INTRODUCTION_VIDEO_SRC"
			title="YouTube video player"
			class="help-resources-drawer__introduction-video"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
			allowfullscreen
		/>
		<StyledCollapsible
			v-qa="`help-articles-btn`"
			:is-open="isHelpArticlesCollapsibleOpen"
			icon="book"
			:has-top-border="!isHostingerBrand && !isDemoMode"
			has-bottom-border
			@toggle="toggleHelpArticles"
		>
			<template #title>
				{{ $t('builder.helpResourcesHelpArticles') }}
			</template>
			<div class="collapsible-content">
				<h3 class="collapsible-content__title z-body-small z-body-small--strong">
					{{ $t('builder.helpResources.buildWebsite') }}
				</h3>

				<HelpAndResourcesArticleLink
					:href="isHostingerBrand || isDemoMode ? 'https://support.hostinger.com/en/articles/6435707-website-builder-how-to-manage-the-navigation-menu-of-a-website'
						: 'https://support.zyro.com/en/articles/5055146-how-do-i-manage-my-website-s-menu'"
				>
					{{ $t('builder.helpResources.addNewPages') }}
				</HelpAndResourcesArticleLink>
				<HelpAndResourcesArticleLink
					:href="isHostingerBrand || isDemoMode ? 'https://support.hostinger.com/en/articles/6475040-website-builder-how-to-add-and-manage-website-sections'
						: 'https://support.zyro.com/en/articles/4959847-how-to-add-sections'"
				>
					{{ $t('builder.helpResources.addNewSections') }}
				</HelpAndResourcesArticleLink>
				<HelpAndResourcesArticleLink
					:href="isHostingerBrand || isDemoMode ? 'https://support.hostinger.com/en/articles/6435894-website-builder-how-to-add-and-customize-website-elements'
						: 'https://support.zyro.com/en/articles/5055442-what-are-website-elements'"
				>
					{{ $t('builder.helpResources.addNewElements') }}
				</HelpAndResourcesArticleLink>
				<HelpAndResourcesArticleLink
					:href="isHostingerBrand || isDemoMode ? 'https://support.hostinger.com/en/articles/6475073-website-builder-how-to-copy-and-paste-website-sections'
						: 'https://support.zyro.com/en/articles/5477868-how-to-copy-and-paste-website-sections'"
				>
					{{ $t('builder.helpResources.howToCopyPasteSections') }}
				</HelpAndResourcesArticleLink>
			</div>

			<div class="collapsible-content">
				<h3 class="collapsible-content__title z-body-small z-body-small--strong">
					{{ $t('builder.helpResources.design') }}
				</h3>

				<HelpAndResourcesArticleLink
					:href="isHostingerBrand || isDemoMode ? 'https://support.hostinger.com/en/articles/6463582-website-builder-how-to-customize-website-colors'
						: 'https://support.zyro.com/en/articles/5053039-how-do-i-customize-colors'"
				>
					{{ $t('builder.helpResources.changeColors') }}
				</HelpAndResourcesArticleLink>
				<HelpAndResourcesArticleLink
					:href="isHostingerBrand || isDemoMode ? 'https://support.hostinger.com/en/articles/6463286-website-builder-how-to-change-text-style'
						: 'https://support.zyro.com/en/articles/4318773-how-can-i-change-the-text-font'"
				>
					{{ $t('builder.helpResources.changeFonts') }}
				</HelpAndResourcesArticleLink>
				<HelpAndResourcesArticleLink
					:href="isHostingerBrand || isDemoMode ? 'https://support.hostinger.com/en/articles/6660792-website-builder-how-to-change-a-website-template'
						: 'https://support.zyro.com/en/articles/3707681-how-to-change-the-template-for-an-existing-website'"
				>
					{{ $t('builder.helpResources.switchTemplates') }}
				</HelpAndResourcesArticleLink>
			</div>

			<div class="collapsible-content">
				<h3 class="collapsible-content__title z-body-small z-body-small--strong">
					{{ $t('builder.helpResources.ecommerceTools') }}
				</h3>
				<HelpAndResourcesArticleLink
					v-if="isHostingerBrand || hasBusinessSubscription || isDemoMode"
					:href="isHostingerBrand || isDemoMode ? 'https://support.hostinger.com/en/collections/3587143-website-builder#online-store'
						: 'https://support.zyro.com/en/collections/3248516-lite-store-business-plan'"
				>
					{{ $t('builder.helpResources.addAndManageOnlineStore') }}
				</HelpAndResourcesArticleLink>
				<template v-else>
					<HelpAndResourcesArticleLink href="https://support.zyro.com/en/collections/3248516-lite-store-business-plan">
						{{ $t('builder.helpAndResourcesOnlineStoreArticleTitle') }}
					</HelpAndResourcesArticleLink>
				</template>
			</div>

			<div class="collapsible-content">
				<h3 class="collapsible-content__title z-body-small z-body-small--strong">
					{{ $t('builder.helpResources.bloggingTool') }}
				</h3>

				<HelpAndResourcesArticleLink
					:href="isHostingerBrand || isDemoMode ? 'https://support.hostinger.com/en/articles/6462842-website-builder-how-to-create-a-blog'
						: 'https://support.zyro.com/en/articles/5332536-how-to-create-a-blog'"
				>
					{{ $t('builder.helpResources.addAndManageBlog') }}
				</HelpAndResourcesArticleLink>
			</div>

			<div class="collapsible-content">
				<h3 class="collapsible-content__title z-body-small z-body-small--strong">
					{{ $t('common.seo') }}
				</h3>

				<HelpAndResourcesArticleLink
					:href="isHostingerBrand || isDemoMode ? 'https://support.hostinger.com/en/articles/6466320-website-builder-seo-settings'
						: 'https://support.zyro.com/en/articles/4393902-where-can-i-find-the-seo-tools'"
				>
					{{ $t('builder.helpResources.optimizeWebsiteForSearch') }}
				</HelpAndResourcesArticleLink>
			</div>

			<div class="collapsible-content">
				<h3 class="collapsible-content__title z-body-small z-body-small--strong">
					{{ $t('builder.helpResources.integrateApps') }}
				</h3>

				<HelpAndResourcesArticleLink
					:href="isHostingerBrand || isDemoMode ? 'https://support.hostinger.com/en/articles/6463270-website-builder-how-to-add-integrations'
						: 'https://support.zyro.com/en/collections/2290815-integrations'"
				>
					{{ $t('builder.helpResources.connectYourFavoriteApps') }}
				</HelpAndResourcesArticleLink>
			</div>

			<div class="collapsible-content">
				<h3 class="collapsible-content__title z-body-small z-body-small--strong">
					{{ $t('builder.helpResources.finaliseAndPublish') }}
				</h3>

				<HelpAndResourcesArticleLink
					:href="isHostingerBrand || isDemoMode ? 'https://support.hostinger.com/en/articles/6475658-website-builder-how-to-edit-the-mobile-version-of-a-website'
						: 'https://support.zyro.com/en/articles/4318720-can-i-edit-mobile-and-desktop-views-separately'"
				>
					{{ $t('builder.helpResources.checkMobileVersion') }}
				</HelpAndResourcesArticleLink>
				<HelpAndResourcesArticleLink
					v-if="!isHostingerBrand && !isDemoMode"
					href="https://support.zyro.com/en/articles/4237563-how-do-i-connect-a-domain-to-my-website"
				>
					{{ $t('builder.helpResources.connectCustomDomain') }}
				</HelpAndResourcesArticleLink>
			</div>
		</StyledCollapsible>
		<StyledCollapsible
			:is-open="isKeyboardShortcutsCollapsibleOpen"
			icon="command"
			has-bottom-border
			@toggle="toggleKeyboardShortcuts"
		>
			<template #title>
				{{ $t('builder.helpResourcesKeyboardShortcuts') }}
			</template>
			<div class="collapsible-content">
				<h3 class="collapsible-content__title z-body-small z-body-small--strong">
					{{ $t('builder.helpAndResourcesElements') }}
				</h3>

				<HelpAndResourcesShortcutContainer class="collapsible-content__shortcut-item">
					<template #title>
						{{ $t('builder.contextMenu.gridItem.cut') }}
					</template>
					<template #shortcut>
						⌘ + X
					</template>
				</HelpAndResourcesShortcutContainer>
				<HelpAndResourcesShortcutContainer class="collapsible-content__shortcut-item">
					<template #title>
						{{ $t('common.copy') }}
					</template>
					<template #shortcut>
						⌘ + C
					</template>
				</HelpAndResourcesShortcutContainer>
				<HelpAndResourcesShortcutContainer class="collapsible-content__shortcut-item">
					<template #title>
						{{ $t('common.duplicate') }}
					</template>
					<template #shortcut>
						⌘ + D
					</template>
				</HelpAndResourcesShortcutContainer>
				<HelpAndResourcesShortcutContainer class="collapsible-content__shortcut-item">
					<template #title>
						{{ $t('builder.contextMenu.gridItem.sendFront') }}
					</template>
					<template #shortcut>
						⌥ + ⌘ + {{ ']' }}
					</template>
				</HelpAndResourcesShortcutContainer>
				<HelpAndResourcesShortcutContainer class="collapsible-content__shortcut-item">
					<template #title>
						{{ $t('builder.contextMenu.gridItem.moveForward') }}
					</template>
					<template #shortcut>
						⌘ + {{ ']' }}
					</template>
				</HelpAndResourcesShortcutContainer>
				<HelpAndResourcesShortcutContainer class="collapsible-content__shortcut-item">
					<template #title>
						{{ $t('builder.contextMenu.gridItem.sendBack') }}
					</template>
					<template #shortcut>
						⌥ + ⌘ + {{ '[' }}
					</template>
				</HelpAndResourcesShortcutContainer>
				<HelpAndResourcesShortcutContainer class="collapsible-content__shortcut-item">
					<template #title>
						{{ $t('builder.contextMenu.gridItem.moveBackward') }}
					</template>
					<template #shortcut>
						⌘ + {{ '[' }}
					</template>
				</HelpAndResourcesShortcutContainer>
				<HelpAndResourcesShortcutContainer class="collapsible-content__shortcut-item">
					<template #title>
						{{ $t('common.delete') }}
					</template>
					<template #shortcut>
						⌫
					</template>
				</HelpAndResourcesShortcutContainer>
			</div>
		</StyledCollapsible>
		<div
			class="quick-tour-trigger"
			@click="openQuickTour"
		>
			<ZyroSvgDeprecated
				class="quick-tour-trigger__icon"
				name="corner-down-right"
			/>
			<p class="z-body-small">
				{{ $t('builder.helpAndResourcesStartQuickTour') }}
			</p>
		</div>
		<div class="help-resources-drawer__external-links">
			<div
				v-if="isConsultationServiceAvailable && !isHostingerBrand && !isDemoMode"
				class="help-resources-drawer__consultation-link"
			>
				<a
					v-qa="`helpandresourcesdrawer-bookconsultation`"
					class="z-body-small help-resources-drawer__external-link"
					target="_blank"
					:href="purchaseConsultationLink"
				>
					{{ $t('builder.consultationServiceTitle') }}
				</a>
				<ZyroPill
					theme="secondary"
					class="consultation-article__pill"
					:text="$t('common.new')"
				/>
			</div>
			<a
				v-if="!isHostingerBrand && !isDemoMode"
				v-qa="`helpandresourcesdrawer-referafriend`"
				class="z-body-small help-resources-drawer__external-link"
				target="_blank"
				:href="referAFriendLink"
			>
				{{ $t('builder.referAFriend', [REFERRAL_PROGRAM_PRICE]) }}
			</a>
		</div>
	</ZyroDrawer>
</template>

<script>
import ZyroDrawer from '@/components/global/ZyroDrawer.vue';
import ZyroPill from '@/components/global/ZyroPill.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import {
	DRAWER_HELP_AND_RESOURCES,
	ONBOARDING_INTRODUCTION_VIDEO_SRC,
	ONBOARDING_STEPS_SHORT_TOUR,
	WWW_REDIRECT_PATHS,
	REFERRAL_PROGRAM_PRICE,
} from '@/constants';
import {
	mapState,
	mapGetters,
} from 'vuex';

import {
	mapActionsGui,
	CLOSE_DRAWER,
	OPEN_DRAWER,
} from '@/store/builder/gui';
import EventLogApi from '@/api/EventLogApi';
import { isHostingerBrand } from '@/utils/isHostingerBrand';
import { getRedirectUrlToDashboard } from '@/use/useRedirects';
import StyledCollapsible from '@/components/ui/StyledCollapsible.vue';
import HelpAndResourcesArticleLink from '@/components/HelpAndResourcesArticleLink.vue';
import HelpAndResourcesShortcutContainer from '@/components/HelpAndResourcesShortcutContainer.vue';
import { useOnboarding } from '@/components/onboarding/useOnboarding';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroDrawer,
		ZyroPill,
		ZyroSvgDeprecated,
		StyledCollapsible,
		HelpAndResourcesArticleLink,
		HelpAndResourcesShortcutContainer,
	},

	setup() {
		const { startOnboarding } = useOnboarding();
		const purchaseConsultationLink = getRedirectUrlToDashboard({
			path: WWW_REDIRECT_PATHS.CONSULTATION_PURCHASE,
		});
		const referAFriendLink = getRedirectUrlToDashboard({
			params: {
				openGrowSurf: true,
			},
		});

		return {
			purchaseConsultationLink,
			startOnboarding,
			referAFriendLink,
			ONBOARDING_INTRODUCTION_VIDEO_SRC,
			REFERRAL_PROGRAM_PRICE,
			isHostingerBrand,
		};
	},

	data() {
		return {
			isHelpArticlesCollapsibleOpen: false,
			isKeyboardShortcutsCollapsibleOpen: false,
		};
	},

	computed: {
		...mapState(['isDemoMode']),
		...mapGetters('subscription', ['hasBusinessSubscription']),
		isConsultationServiceAvailable() {
			return this.$i18n.locale === 'lt';
		},
	},
	mounted() {
		if (isHostingerBrand) {
			EventLogApi.logEvent({
				eventName: 'website_builder.help.enter',
				isHostingerEvent: true,
			});
		}
	},
	methods: {
		...mapActionsGui({
			openDrawer: OPEN_DRAWER,
			closeDrawer: CLOSE_DRAWER,
		}),
		openQuickTour() {
			if (isHostingerBrand) {
				EventLogApi.logEvent({
					eventName: 'website_builder.quick_tour.enter',
					isHostingerEvent: true,
				});
			}

			this.closeDrawer();
			this.startOnboarding({
				steps: ONBOARDING_STEPS_SHORT_TOUR,
				onEndCallback: () => this.openDrawer({
					id: DRAWER_HELP_AND_RESOURCES,
				}),
			});
		},
		toggleHelpArticles() {
			this.isHelpArticlesCollapsibleOpen = !this.isHelpArticlesCollapsibleOpen;

			if (this.isHelpArticlesCollapsibleOpen && isHostingerBrand) {
				EventLogApi.logEvent({
					eventName: 'website_builder.help_articles.enter',
					isHostingerEvent: true,
				});
			}
		},
		toggleKeyboardShortcuts() {
			this.isKeyboardShortcutsCollapsibleOpen = !this.isKeyboardShortcutsCollapsibleOpen;

			if (this.isKeyboardShortcutsCollapsibleOpen && isHostingerBrand) {
				EventLogApi.logEvent({
					eventName: 'website_builder.keyboard_shortcuts.enter',
					isHostingerEvent: true,
				});
			}
		},
	},
});
</script>

<style lang="scss" scoped>
.help-resources-drawer {
	padding-bottom: 48px;

	// To prevent layout shift of collapsible expand, always show empty scrollbar on the side.
	overflow-y: scroll;

	&__header {
		padding: 24px;
		border-bottom: 1px solid $color-gray-border;
	}

	&__title {
		margin-bottom: 8px;
	}

	&__description {
		color: $color-gray;
	}

	&__introduction-video {
		padding: 24px;
	}

	&__external-links {
		padding: 0 24px;
	}

	&__external-link {
		color: $color-gray;
		text-decoration: none;
	}

	&__consultation-link {
		display: flex;
		gap: 8px;
		align-items: center;
		margin-top: 16px;
		margin-bottom: 16px;
	}
}

.collapsible-content {
	display: flex;
	flex-direction: column;

	&:not(:last-child) {
		margin-bottom: 24px;
	}

	&__title {
		margin-bottom: 16px;
		text-transform: uppercase;
	}

	&__shortcut-item {
		&:not(:last-child) {
			margin-bottom: 16px;
		}
	}
}

.quick-tour-trigger {
	display: flex;
	align-items: center;
	width: 100%;
	padding: 12px 24px;
	cursor: pointer;
	border-bottom: 1px solid $color-gray-border;
	transition: 0.3s ease background-color;

	&__icon {
		margin-right: 12px;
		color: $color-primary;
	}

	&:hover,
	&:focus {
		background-color: $color-gray-light;
	}
}

.free-workshop-link {
	display: flex;
	align-items: center;
	width: 100%;
	padding: 12px 24px;
	margin-bottom: 24px;
	text-decoration: none;
	cursor: pointer;
	border-bottom: 1px solid $color-gray-border;
	transition: 0.3s ease background-color;

	&__icon {
		width: 16px;
		margin-right: 12px;
		color: $color-primary;
	}

	&:hover,
	&:focus {
		background-color: $color-gray-light;
	}
}
</style>
