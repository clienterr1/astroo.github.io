<template>
	<Popup
		:target-ref="drawerDomElement"
		portal-selector="[data-portal='app']"
		auto-update
		@click-outside="closeAndDiscardChanges"
	>
		<div class="page-settings">
			<h2 class="page-settings__title">
				{{ $t('builder.pageSettingsModal.title') }}
			</h2>
			<ZyroButton
				class="page-settings__close"
				data-qa="modal-btn-close"
				:title="$t('common.close')"
				@click="closeAndDiscardChanges"
			>
				<template #icon>
					<Icon
						name="close"
						dimensions="20px"
					/>
				</template>
			</ZyroButton>
			<div class="page-settings__tabs">
				<ZyroTabs
					:tabs="tabs"
					:current-tab="currentTab"
					@update:current-tab="currentTab = $event"
				/>
			</div>
			<div class="page-settings__content">
				<PageSettingsGeneral
					v-if="currentTab.id === TAB_GENERAL"
					:page-type="pageType"
					:page-id="pageId"
					:is-item-hidden="isPageHiddenBeforeEdit"
					@set-is-item-hidden="isPageHiddenBeforeEdit = $event"
					@is-valid="error = !$event"
				/>
				<PageSettingsSocialImage
					v-if="currentTab.id === TAB_SOCIAL_IMAGE && !isPageTypeEcommerceProduct"
					:og-image-origin="ogImageOrigin"
					:og-image-path="ogImagePath"
					:og-image-alt="ogImageAlt"
					@og-image-change="handleOgImageChange"
				/>
				<PagePasswordSettings
					v-if="currentTab.id === TAB_PASSWORD_PROTECTION"
					:page-id="pageId"
					:password="pagePassword"
					:heading-text="pagePasswordHeadingText"
					:subheading-text="pagePasswordSubheadingText"
					:default-password-page-texts="defaultPasswordPageTexts"
					:button-text="pagePasswordButtonText"
					:placeholder-text="pagePasswordInputPlaceholderText"
					:back-text="pagePasswordBackText"
					:is-password-changed="isPasswordChanged"
					:password-design="pagePasswordDesign"
					:is-password-enabled="isPasswordEnabled"
					@password-change="updatePasswordValue"
					@design-change="updatePasswordDesignValue"
					@toggle-password-enable="togglePasswordEnable"
					@password-page-text-change="updatePasswordPageText"
				/>
			</div>
			<div class="page-settings__footer">
				<ZyroButton
					data-qa="pagesettings-button-cancel"
					@mousedown="closeAndDiscardChanges"
				>
					{{ $t('common.cancel') }}
				</ZyroButton>
				<ZyroButton
					theme="primary"
					:disabled="error"
					data-qa="pagesettings-button-save"
					@mousedown="handleSaveClick"
				>
					{{ $t('common.save') }}
				</ZyroButton>
			</div>
		</div>
	</Popup>
</template>

<script>
import Icon from '@/components/global/Icon.vue';
import Popup from '@/components/global/Popup.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroTabs from '@/components/global/ZyroTabs.vue';

import cloneDeep from 'lodash.clonedeep';
import {
	mapActions,
	mapGetters,
	useStore,
} from 'vuex';

import {
	TAB_PASSWORD_PROTECTION,
	PAGE_TYPE_ECOMMERCE_PRODUCT,
	PAGE_TYPE_DEFAULT,
	TAB_SOCIAL_IMAGE,
	TAB_GENERAL,
	PAGE_PASSWORD_DESIGN_TYPE_DEFAULT,
} from '@zyro-inc/site-modules/constants';
import { isHostingerBrand } from '@/utils/isHostingerBrand';

import PageSettingsGeneral from '@/components/builder-controls/page-settings/PageSettingsGeneral.vue';
import PageSettingsSocialImage from '@/components/builder-controls/page-settings/PageSettingsSocialImage.vue';
import PagePasswordSettings from '@/components/builder-controls/page-settings/PagePasswordSettings.vue';
import { BUILDER_SIDEBAR_SELECTOR } from '@/components/onboarding/onboardingSelectors';
import EventLogApi from '@/api/EventLogApi';

import {
	defineComponent,
	ref,
	computed,
} from 'vue';
import { useI18n } from 'vue-i18n';
import { SET_PAGE_DATA } from '@/store/builder';
import { generateSha256 } from '@zyro-inc/site-modules/utils/hashPassword';

