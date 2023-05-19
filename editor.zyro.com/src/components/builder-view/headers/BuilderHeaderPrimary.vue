<template>
	<div
		ref="builderHeader"
		v-qa="`builder-header-main`"
		class="builder-header"
	>
		<div class="builder-header__items builder-header__items--left">
			<ZyroButton
				v-qa="`builder-header-btn-collapsible-sidebar`"
				class="builder-header__collapsible-sidebar"
				theme="header"
				color="white"
				@click="toggleSidebar"
			>
				<Icon
					name="view_sidebar"
					direction="down"
				/>
			</ZyroButton>
			<div
				v-if="isQuickStartGuideVisible"
				class="builder-header__item builder-header__quick-start-container"
			>
				<BuilderHeaderQuickStartGuideButton />
			</div>
			<div class="builder-header__separator" />
			<template v-if="isStoreTypeZyro">
				<BuilderHeaderOnlineStoreButton />
				<div class="builder-header__separator" />
			</template>
		</div>

		<!-- Right side -->
		<div class="builder-header__items builder-header__items--right">
			<CampaignExpandingMessage
				v-if="!isDemoMode"
				class="builder-header__campaign-message"
			/>
			<template v-if="isMultilingualSwitcherVisible">
				<div class="builder-header__separator" />
				<MultilingualHeaderSwitcher />
			</template>
			<div class="builder-header__controls">
				<!-- Mobile/Desktop view toggle button -->
				<div class="builder-header__separator" />
				<BuilderHeaderScreenToggleButton />

				<!-- Undo button -->
				<div class="builder-header__separator" />
				<ZyroButton
					:disabled="isUndoDisabled"
					data-qa="builderheader-menuitem-undo"
					class="builder-header__undo-left-button"
					theme="header"
					color="white"
					:title="$t('common.undo')"
					@click="executeUndo"
				>
					<template #icon>
						<Icon name="undo" />
					</template>
				</ZyroButton>

				<!-- Redo button -->
				<ZyroButton
					:disabled="isRedoDisabled"
					data-qa="builderheader-menuitem-redo"
					class="builder-header__undo-right-button"
					theme="header"
					color="white"
					:title="$t('common.redo')"
					@click="executeRedo"
				>
					<template #icon>
						<Icon name="redo" />
					</template>
				</ZyroButton>

				<template v-if="!isHostingerBrand">
					<!-- Zyro domain connection status -->
					<template v-if="zyroDomain && !customDomain">
						<div class="builder-header__separator" />
						<BuilderHeaderZyroDomainConnectionStatus />
					</template>
				</template>

				<!-- Domain connection status -->
				<template v-if="customDomain">
					<div class="builder-header__separator" />
					<BuilderHeaderDomainConnectionStatus />
				</template>

				<!-- Save button -->
				<div class="builder-header__separator" />
				<BuilderHeaderSaveButton
					@mouseleave="setIsSavePopupVisible(false)"
				/>
			</div>
			<div
				v-if="isCurrentPageTypeBlog"
				class="builder-header__separator"
			/>
			<!-- Post settings button -->
			<ZyroButton
				v-if="isCurrentPageTypeBlog"
				theme="header"
				:title="$t('common.postSettings')"
				color="white"
				class="builder-header__separator"
				data-qa="builder-header-btn-postsettings"
				@click="openModal({
					name: 'BlogPostSettingsModal',
					settings: { blogPostId: currentPageId },
				})"
			>
				<template #icon-left>
					<Icon
						name="settings"
						dimensions="20px"
					/>
				</template>
				{{ $t('common.postSettings') }}
			</ZyroButton>
			<div
				v-if="isCurrentPageTypeBlog"
				class="builder-header__separator"
			/>
			<!-- Post status button -->
			<ZyroButton
				v-if="!isDemoMode && isCurrentPageTypeBlog"
				v-qa="`builder-header-btn-status-${$t(blogPostStatusTextPath).toLowerCase()}`"
				theme="header"
				color="white"
				:class="{ 'builder-header__button--disabled' : isScheduledPost }"
				@click="handleStatusClick"
			>
				<template #icon-right>
					<Icon
						:name="iconName"
						dimensions="20px"
					/>
				</template>
				{{ $t('common.status') }}: <b>{{ $t(blogPostStatusTextPath) }}</b>
			</ZyroButton>

			<!-- Preview button -->
			<div class="builder-header__separator" />
			<ZyroButton
				data-qa="builder-header-btn-preview"
				theme="header"
				color="white"
				@click="openPreview"
			>
				{{ $t('common.preview') }}
			</ZyroButton>
		</div>
		<BuilderHeaderPublishButton />
	</div>
</template>

<script>
import ZyroButton from '@/components/global/ZyroButton.vue';
import Icon from '@/components/global/Icon.vue';

