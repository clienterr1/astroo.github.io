<template>
	<div class="builder">
		<BuilderSidebar />
		<div class="builder__right">
			<BuilderHeaderPrimary />
			<BuilderHeatmapHeader />
			<BuilderRoot />
		</div>
		<Onboarding v-if="isOnboardingVisible" />
		<ZyroModal
			v-if="$router.currentRoute.value.query.restored === 'true'"
			max-width="480px"
			max-height="214px"
			:title="$t('builder.backupSiteRestoredTitle')"
			@close-modal="$router.replace({ query: null })"
		>
			{{ $t('builder.versionHistorySiteRestoredDescription') }}
			<template #footer>
				<ZyroButton
					theme="primary"
					data-qa="builder-versionhistory-btn-restore-complete"
					class="version-restored-button"
					@click="$router.replace({ query: null })"
				>
					{{ $t('common.gotIt') }}
				</ZyroButton>
			</template>
		</ZyroModal>
		<GridToLayoutMigrationModal
			v-if="!!isMigrationModalShown"
			@close-modal="handleCloseModal"
		/>
		<Overlay />
	</div>
</template>

<script>
import {
	mapState,
	mapGetters,
	mapActions,
	useStore,
} from 'vuex';
import { PREVIEW_ROUTE } from '@/constants/routes';
import { useGamification } from '@/use/useGamification';
import BuilderHeatmapHeader from '@/components/builder-view/components/BuilderHeatmapHeader.vue';
import BuilderSidebar from '@/components/builder-view/components/BuilderSidebar.vue';
import BuilderHeaderPrimary from '@/components/builder-view/headers/BuilderHeaderPrimary.vue';
import BuilderRoot from '@/components/builder-view/views/BuilderRoot/BuilderRoot.vue';
import Onboarding from '@/components/onboarding/Onboarding.vue';
import GridToLayoutMigrationModal from '@/components/grid-to-layout-migration/GridToLayoutMigrationModal.vue';
import Overlay from '@/components/reusable-components/Overlay.vue';
import { useOnboarding } from '@/components/onboarding/useOnboarding';
import {
	mapStateGui,
	mapActionsGui,
	CLOSE_SIDEBAR,
} from '@/store/builder/gui';
import {
	LOCAL_STORAGE_KEY_ONBOARDING_COMPLETED,
	ONBOARDING_STEPS,
	ONBOARDING_STEPS_STEP_COUNT_TO_SHOW,
} from '@/constants';

import { isHostingerBrand } from '@/utils/isHostingerBrand';
import ZyroModal from '@/components/global/ZyroModal.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';
import { useDomainConnection } from '@/use/useDomainConnection';
import {
	defineComponent,
	onMounted,
	onUnmounted,
	computed,
} from 'vue';

export default defineComponent({
	name: 'Builder',

	components: {
		ZyroModal,
		ZyroButton,
		BuilderRoot,
		BuilderHeaderPrimary,
		BuilderHeatmapHeader,
		BuilderSidebar,
		Onboarding,
		GridToLayoutMigrationModal,
		Overlay,
	},

	/**
	 * Set currentPage to mostRecentBuilderPageId, if it was set. This returns to the same page after
	 * navigating elsewhere in the editor
	 * (currentPageId can get unset after preview/blog mode to other)
	 */
	beforeRouteEnter(to, from, next) {
		next((vm) => {
			const isFromPreview = from.path.includes(PREVIEW_ROUTE);

			if (vm.mostRecentBuilderPageId && !isFromPreview) {
				vm.updateCurrentPageId(vm.mostRecentBuilderPageId);
				vm.updateMostRecentBuilderPageId(null);
			}
		});
	},

	beforeRouteLeave(to, from, next) {
		this.leaveElementEditMode();
		this.updateMostRecentBuilderPageId(this.currentPageId);
		next();
	},

	setup() {
		const {
			state,
			getters,
			dispatch,
		} = useStore();
		const {
			isOnboardingVisible,
			shouldOpenQuickStartGuideOnEnd,
			startOnboarding,
			openRestartTourPopup,
		} = useOnboarding();
		const {
			connectToWebsocket,
			removeGamificationWsListeners,
			isGamificationAvailableForSite,
		} = useGamification();
		const { trackDomainConnectionStatus } = useDomainConnection(state.websiteId);

		const isQATestUser = computed(() => getters.isQATestUser);
		const isImpersonatedUser = computed(() => state['user/user']?.impersonating);
		const isMobileScreen = computed(() => state.gui.isMobileScreen);

		const initiateOnboarding = () => {
			const isOnboardingCompleted = window.localStorage.getItem(LOCAL_STORAGE_KEY_ONBOARDING_COMPLETED);

			// Skip for QA users -> https://hostinger.slack.com/archives/C01BHN9EF8F/p1631790594479700
			if (isOnboardingCompleted || isQATestUser.value || isImpersonatedUser.value || isMobileScreen.value) {
				return;
			}

			startOnboarding({
				steps: ONBOARDING_STEPS,
				stepCountToShow: ONBOARDING_STEPS_STEP_COUNT_TO_SHOW,
				onEndCallback: isHostingerBrand ? null : openRestartTourPopup,
			});
		};

		onMounted(() => {
			trackDomainConnectionStatus();

			if (!isGamificationAvailableForSite.value) {
				initiateOnboarding();
			}
		});

		connectToWebsocket(state.websiteId);

		const isMigrationModalShown = computed(() => !!getters.siteMeta.migrationToLayoutModifications && getters['gui/isMigrationToLayoutModalVisible']);
		const websiteId = computed(() => state.websiteId);

		const handleCloseModal = () => {
			dispatch('gui/setMigrationToLayoutModalVisibility', false);
			// turn off animation modal so it would not open in other pages
			dispatch('gui/setAnimationsIntroductionModalVisibility', false);
		};

		onUnmounted(() => {
			removeGamificationWsListeners();
		});

		return {
			handleCloseModal,
			isMigrationModalShown,
			isOnboardingVisible,
			shouldOpenQuickStartGuideOnEnd,
			isHostingerBrand,
			isQATestUser,
			websiteId,
		};
	},

	computed: {
		...mapState([
			'currentPageId',
			'mostRecentBuilderPageId',
		]),
		...mapStateGui([
			'isSidebarOpen',
			'isMobileScreen',
		]),
		...mapGetters(['sitePages']),
	},

	created() {
		if (this.isMobileScreen && this.isSidebarOpen) {
			this.closeSidebar();
		}
	},

	methods: {
		...mapActions([
			'leaveElementEditMode',
			'updateCurrentPageId',
			'updateMostRecentBuilderPageId',
		]),
		...mapActionsGui({
			closeSidebar: CLOSE_SIDEBAR,
		}),
	},
});
</script>

<style lang="scss">
.builder {
	display: flex;
	width: 100vw;
	height: 100vh;

	&__right {
		display: flex;
		flex-direction: column;
		width: 100%;
		min-width: 0;
	}
}

.version-restored-button {
	margin-left: auto;
}
</style>