export default defineComponent({
	components: {
		Icon,
		ZyroButton,
		ZyroTabs,
		PageSettingsSocialImage,
		PageSettingsGeneral,
		Popup,
		PagePasswordSettings,
	},
	props: {
		pageId: {
			type: String,
			required: true,
		},
		openTab: {
			type: String,
			default: TAB_GENERAL,
		},
	},
	emits: ['close'],
	setup(props) {
		const {
			state,
			getters,
			commit,
		} = useStore();
		const { t } = useI18n();

		const currentTab = ref(null);
		const pageData = computed(() => getters.sitePages[props.pageId]);
		const shouldPageBeNoIndexed = ref({});
		const pagePassword = ref('');
		const pagePasswordDesign = ref('');
		const isPasswordChanged = ref(false);
		const pagePasswordHeadingText = ref('');
		const pagePasswordSubheadingText = ref('');
		const pagePasswordInputPlaceholderText = ref('');
		const pagePasswordButtonText = ref('');
		const pagePasswordBackText = ref('');
		const isPasswordEnabled = ref(false);

		const defaultPasswordPageTexts = computed(() => ({
			heading: t('builder.passwordPageDefaultHeading'),
			subheading: t('builder.passwordPageDefaultSubheading'),
			inputPlaceholder: t('builder.passwordPageDefaultInputPlaceholder'),
			button: t('builder.passwordPageDefaultButtonText'),
			backText: t('builder.passwordPageDefaultBackText'),
		}));

		const updatePasswordValue = (newValue) => {
			pagePassword.value = newValue;
			isPasswordChanged.value = true;
			shouldPageBeNoIndexed.value = true;
		};

		const updatePasswordDesignValue = (newValue) => {
			pagePasswordDesign.value = newValue;
		};

		const updatePasswordPageText = ({
			newValue,
			type,
		}) => {
			if (type === 'heading') {
				pagePasswordHeadingText.value = newValue;
			}

			if (type === 'subheading') {
				pagePasswordSubheadingText.value = newValue;
			}

			if (type === 'inputPlaceholder') {
				pagePasswordInputPlaceholderText.value = newValue;
			}

			if (type === 'button') {
				pagePasswordButtonText.value = newValue;
			}

			if (type === 'backText') {
				pagePasswordBackText.value = newValue;
			}
		};

		const togglePasswordEnable = (newValue) => {
			isPasswordEnabled.value = newValue;

			if (newValue) {
				EventLogApi.logEvent({
					eventName: 'website_builder.password_setup.enabled',
					isHostingerEvent: true,
				});

				return;
			}

			EventLogApi.logEvent({
				eventName: 'website_builder.password_setup.disabled',
				isHostingerEvent: true,
			});

			pagePassword.value = '';
			pagePasswordDesign.value = PAGE_PASSWORD_DESIGN_TYPE_DEFAULT;
			pagePasswordHeadingText.value = defaultPasswordPageTexts.heading;
			pagePasswordSubheadingText.value = defaultPasswordPageTexts.subheading;
			pagePasswordInputPlaceholderText.value = defaultPasswordPageTexts.inputPlaceholder;
			pagePasswordButtonText.value = defaultPasswordPageTexts.button;
			pagePasswordBackText.value = defaultPasswordPageTexts.backText;

			const {
				passwordHeadingText,
				passwordSubheadingText,
				passwordPlaceholderText,
				passwordButtonText,
				passwordBackText,
				passwordDesign,
				password,
				...restMeta
			} = pageData.value?.meta ?? {};

			// Remove password related data from page meta data entirely
			commit(SET_PAGE_DATA, {
				pageId: props.pageId,
				locale: state.currentLocale,
				pageValue: {
					...pageData.value,
					meta: {
						...restMeta,
					},
				},
			});
		};

		return {
			currentTab,
			isPasswordChanged,
			shouldPageBeNoIndexed,
			updatePasswordValue,
			updatePasswordDesignValue,
			togglePasswordEnable,
			updatePasswordPageText,
			isPasswordEnabled,
			pagePassword,
			pagePasswordDesign,
			pagePasswordHeadingText,
			pagePasswordSubheadingText,
			pagePasswordButtonText,
			pagePasswordBackText,
			defaultPasswordPageTexts,
			pagePasswordInputPlaceholderText,
			TAB_SOCIAL_IMAGE,
			TAB_GENERAL,
			TAB_PASSWORD_PROTECTION,
		};
	},
	data() {
		return {
			pageBeforeEdit: null,
			pageNavigationItemBeforeEdit: null,
			error: false,
			isPageHiddenBeforeEdit: false,
			ogImageOrigin: null,
			ogImagePath: null,
			ogImageAlt: '',
			hasSavedChanges: false,
		};
	},
	computed: {
		...mapGetters([
			'sitePages',
			'currentPage',
		]),
		...mapGetters('navigation', ['getItemByPageId']),
		pageToEdit() {
			return this.sitePages[this.pageId];
		},
		pageType() {
			return this.sitePages[this.pageId].type;
		},
		isDefaultPage() {
			return this.pageType === PAGE_TYPE_DEFAULT;
		},
		isPageTypeEcommerceProduct() {
			return this.pageType === PAGE_TYPE_ECOMMERCE_PRODUCT;
		},
		tabs() {
			return [
				{
					id: TAB_GENERAL,
					title: this.$t('common.general'),
				},
				...(this.isPageTypeEcommerceProduct ? [] : [
					{
						id: TAB_SOCIAL_IMAGE,
						title: this.$t('common.socialImage'),
					},
				]),
				{
					id: TAB_PASSWORD_PROTECTION,
					title: 'Password',
				},
			];
		},
		pageMeta() {
			return this.pageToEdit.meta ?? {};
		},
		pageNavLink() {
			return this.getItemByPageId(this.pageId);
		},
		drawerDomElement() {
			return document.querySelector(`[data-popper-reference="${BUILDER_SIDEBAR_SELECTOR}"]`);
		},
		pageTitle() {
			if (this.isPageTypeProduct) {
				return this.pageMeta?.title ?? this.pageToEdit.name;
			}

			return this.pageMeta?.title || '';
		},
	},
	watch: {
		pageId(newPageId, previousPageId) {
			this.discardChanges(previousPageId);
			this.setInitialValues();
		},
		openTab() {
			this.setInitialTab();
		},
	},
	created() {
		this.setInitialValues();
	},
	beforeUnmount() {
		this.discardChanges(this.pageId);
	},
	methods: {
		...mapActions([
			'updateInternalLinks',
			'mergePageData',
		]),
		...mapActions('navigation', [
			'setItemData',
			'changeItemVisibility',
		]),
		setInitialTab() {
			this.currentTab = this.tabs.find(({ id }) => id === this.openTab);
		},
		setInitialValues() {
			this.setInitialTab();
			this.pageBeforeEdit = cloneDeep(this.pageToEdit);
			this.pageNavigationItemBeforeEdit = cloneDeep(this.pageNavLink);
			this.isPageHiddenBeforeEdit = !!this.pageNavLink?.isHidden;

			if (!this.isPageTypeEcommerceProduct) {
				this.ogImageOrigin = this.pageMeta.ogImageOrigin || null;
				this.ogImagePath = this.pageMeta.ogImagePath || null;
				this.ogImageAlt = this.pageMeta.ogImageAlt || '';
			}

			this.shouldPageBeNoIndexed = this.pageMeta?.noindex || false;

			// Page password related data
			this.pagePassword = this.pageMeta.password ?? '';
			this.isPasswordEnabled = !!this.pagePassword;
			this.pagePasswordDesign = this.pageMeta.passwordDesign ?? PAGE_PASSWORD_DESIGN_TYPE_DEFAULT;
			this.pagePasswordHeadingText = this.pageMeta.passwordHeadingText ?? this.defaultPasswordPageTexts.heading;
			this.pagePasswordSubheadingText = this.pageMeta.passwordSubheadingText ?? this.defaultPasswordPageTexts.subheading;
			this.pagePasswordButtonText = this.pageMeta.passwordButtonText ?? this.defaultPasswordPageTexts.button;
			this.pagePasswordInputPlaceholderText = this.pageMeta.passwordPlaceholderText ?? this.defaultPasswordPageTexts.inputPlaceholder;
			this.pagePasswordBackText = this.pageMeta.passwordBackText ?? this.defaultPasswordPageTexts.backText;
			this.isPasswordChanged = false;
		},
		handleOgImageChange({
			origin,
			path,
			alt,
		}) {
			this.ogImageOrigin = origin;
			this.ogImagePath = path;
			this.ogImageAlt = alt;
		},
		discardChanges(pageId) {
			if (this.hasSavedChanges) {
				return;
			}

			this.mergePageData({
				pageId,
				pageData: this.pageBeforeEdit,
			});

			if (this.pageNavigationItemBeforeEdit && this.isDefaultPage) {
				this.setItemData({
					data: this.pageNavigationItemBeforeEdit,
				});
			}
		},
		closeAndDiscardChanges() {
			if (this.isOnboardingStarted) return;

			this.discardChanges(this.pageId);
			this.$emit('close');
		},
		async handleSaveClick() {
			if (this.isPasswordEnabled && !this.pagePassword) {
				this.currentTab = this.tabs.find(({ id }) => id === TAB_PASSWORD_PROTECTION);
				this.isPasswordChanged = true;

				await this.$nextTick();

				// scroll to password input selected by html id password-input
				const passwordInput = document.getElementById('page-password');

				if (passwordInput) {
					passwordInput.scrollIntoView({
						behavior: 'smooth',
						block: 'center',
					});
				}

				return;
			}

			if (this.isDefaultPage && this.isPageHiddenBeforeEdit !== !!this.pageNavLink.isHidden) {
				this.changeItemVisibility({
					itemId: this.pageNavLink.navItemId,
					isHidden: this.isPageHiddenBeforeEdit,
				});
			}

			if (this.pageBeforeEdit.slug !== this.pageToEdit.slug) {
				this.updateInternalLinks({
					oldLink: `/${this.pageBeforeEdit.slug}`,
					newLink: `/${this.pageToEdit.slug}`,
				});
			}

			if (this.isPageTypeEcommerceProduct) {
				EventLogApi.logEvent({
					eventName: 'website_builder.ecomm_page_settings.saved',
					isHostingerEvent: isHostingerBrand,
				});
			}

			if (!this.isPageTypeEcommerceProduct && this.pageBeforeEdit?.meta?.ogImagePath !== this.ogImagePath) {
				this.mergePageData({
					pageId: this.pageId,
					pageData: {
						meta: {
							ogImageOrigin: this.ogImageOrigin,
							ogImagePath: this.ogImagePath,
							ogImageAlt: this.ogImageAlt,
						},
					},
				});
			}

			// Password hashing
			let hashedPassword = '';

			if (this.isPasswordEnabled) {
				hashedPassword = this.isPasswordChanged ? await generateSha256(this.pagePassword) : this.pageMeta.password;
			}

			if (this.isPasswordChanged) {
				EventLogApi.logEvent({
					eventName: 'website_builder.password_setup.saved',
					isHostingerEvent: true,
				});
			}

			this.isPasswordChanged = false;

			this.mergePageData({
				pageId: this.pageId,
				pageData: {
					meta: {
						noindex: this.shouldPageBeNoIndexed,
						passwordHeadingText: this.pagePasswordHeadingText,
						passwordSubheadingText: this.pagePasswordSubheadingText,
						passwordButtonText: this.pagePasswordButtonText,
						passwordBackText: this.pagePasswordBackText,
						passwordPlaceholderText: this.pagePasswordInputPlaceholderText,
						passwordDesign: this.pagePasswordDesign,
						password: hashedPassword,
					},
				},
			});

			this.hasSavedChanges = true;

			this.$emit('close');
		},
	},
});
</script>
<style lang="scss" scoped>
.page-settings {
	position: relative;
	display: flex;
	flex-direction: column;
	max-width: 420px;
	max-height: calc(100vh - 103px);
	cursor: default;
	background: $color-light;
	border-radius: $border-radius-large;
	box-shadow: 0 5px 5px rgba($color-dark, 0.05), 0 10px 30px rgba($color-dark, 0.2);
	transition: all 0.3s ease;

	&__title {
		padding: 16px 24px;
	}

	&__tabs {
		padding: 0 24px;
	}

	&__close {
		position: absolute;
		right: 0;
	}

	&__content {
		height: 100%;
		padding: var(--z-content-padding, 0 24px 8px 24px);
		overflow: auto;
	}

	&__footer {
		display: flex;
		justify-content: space-between;
		padding: 16px 24px;
		margin-top: auto;
		border-top: 1px solid $color-gray-border;
	}
}
</style>
