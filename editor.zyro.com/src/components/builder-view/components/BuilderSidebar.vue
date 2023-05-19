<template>
	<div
		class="sidebar"
		:class="{ 'sidebar--expanded': isSidebarExpanded }"
	>
		<BuilderSidebarBackButton v-if="!isDemoMode" />
		<ZyroSeparator class="sidebar__separator" />
		<div class="sidebar__category">
			<div class="sidebar__actions">
				<template v-if="isGamificationVisible">
					<BuilderSidebarAction
						:is-active="activeDrawer === DRAWER_GAMIFICATION"
						:title="$t('builder.gamificationTitle')"
						@action-click="toggleDrawer(DRAWER_GAMIFICATION)"
					>
						<template #beforeTitle>
							<Transition name="fade">
								<CircularProgressBar
									:percentage="progressPercentage"
									:is-loading="!achievements.length"
									:incomplete-line-color="activeDrawer === DRAWER_GAMIFICATION ? 'white' : 'grey'"
									:class="{ 'sidebar__before-title' : isSidebarExpanded }"
								>
									{{ `${completedAchievementsCount}/${achievements.length}` }}
								</CircularProgressBar>
							</Transition>
							<AchievementCompletedTooltip
								v-if="activeDrawer !== DRAWER_GAMIFICATION && isAchievementCompleteTooltipShown"
								@close="handleGamificationTooltipClose"
							/>
						</template>
					</BuilderSidebarAction>
					<ZyroSeparator
						class="sidebar__separator sidebar__separator--with-margin"
						:class="{ 'sidebar__separator--with-expanded-sidebar' : isSidebarExpanded }"
					/>
				</template>
				<BuilderSidebarAction
					:is-active="activeDrawer === DRAWER_ADD_ELEMENT"
					:title="$t('builder.addElementDrawer.title')"
					icon="add_circle"
					@action-click="toggleDrawer(DRAWER_ADD_ELEMENT)"
				/>
				<BuilderSidebarAction
					:is-active="activeDrawer === DRAWER_MULTI_PAGE"
					:title="$t('builder.siteMenu.title')"
					icon="layers"
					is-icon-filled
					@action-click="toggleDrawer(DRAWER_MULTI_PAGE)"
				/>
				<BuilderSidebarAction
					:is-active="activeDrawer === DRAWER_USER_STYLES"
					:title="$t('builder.userStyles.drawerLabel')"
					icon="palette"
					is-icon-filled
					@action-click="toggleDrawer(DRAWER_USER_STYLES)"
				/>
				<BuilderSidebarAction
					v-if="isZyroUser"
					:is-active="activeDrawer === DRAWER_GLOBAL_STYLES"
					:title="$t('builder.designerWebsiteStyles')"
					icon="palette"
					@action-click="toggleDrawer(DRAWER_GLOBAL_STYLES)"
				/>
				<BuilderSidebarAction
					:is-active="activeDrawer === DRAWER_BLOG"
					:title=" $t('builder.blog.blogDrawer.title')"
					icon="drive_file_rename_outline"
					@action-click="toggleDrawer(DRAWER_BLOG)"
				/>
				<BuilderSidebarAction
					:is-active="isStoreDrawerActive"
					:title="sidebarStoreActionTitle"
					icon="shopping_cart"
					is-icon-filled
					@action-click="handleSidebarStoreActionClick"
				/>
				<ZyroSeparator
					class="sidebar__separator sidebar__separator--with-margin"
					:class="{ 'sidebar__separator--with-expanded-sidebar' : isSidebarExpanded }"
				/>
				<BuilderSidebarAction
					:is-active="activePopup === 'aiPopup'"
					:title="$t('common.aiTools')"
				>
					<template #trigger>
						<BuilderSidebarAiPopup
							:is-active="activePopup === 'aiPopup'"
							:title="$t('common.aiTools')"
							class="action__button z-body-small z-body-small--strong"
							:class="{
								'action__button--expanded': isSidebarExpanded,
								'action__button--active': activePopup === 'aiPopup',
							}"
							@click="setOpenPopup('aiPopup')"
							@close-popup="setOpenPopup(null)"
						/>
					</template>
				</BuilderSidebarAction>
				<BuilderSidebarAction
					v-if="!isDemoMode"
					:title="$t('builder.analytics')"
					icon="insert_chart"
					is-icon-filled
					@action-click="openAnalyticsPage"
				/>
				<BuilderSidebarAction
					:is-active="activeDrawer === DRAWER_MULTILINGUAL"
					:title="$t('builder.multilingualDrawerTitle')"
					icon="translate"
					@action-click="toggleDrawer(DRAWER_MULTILINGUAL)"
				/>
			</div>
			<div class="sidebar__settings">
				<BuilderSidebarAction
					:is-active="isSearchOpen"
					:title="$t('common.search')"
					icon="search"
					:forced-position="{
						left: '64px',
						top: '-20px',
						'white-space': 'nowrap'
					}"
					@action-click="openSearch"
				>
					<template #tooltip-content>
						<SpotlightTooltip />
					</template>
				</BuilderSidebarAction>
				<ZyroSeparator
					class="sidebar__separator sidebar__separator--with-margin"
					:class="{ 'sidebar__separator--with-expanded-sidebar' : isSidebarExpanded }"
				/>
				<BuilderSidebarAction
					v-if="hasMigrationToLayoutModifiedSections"
					:title="$t('builder.reviewChanges')"
					:is-active="activePopup === GRID_TO_LAYOUT_MIGRATION_CHANGES_POPUP"
				>
					<template #trigger>
						<GridToLayoutMigrationChangesPopup
							:title="$t('builder.reviewChanges')"
							:is-active="activePopup === GRID_TO_LAYOUT_MIGRATION_CHANGES_POPUP"
							icon="alert-round-orange"
							class="action__button z-body-small z-body-small--strong"
							:class="{
								'action__button--expanded': isSidebarExpanded,
								'action__button--active': activePopup === GRID_TO_LAYOUT_MIGRATION_CHANGES_POPUP,
							}"
							@click="toggleMigrationToLayoutPopup"
							@close-popup="setOpenPopup(null)"
						/>
					</template>
				</BuilderSidebarAction>
				<BuilderSidebarAction
					:title="$t('builder.sidebarFeedback.message')"
					:is-active="activePopup === BUILDER_NPS_SIDEBAR_POPUP"
				>
					<template #trigger>
						<BuilderSidebarFeedbackPopup
							:is-active="activePopup === BUILDER_NPS_SIDEBAR_POPUP"
							:title="$t('builder.sidebarFeedback.message')"
							icon="feedback"
							class="action__button z-body-small z-body-small--strong"
							:class="{
								'action__button--expanded': isSidebarExpanded,
								'action__button--active': activePopup === BUILDER_NPS_SIDEBAR_POPUP,
							}"
							@click="setOpenPopup(BUILDER_NPS_SIDEBAR_POPUP)"
							@close-popup="setOpenPopup(null)"
						/>
					</template>
				</BuilderSidebarAction>
				<BuilderSidebarAction
					:is-active="activeDrawer === DRAWER_HELP_AND_RESOURCES"
					:title="$t('builder.sidebarKnowledgeBase')"
					icon="help"
					@action-click="handleKnowledgeBaseActionClick"
				>
					<template
						v-if="isKnowledgeBaseNotificationEnabled"
						#beforeTrigger
					>
						<ZyroPill
							class="sidebar__action-pill"
							theme="secondary"
							text="1"
						/>
					</template>
				</BuilderSidebarAction>
				<BuilderSidebarAction
					v-if="!isDemoMode"
					:is-active="activePopup === 'builderSettings'"
					:title="$t('builder.sidebarWebsiteSettingsLabel')"
				>
					<template #trigger>
						<BuilderSidebarSettingsPopup
							:is-active="activePopup === 'builderSettings'"
							:title="$t('builder.sidebarWebsiteSettingsLabel')"
							icon="settings"
							is-icon-filled
							class="action__button z-body-small z-body-small--strong"
							:class="{
								'action__button--expanded': isSidebarExpanded,
								'action__button--active': activePopup === 'builderSettings',
							}"
							@click="setOpenPopup('builderSettings')"
							@close-popup="setOpenPopup(null)"
						/>
					</template>
				</BuilderSidebarAction>
			</div>
		</div>
	</div>
