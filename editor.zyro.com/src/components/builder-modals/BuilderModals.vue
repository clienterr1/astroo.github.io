<template>
	<Component
		:is="component"
		v-if="component"
		:settings="activeModalSettings"
	/>
</template>

<script>
import { mapState } from 'vuex';

import ActiveSubscriptionModal from '@/components/builder-modals/modals/-partials/edit-online-store/ActiveSubscriptionModal.vue';
import BusinessSubscriptionModal from '@/components/builder-modals/modals/-partials/edit-online-store/BusinessSubscriptionModal.vue';
import DefaultModal from '@/components/builder-modals/modals/-partials/edit-online-store/DefaultModal.vue';
import AddBlockModal from '@/components/builder-modals/modals/AddBlockModal.vue';
import AddPageModal from '@/components/builder-modals/modals/AddPageModal.vue';
import AddLinkModal from '@/components/builder-modals/modals/AddLinkModal.vue';
import AssetManager from '@/components/builder-modals/modals/AssetManager.vue';
import BeforePublishModal from '@/components/builder-modals/modals/BeforePublishModal.vue';
import BlogPostSettingsModal from '@/components/builder-modals/modals/BlogPostSettingsModal.vue';
import BlogSettingsModal from '@/components/builder-modals/modals/BlogSettingsModal.vue';
import ChooseBlockPlacementModal from '@/components/builder-modals/modals/ChooseBlockPlacementModal.vue';
import ConnectSubscriptionModal from '@/components/builder-modals/modals/ConnectSubscriptionModal.vue';
import DefaultNotificationModal from '@/components/builder-modals/modals/DefaultNotificationModal.vue';
import DomainConnectionModal from '@/components/builder-modals/modals/DomainConnectionModal.vue';
import EditOnlineStoreModal from '@/components/builder-modals/modals/EditOnlineStoreModal.vue';
import LinkSettingsModal from '@/components/builder-modals/modals/LinkSettingsModal.vue';
import PublishErrorModal from '@/components/builder-modals/modals/PublishErrorModal.vue';
import PublishModal from '@/components/builder-modals/modals/PublishModal.vue';
import PublishModalOption from '@/components/builder-modals/modals/PublishModalOption.vue';
import PublishedModal from '@/components/builder-modals/modals/PublishedModal.vue';
import PublishedModalRoot from '@/components/builder-modals/modals/PublishedModalRoot.vue';
import PublishedModalUpdateSection from '@/components/builder-modals/modals/PublishedModalUpdateSection.vue';
import SubscriptionExpiredModal from '@/components/builder-modals/modals/SubscriptionExpiredModal.vue';
import SystemDialogModal from '@/components/builder-modals/modals/SystemDialogModal.vue';
import UnsavedChangesModal from '@/components/builder-modals/modals/UnsavedChangesModal.vue';
import UpgradePlanEcommerce from '@/components/builder-modals/modals/UpgradePlanEcommerce.vue';
import UserTypographyResetAllChangesModal from '@/components/builder-modals/modals/UserTypographyResetAllChangesModal.vue';
import UserTypographyStylesResetModal from '@/components/builder-modals/modals/UserTypographyStylesResetModal.vue';
import LegalContentGeneratorModal from '@/components/builder-modals/modals/LegalContentGeneratorModal.vue';
import GamificationWelcomeModal from '@/components/builder-modals/modals/GamificationWelcomeModal.vue';
import {
	MODAL_USER_TYPOGRAPHY_STYLES_RESET,
	MODAL_USER_TYPOGRAPHY_RESET_ALL_CHANGES,
	MODAL_DEFAULT_NOTIFICATION,
	MODAL_PUBLISH_ERROR,
	MODAL_DOMAIN_CONNECTION,
	MODAL_EDIT_ONLINE_STORE,
	MODAL_ADD_BLOCK,
	MODAL_ADD_PAGE,
	MODAL_BLOG_POST_SETTINGS,
	MODAL_LINK_SETTINGS,
	MODAL_BLOG_SETTINGS,
	MODAL_ADD_LINK,
	MODAL_SUBSCRIPTION_EXPIRED,
	MODAL_PUBLISH,
	MODAL_BEFORE_PUBLISH,
	MODAL_PUBLISHED,
	MODAL_CONNECT_SUBSCRIPTION,
	MODAL_ASSET_MANAGER,
	MODAL_CHOOSE_BLOCK_PLACEMENT,
	MODAL_PUBLISHED_ROOT,
	MODAL_PUBLISHED_UPDATE_SECTION,
	MODAL_PUBLISH_OPTION,
	MODAL_SYSTEM_DIALOG,
	MODAL_UNSAVED_CHANGES,
	MODAL_ECOMMERCE_UPGRADE_PLAN,
	MODAL_DEFAULT,
	MODAL_BUSINESS_SUBSCRIPTION,
	MODAL_ACTIVE_SUBSCRIPTION,
	MODAL_LEGAL_CONTENT_GENERATOR,
	MODAL_GAMIFICATION_WELCOME,
} from '@/constants';
import {
	mapActionsGui,
	OPEN_MODAL,
} from '@/store/builder/gui';

