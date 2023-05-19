<template>
	<div>
		<ZyroButton
			v-if="!item.isHomepage"
			class="popup-button"
			data-qa="sitemenusettingspopup-btn-setashomepage"
			@click="setAsHomepage(), toggle()"
		>
			<template #icon-left>
				<Icon
					name="home"
					dimensions="16px"
				/>
			</template>
			{{ $t('common.setAsHomepage') }}
		</ZyroButton>
		<ZyroButton
			class="popup-button"
			data-qa="sitemenusettingspopup-btn-pagesettings"
			@click="openPageSettingsPopup(TAB_GENERAL), toggle()"
		>
			<template #icon-left>
				<Icon
					name="settings"
					dimensions="16px"
				/>
			</template>
			{{ $t('builder.pageSettingsModal.buttonTitle') }}
		</ZyroButton>
		<ZyroButton
			class="popup-button"
			data-qa="sitemenusettingspopup-btn-pageSeoSettings"
			@click="openPageSettingsPopup(TAB_SEO), toggle()"
		>
			<template #icon-left>
				<Icon
					name="search"
					dimensions="16px"
				/>
			</template>
			{{ $t('builder.pageSettingsModal.buttonSeoTitle') }}
		</ZyroButton>
		<ZyroButton
			class="popup-button"
			data-qa="sitemenusettingspopup-btn-PagePasswordSettings"
			@click="openPageSettingsPopup(TAB_PASSWORD_PROTECTION), toggle()"
		>
			<template #icon-left>
				<Icon
					name="vpn_key"
					dimensions="16px"
				/>
			</template>
			{{ $t('common.password') }}
		</ZyroButton>
		<ZyroButton
			class="popup-button"
			data-qa="sitemenusettingspopup-btn-rename"
			@click="openPageSettingsPopup(TAB_GENERAL), toggle()"
		>
			<template #icon-left>
				<Icon
					name="edit"
					dimensions="16px"
				/>
			</template>
			{{ $t('common.rename') }}
		</ZyroButton>
		<DropdownControlButtons :item="item" />
		<ZyroButton
			class="popup-button"
			data-qa="sitemenusettingspopup-btn-duplicate"
			@click="duplicate(), toggle()"
		>
			<template #icon-left>
				<Icon
					name="copy"
					dimensions="16px"
				/>
			</template>
			{{ $t('common.duplicate') }}
		</ZyroButton>
		<HideItemButton
			v-if="item.isRootItem"
			:item="item"
			:toggle="toggle"
		/>
		<ZyroButton
			v-if="!item.isHomepage"
			class="popup-button"
			data-qa="sitemenusettingspopup-btn-delete"
			@click="isDeleteModalShown = true"
		>
			<template #icon-left>
				<Icon
					name="delete"
					dimensions="16px"
				/>
			</template>
			{{ $t('common.delete') }}
		</ZyroButton>
		<Teleport
			v-if="isDeleteModalShown"
			to="body"
		>
			<SystemDialogModal
				:title="$t('builder.deletePageModal.title')"
				:primary-button-text="$t('common.cancel')"
				:secondary-button-text="$t('common.delete')"
				secondary-button-color="warning"
				class="delete-modal"
				@click-primary="isDeleteModalShown = false, toggle()"
				@click-secondary="removeItem"
				@close="isDeleteModalShown = false, toggle()"
			>
				<p class="z-body">
					{{ $t('builder.deletePageModal.text') }}
					<span class="z-body z-body--strong">{{ item.name }}</span>?
				</p>
				<p class="z-body">
					{{ $t('builder.deletePageModal.subText') }}
				</p>
			</SystemDialogModal>
		</Teleport>
	</div>
</template>

<script>
import Icon from '@/components/global/Icon.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';

import {
	mapState,
	mapGetters,
	mapMutations,
	mapActions,
} from 'vuex';

import DropdownControlButtons from '@/components/builder-controls/multipage-drawer/popup-buttons/-partials/DropdownControlButtons.vue';
import HideItemButton from '@/components/builder-controls/multipage-drawer/popup-buttons/-partials/HideItemButton.vue';

import SystemDialogModal from '@/components/builder-modals/modals/SystemDialogModal.vue';
import { generateRandomId } from '@/utils/generateRandomId';
import {
	TAB_SEO,
	TAB_GENERAL,
	TAB_PASSWORD_PROTECTION,
} from '@zyro-inc/site-modules/constants';

import { defineComponent } from 'vue';
import {
	mapActionsGui,
	OPEN_DRAWER,
} from '@/store/builder/gui';
import { DRAWER_PAGE_SEO } from '@/constants';

export default defineComponent({
	components: {
		Icon,
		ZyroButton,
		DropdownControlButtons,
		HideItemButton,
		SystemDialogModal,
	},

	props: {
		item: {
			type: Object,
			required: true,
		},
		toggle: {
			type: Function,
			default: () => ({}),
		},
	},
	emits: ['open-page-settings-popup'],
	setup() {
		return {
			TAB_SEO,
			TAB_GENERAL,
			TAB_PASSWORD_PROTECTION,
		};
	},
	data() {
		return {
			isDeleteModalShown: false,
		};
	},
	computed: {
		...mapState(['website']),
		...mapGetters([
			'homePageId',
			'defaultPages',
		]),
	},

	methods: {
		...mapMutations(['setWebsiteMeta']),
		...mapActions([
			'duplicatePage',
			'removePage',
			'mergePageData',
			'updateHomePage',
		]),
		...mapActions(['updateInternalLinks']),
		...mapActionsGui({
			openDrawer: OPEN_DRAWER,
		}),
		setAsHomepage() {
			// TODO: This should be done by a mapper.
			if (!this.defaultPages[this.homePageId]?.slug) {
				this.mergePageData({
					pageId: this.homePageId,
					pageData: {
						slug: generateRandomId(),
					},
				});
			}

			this.updateHomePage({
				pageId: this.item.linkedPageId,
			});
			this.updateInternalLinks({
				oldLink: `/${this.defaultPages[this.item.linkedPageId]?.slug}`,
				newLink: '/',
			});
		},
		openPageSettingsPopup(tab) {
			if (tab === TAB_SEO) {
				this.openDrawer({
					id: DRAWER_PAGE_SEO,
					settings: {
						pageId: this.item.linkedPageId,
					},
				});

				return;
			}

			this.$emit('open-page-settings-popup', {
				pageId: this.item.linkedPageId,
				tab: tab || TAB_GENERAL,
			});
		},
		duplicate() {
			this.duplicatePage({
				siteData: this.website,
				pageId: this.item.linkedPageId,
			});
		},
		removeItem() {
			this.updateInternalLinks({
				oldLink: `/${this.defaultPages[this.item.linkedPageId]?.slug}`,
				newLink: '',
			});

			this.removePage({
				pageId: this.item.linkedPageId,
			});

			this.isDeleteModalShown = false;

			this.toggle();
		},
	},
});
</script>

<style lang="scss" scoped>
@import "./PopupButton";

.delete-modal {
	z-index: $z-index-popup;
}
</style>