</template>

<script>
import {
	computed,
	defineComponent,
	ref,
	watch,
} from 'vue';
import {
	mapGetters,
	mapState,
	mapMutations,
	useStore,
} from 'vuex';
import { useLocaleProperties } from '@/use/useLocaleProperties';
import {
	COOKIE_KNOWLEDGE_BASE_NOTIFICATION_DISABLED,
	DRAWER_ADD_ELEMENT,
	DRAWER_BLOG,
	DRAWER_MULTI_PAGE,
	DRAWER_MULTILINGUAL,
	DRAWER_USER_STYLES,
	DRAWER_MANAGE_STORE,
	DRAWER_ADD_ONLINE_STORE,
	DRAWER_AI_WRITER,
	DRAWER_GLOBAL_STYLES,
	DRAWER_HELP_AND_RESOURCES,
	DRAWER_GAMIFICATION,
} from '@/constants';
import {
	getCookie,
	setCookie,
} from '@zyro-inc/site-modules/utils/cookies';
import {
	BUILDER_NPS_TRIGGER_SELECTOR,
	BUILDER_NPS_SIDEBAR_POPUP,
} from '@/components/builder-nps/npsSelectors';
import {
	ACTIONS_CATEGORY_AI,
	ACTIONS_CATEGORY_BUILDER,
	ACTIONS_CATEGORY_SETTINGS,
	AI_TOOLS_COLOR,
} from '@/components/builder-view/components/constants/builderSidebarConstants';
import {
	mapStateGui,
	mapActionsGui,
	TOGGLE_DRAWER,
	TOGGLE_HEATMAP,
	SET_COLLAPSIBLE_SIDEBAR,
} from '@/store/builder/gui';
import { ANALYTICS_SETTINGS_ROUTE } from '@/constants/routes';
import EventLogApi from '@/api/EventLogApi';