import { defineComponent } from 'vue';

const OPEN_MODAL_QUERY_PARAM = 'open-modal';

export default defineComponent({
	components: {
		[MODAL_USER_TYPOGRAPHY_STYLES_RESET]: UserTypographyStylesResetModal,
		[MODAL_USER_TYPOGRAPHY_RESET_ALL_CHANGES]: UserTypographyResetAllChangesModal,
		[MODAL_DEFAULT_NOTIFICATION]: DefaultNotificationModal,
		[MODAL_PUBLISH_ERROR]: PublishErrorModal,
		[MODAL_DOMAIN_CONNECTION]: DomainConnectionModal,
		[MODAL_EDIT_ONLINE_STORE]: EditOnlineStoreModal,
		[MODAL_ADD_BLOCK]: AddBlockModal,
		[MODAL_ADD_PAGE]: AddPageModal,
		[MODAL_BLOG_POST_SETTINGS]: BlogPostSettingsModal,
		[MODAL_LINK_SETTINGS]: LinkSettingsModal,
		[MODAL_BLOG_SETTINGS]: BlogSettingsModal,
		[MODAL_ADD_LINK]: AddLinkModal,
		[MODAL_SUBSCRIPTION_EXPIRED]: SubscriptionExpiredModal,
		[MODAL_PUBLISH]: PublishModal,
		[MODAL_BEFORE_PUBLISH]: BeforePublishModal,
		[MODAL_PUBLISHED]: PublishedModal,
		[MODAL_CONNECT_SUBSCRIPTION]: ConnectSubscriptionModal,
		[MODAL_ASSET_MANAGER]: AssetManager,
		[MODAL_CHOOSE_BLOCK_PLACEMENT]: ChooseBlockPlacementModal,
		[MODAL_PUBLISHED_ROOT]: PublishedModalRoot,
		[MODAL_PUBLISHED_UPDATE_SECTION]: PublishedModalUpdateSection,
		[MODAL_PUBLISH_OPTION]: PublishModalOption,
		[MODAL_SYSTEM_DIALOG]: SystemDialogModal,
		[MODAL_UNSAVED_CHANGES]: UnsavedChangesModal,
		[MODAL_ECOMMERCE_UPGRADE_PLAN]: UpgradePlanEcommerce,
		[MODAL_DEFAULT]: DefaultModal,
		[MODAL_BUSINESS_SUBSCRIPTION]: BusinessSubscriptionModal,
		[MODAL_ACTIVE_SUBSCRIPTION]: ActiveSubscriptionModal,
		[MODAL_LEGAL_CONTENT_GENERATOR]: LegalContentGeneratorModal,
		[MODAL_GAMIFICATION_WELCOME]: GamificationWelcomeModal,
	},

	data() {
		return {
			component: null,
		};
	},

	computed: mapState('gui', [
		'activeModalName',
		'activeModalSettings',
	]),

	watch: {
		activeModalName() {
			this.component = this.activeModalName ? this.activeModalName : null;
		},
	},

	mounted() {
		const queryModalName = this.$route.query[OPEN_MODAL_QUERY_PARAM];

		if (queryModalName) {
			this.openModal({
				name: queryModalName,
			});
		}
	},

	methods: mapActionsGui({
		openModal: OPEN_MODAL,
	}),
});
</script>