import {
	mapGetters,
	mapState,
	mapActions,
	useStore,
} from 'vuex';
import {
	defineComponent,
	computed,
} from 'vue';
import BuilderHeaderSaveButton from '@/components/builder-view/headers/buttons/BuilderHeaderSaveButton.vue';
import BuilderHeaderOnlineStoreButton from '@/components/builder-view/headers/buttons/BuilderHeaderOnlineStoreButton.vue';
import BuilderHeaderScreenToggleButton from '@/components/builder-view/headers/buttons/BuilderHeaderScreenToggleButton.vue';
import BuilderHeaderDomainConnectionStatus from '@/components/builder-view/components/BuilderHeaderDomainConnectionStatus.vue';
import BuilderHeaderZyroDomainConnectionStatus from '@/components/builder-view/components/BuilderHeaderZyroDomainConnectionStatus.vue';
import BuilderHeaderPublishButton from '@/components/builder-view/headers/buttons/BuilderHeaderPublishButton.vue';
import CampaignExpandingMessage from '@/components/campaigns/CampaignExpandingMessage.vue';
import MultilingualHeaderSwitcher from '@/components/multilingual/MultilingualHeaderSwitcher.vue';
import BuilderHeaderQuickStartGuideButton from '@/components/builder-view/headers/buttons/BuilderHeaderQuickStartGuideButton.vue';
import { PREVIEW_ROUTE } from '@/constants/routes';
import { useGamification } from '@/use/useGamification';
import {
	mapActionsGui,
	UPDATE_HEADER_HEIGHT,
	OPEN_MODAL,
	mapStateGui,
} from '@/store/builder/gui';
import { isHostingerBrand } from '@/utils/isHostingerBrand';
import { SYSTEM_LOCALE } from '@zyro-inc/site-modules/constants';
import EventLogApi from '@/api/EventLogApi';
import { useHeaderPopups } from '@/use/useHeaderPopups';

export default defineComponent({
	name: 'BuilderHeaderPrimary',

	components: {
		ZyroButton,
		Icon,
		BuilderHeaderSaveButton,
		BuilderHeaderScreenToggleButton,
		BuilderHeaderQuickStartGuideButton,
		BuilderHeaderPublishButton,
		BuilderHeaderDomainConnectionStatus,
		BuilderHeaderZyroDomainConnectionStatus,
		CampaignExpandingMessage,
		MultilingualHeaderSwitcher,
		BuilderHeaderOnlineStoreButton,
	},

	setup() {
		const {
			getters,
			state,
		} = useStore();
		const { isGamificationVisible } = useGamification();
		const { setIsSavePopupVisible } = useHeaderPopups();
		const isDemoMode = computed(() => state.isDemoMode);
		const isStoreTypeZyro = computed(() => getters['ecommerce/isStoreTypeZyro']);
		const isGamificationLoaded = computed(() => state.gamification.isGamificationLoaded);

		const isQuickStartGuideVisible = computed(() => {
			if (isDemoMode.value) {
				return false;
			}

			return isGamificationLoaded.value && !isGamificationVisible.value;
		});

		return {
			setIsSavePopupVisible,
			isHostingerBrand,
			isStoreTypeZyro,
			isGamificationVisible,
			isGamificationLoaded,
			isQuickStartGuideVisible,
			isDemoMode,
		};
	},

	computed: {
		...mapState([
			'currentPageId',
			'customDomain',
			'zyroDomain',
			'currentLocale',
		]),
		...mapGetters([
			'currentPage',
			'isCurrentPageTypeBlog',
			'hasLanguages',
		]),
		...mapGetters('undoRedo', [
			'isUndoDisabled',
			'isRedoDisabled',
		]),
		...mapStateGui(['isSidebarExpanded']),
		isScheduledPost() {
			return this.currentPage?.isScheduled ?? false;
		},
		isDraftPost() {
			return this.currentPage?.isDraft ?? false;
		},
		blogPostStatusTextPath() {
			if (this.isScheduledPost) {
				return 'common.scheduled';
			}

			if (this.isDraftPost) {
				return 'common.draft';
			}

			return 'common.public';
		},
		iconName() {
			if (this.isScheduledPost) {
				return 'av_timer';
			}

			return this.isDraftPost ? 'visibility_off' : 'visibility';
		},
		isMultilingualSwitcherVisible() {
			// removeLanguage first changes current locale and updates siteData later
			// in that awkward period this.hasLanguages would remove 'true' and fail inside component
			return this.hasLanguages && this.currentLocale !== SYSTEM_LOCALE;
		},
	},

	mounted() {
		this.updateHeaderHeight(this.$refs.builderHeader.clientHeight);
	},

	methods: {
		...mapActions('blog', ['toggleBlogPostVisibility']),
		...mapActions('gui', ['toggleCollapsibleSidebar']),
		...mapActions('saving', ['saveWebsite']),
		...mapActionsGui({
			updateHeaderHeight: UPDATE_HEADER_HEIGHT,
			openModal: OPEN_MODAL,
		}),
		...mapActions('undoRedo', [
			'executeUndo',
			'executeRedo',
		]),
		async handleStatusClick() {
			if (!this.currentPage?.isScheduled) {
				this.toggleBlogPostVisibility(this.currentPageId);
				// additionally save website on status changes to prevent nasty UI saving button jumps
				await this.saveWebsite();
			}
		},
		toggleSidebar() {
			this.toggleCollapsibleSidebar();
			window.localStorage.setItem('isSidebarExpanded', JSON.stringify(this.isSidebarExpanded));
		},
		openPreview() {
			this.$router.push({
				name: PREVIEW_ROUTE,
			});

			EventLogApi.logEvent({
				eventName: 'website_builder.builder.previewed',
				isHostingerEvent: true,
			});
		},
	},
});
</script>

<style lang="scss" scoped>
@import "./BuilderHeader";
</style>