import BuilderSidebarAction from '@/components/builder-view/components/BuilderSidebarAction.vue';
import BuilderSidebarBackButton from '@/components/builder-view/components/BuilderSidebarBackButton.vue';
import ZyroSeparator from '@/components/global/ZyroSeparator.vue';
import ZyroPill from '@/components/global/ZyroPill.vue';
import BuilderSidebarAiPopup from '@/components/builder-view/components/BuilderSidebarAiPopup.vue';
import BuilderSidebarFeedbackPopup from '@/components/builder-view/components/BuilderSidebarFeedbackPopup.vue';
import BuilderSidebarSettingsPopup from '@/components/builder-view/components/BuilderSidebarSettingsPopup.vue';
import GridToLayoutMigrationChangesPopup from '@/components/grid-to-layout-migration/GridToLayoutMigrationChangesPopup.vue';
import { isHostingerBrand } from '@/utils/isHostingerBrand';
import { useSpotlight } from '@/components/spotlight/useSpotlight';
import { useGamification } from '@/use/useGamification';
import SpotlightTooltip from '@/components/spotlight/SpotlightTooltip.vue';
import { useRouter } from 'vue-router';
import CircularProgressBar from '@/components/reusable-components/CircularProgressBar.vue';
import AchievementCompletedTooltip from '@/components/onboarding/AchievementCompletedTooltip.vue';

const GRID_TO_LAYOUT_MIGRATION_CHANGES_POPUP = 'GridToLayoutMigrationChangesPopup';

export default defineComponent({
	components: {
		SpotlightTooltip,
		ZyroSeparator,
		BuilderSidebarAction,
		BuilderSidebarBackButton,
		BuilderSidebarSettingsPopup,
		BuilderSidebarFeedbackPopup,
		BuilderSidebarAiPopup,
		GridToLayoutMigrationChangesPopup,
		ZyroPill,
		CircularProgressBar,
		AchievementCompletedTooltip,
	},

	setup() {
		const {
			openSearch,
			isSearchOpen,
		} = useSpotlight();
		const {
			isGamificationVisible,
			achievements,
			completedAchievementsCount,
			lastCompletedAchievement,
		} = useGamification();
		const { localeProperties } = useLocaleProperties();
		const smallDesktopDisplayWidth = 1584;
		const activePopup = ref('');
		const {
			getters,
			state,
			dispatch,
		} = useStore();

		const { push } = useRouter();

		const isAchievementCompleteTooltipShown = ref(false);
		const progressPercentage = computed(() => (completedAchievementsCount.value / achievements.value.length) * 100);

		const handleGamificationTooltipClose = () => {
			isAchievementCompleteTooltipShown.value = false;
		};

		const hasMigrationToLayoutModifiedSections = computed(() => Object
			.keys(getters.siteMeta?.migrationToLayoutModifications ?? {}).length);

		const setOpenPopup = (value) => {
			if (state.gui.activeDrawer && value !== null) {
				dispatch('closeDrawer');
			}

			if (activePopup.value === value) {
				activePopup.value = '';
			} else {
				const eventNameMap = {
					aiPopup: 'website_builder.ai_tools.enter',
					builderSettings: 'website_builder.website_settings.enter',
					[BUILDER_NPS_SIDEBAR_POPUP]: 'website_builder.feedback.enter',
				};

				if (eventNameMap[value]) {
					EventLogApi.logEvent({
						eventName: eventNameMap[value],
						isHostingerEvent: true,
					});
				}

				activePopup.value = value;
				dispatch('unselectCurrentElement');
			}
		};

		const toggleMigrationToLayoutPopup = () => {
			if (state.gui.isMigrationToLayoutPopupVisible && !activePopup.value) {
				dispatch('gui/setMigrationToLayoutPopupVisibility', false);

				return;
			}

			setOpenPopup(GRID_TO_LAYOUT_MIGRATION_CHANGES_POPUP);
		};

		const openAnalyticsPage = () => {
			EventLogApi.logEvent({
				eventName: 'website_builder.website_settings_analytics.enter',
				eventProperties: {
					location: 'side_bar',
				},
				isHostingerEvent: true,
			});
			push({
				name: ANALYTICS_SETTINGS_ROUTE,
			});
		};

		watch(completedAchievementsCount, (newCount) => {
			const lastCompletedAchievementKeys = Object.keys(lastCompletedAchievement.value);

			// tooltip shown only when one step is already done
			if (lastCompletedAchievementKeys.length && newCount > 1) {
				isAchievementCompleteTooltipShown.value = true;
			}
		});

		return {
			openSearch,
			isSearchOpen,
			toggleMigrationToLayoutPopup,
			setOpenPopup,
			activePopup,
			hasMigrationToLayoutModifiedSections,
			ACTIONS_CATEGORY_BUILDER,
			ACTIONS_CATEGORY_SETTINGS,
			ACTIONS_CATEGORY_AI,
			DRAWER_USER_STYLES,
			DRAWER_MANAGE_STORE,
			DRAWER_ADD_ONLINE_STORE,
			DRAWER_AI_WRITER,
			DRAWER_HELP_AND_RESOURCES,
			localeProperties,
			DRAWER_GLOBAL_STYLES,
			DRAWER_ADD_ELEMENT,
			DRAWER_BLOG,
			DRAWER_MULTI_PAGE,
			DRAWER_MULTILINGUAL,
			DRAWER_GAMIFICATION,
			AI_TOOLS_COLOR,
			BUILDER_NPS_SIDEBAR_POPUP,
			smallDesktopDisplayWidth,
			GRID_TO_LAYOUT_MIGRATION_CHANGES_POPUP,
			openAnalyticsPage,
			progressPercentage,
			achievements,
			completedAchievementsCount,
			isGamificationVisible,
			handleGamificationTooltipClose,
			isAchievementCompleteTooltipShown,
		};
	},

	data() {
		return {
			isKnowledgeBaseNotificationEnabled: false,
		};
	},

	computed: {
		...mapStateGui([
			'isHeatmapOpen',
			'activeDrawer',
			'isSidebarExpanded',
		]),
		...mapState(['isDemoMode']),
		...mapState('nps', ['isNpsVisible']),
		...mapGetters(['siteMeta']),
		...mapGetters('ecwid', ['isLocaleWithEcwid']),
		...mapGetters('ecommerce', ['isStoreTypeZyro']),
		...mapGetters('user', ['isZyroUser']),
		isStoreManagerAvailable() {
			return this.isLocaleWithEcwid || this.isStoreTypeZyro;
		},
		isStoreDrawerActive() {
			return this.activeDrawer === DRAWER_ADD_ONLINE_STORE || this.activeDrawer === DRAWER_MANAGE_STORE;
		},
		sidebarStoreActionTitle() {
			if (this.isStoreTypeZyro) {
				return this.$t('builder.onlineStore');
			}

			return this.$t('builder.addEcommerceStoreDrawer.title');
		},
		isEnText() {
			return this.$t('common.sell') === 'sell';
		},
		ecommerceBadgeText() {
			return this.isEnText || this.isSidebarExpanded ? this.$t('common.sell') : '';
		},
	},

	watch: {
		isNpsVisible: {
			handler(isNpsVisible) {
				if (isNpsVisible && this.activePopup !== BUILDER_NPS_SIDEBAR_POPUP) {
					document.querySelector(`[data-trigger-reference="${BUILDER_NPS_TRIGGER_SELECTOR}"`).click();
				}
			},
		},
	},

	mounted() {
		const isKnowledgeBaseNotificationDisabledCookieSet = getCookie(COOKIE_KNOWLEDGE_BASE_NOTIFICATION_DISABLED);

		this.setCollapsibleSidebar();

		this.isKnowledgeBaseNotificationEnabled = this.$i18n.locale === 'lt' && !isKnowledgeBaseNotificationDisabledCookieSet;
	},

	methods: {
		...mapActionsGui({
			toggleDrawer: TOGGLE_DRAWER,
			toggleHeatmap: TOGGLE_HEATMAP,
		}),
		...mapMutations('gui', [SET_COLLAPSIBLE_SIDEBAR]),
		handleSidebarStoreActionClick() {
			if (this.isStoreManagerAvailable) {
				this.toggleDrawer(DRAWER_MANAGE_STORE);
			} else {
				this.toggleDrawer(DRAWER_ADD_ONLINE_STORE);
			}

			EventLogApi.logEvent({
				eventName: 'website_builder.ecomm_store.enter',
				eventProperties: {
					location: 'drawer',
				},
				isHostingerEvent: isHostingerBrand,
			});
		},
		handleKnowledgeBaseActionClick() {
			if (this.isKnowledgeBaseNotificationEnabled) {
				setCookie(COOKIE_KNOWLEDGE_BASE_NOTIFICATION_DISABLED, true, 365);
				this.isKnowledgeBaseNotificationEnabled = false;
			}

			this.toggleDrawer(DRAWER_HELP_AND_RESOURCES);
		},
		setCollapsibleSidebar() {
			if (window.matchMedia(`(max-width: ${this.smallDesktopDisplayWidth}px)`).matches) {
				this.SET_COLLAPSIBLE_SIDEBAR(false);

				return;
			}

			const isSidebarExpanded = JSON.parse(window.localStorage.getItem('isSidebarExpanded')) ?? true;

			this.SET_COLLAPSIBLE_SIDEBAR(isSidebarExpanded);
		},
	},
});
</script>

<style lang="scss" scoped>
@import "@/components/builder-view/components/BuilderActionButton";

.sidebar {
	position: relative;
	z-index: $z-index-layout-sidebar;
	display: flex;
	flex-direction: column;
	align-items: center;
	width: $sidebar-width-editor;
	height: 100%;
	background-color: $color-light;
	border-right: solid 1px $color-gray-border;
	transition: 0.2s ease-in-out;

	&--expanded {
		align-items: flex-start;
		min-width: $sidebar-width-expanded-editor;
	}

	&__category {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: 100%;
		height: 100%;
		padding: 8px 0;

		// Fixes the issue with overflowing content on small screens
		// That is caused by BuilderPreview unselectCurrentElement call on screen resize
		@media screen and (max-height: 800px) {
			overflow-x: hidden;
			overflow-y: auto;
		}
	}

	&__separator {
		width: 100%;
		height: 1px;
		background-color: $color-gray-border;
		transition: 0.2s ease-in-out;

		&--with-margin {
			width: 40px;
			margin: 4px auto;
		}

		&--with-expanded-sidebar {
			width: 224px;
		}
	}

	&__action-ecomm-badge {
		position: absolute;
		top: -4px;
		right: 2px;
		z-index: $z-index-layout-sidebar;
		pointer-events: none;

		&--no-text {
			right: 4px;
			padding: 8px;
			border-radius: 50%;
		}

		&--expanded {
			top: 11px;
			right: 16px;
		}
	}

	&__action-pill {
		position: absolute;
		top: 4px;
		right: 5px;
		z-index: $z-index-layout-sidebar;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 16px;
		height: 16px;
		padding: 0 0 0 1px;
		border-radius: 50%;
	}

	&__before-title {
		margin-right: 8px;
	}
}
</style>
