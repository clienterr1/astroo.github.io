<template>
	<ZyroDrawer class="multipage-drawer">
		<div
			v-qa="'builder-sidemenu-websitemenu'"
			class="multipage-drawer-content"
		>
			<div class="multipage-drawer-content__header">
				<h2 class="multipage-drawer-content__title z-h5">
					{{ t('builder.siteMenu.title') }}
				</h2>
				<p class="multipage-drawer-content__description z-body-small">
					{{ t('builder.siteMenu.description') }}
				</p>
			</div>
			<div
				ref="content"
				class="multipage-drawer-content__content"
				:class="isDialogOpen && 'multipage-drawer-content__content--no-scroll'"
			>
				<DrawerList
					v-qa="'buildersidebar-multipage-visiblepages'"
					:navigation-items="rootEditableItems"
					:title="t('builder.siteMenu.mainNavigation')"
					:group-id="NAVIGATION_GROUP_ROOT"
					:move-callback="handleItemMove"
					@open-page-settings-popup="setActiveDrawerPageSettingsPopup"
					@edit="edit"
					@draggable-end="handleItemsSort"
					@item-click="handleItemClick"
				>
					<template #placeholder>
						<EmptyPagesBlock
							:title="t('builder.siteMenu.noMainPages')"
							:subtitle="t('builder.siteMenu.addMainPage')"
						/>
					</template>
				</DrawerList>
				<DrawerList
					:navigation-items="hiddenEditableItems"
					:title="t('builder.siteMenu.hiddenFromNavigation')"
					:group-id="NAVIGATION_GROUP_HIDDEN"
					:move-callback="handleItemMove"
					:subtitle="t('builder.siteMenu.hiddenFromNavigationDescription')"
					@open-page-settings-popup="setActiveDrawerPageSettingsPopup"
					@edit="edit"
					@draggable-end="handleItemsSort"
					@item-click="handleItemClick"
				>
					<template #placeholder>
						<EmptyPagesBlock
							:title="t('builder.siteMenu.noHiddenPages')"
							:subtitle="t('builder.siteMenu.addHiddenPages')"
						/>
					</template>
					<template #item-tooltip="{ targetRef }">
						<Popup
							v-if="isLogoHintVisible"
							:target-ref="targetRef?.$el"
							portal-selector="[data-portal='builder-preview']"
							auto-update
						>
							<div class="logo-hint">
								<div class="logo-hint__container">
									<p class="logo-hint__heading">
										{{ $t('builder.editableItemsList.hiddenLogo') }}
									</p>
									<p class="logo-hint__content">
										{{ $t('builder.editableItemsList.logoHint') }}
									</p>
									<Icon
										name="close"
										class="logo-hint__close-button"
										dimensions="20px"
										@click="closeLogoHintTooltip"
									/>
								</div>
							</div>
						</Popup>
					</template>
				</DrawerList>
			</div>
			<div class="multipage-drawer-content__footer">
				<ZyroButton
					v-qa="'builderheader-menuitemhome-addnewpage'"
					theme="outline"
					@click="openAddPageModal"
				>
					<template #icon-left>
						<Icon
							name="add"
							dimensions="16px"
						/>
					</template>
					{{ t('common.addPage') }}
				</ZyroButton>
				<div class="multipage-drawer-content__footer-right-side">
					<ZyroTooltip
						position="top"
						toggle-event="hover"
						:use-portal="false"
						content-position="absolute"
						size="small"
						:forced-position="{
							left: '-59px',
							bottom: '48px',
							'white-space': 'nowrap'
						}"
					>
						<template #trigger>
							<ZyroButton
								v-qa="'builderheader-menuitemhome-addnewfolder'"
								theme="outline"
								class="multipage-drawer-content__footer-dropdown-button"
								:title="t('common.addADropdown')"
								@click="addFolder"
							>
								<template #icon>
									<Icon
										name="playlist_add"
										dimensions="16px"
									/>
								</template>
							</ZyroButton>
						</template>
						<p class="z-body-small">
							{{ t('common.addADropdown') }}
						</p>
					</ZyroTooltip>
					<ZyroTooltip
						position="top"
						toggle-event="hover"
						:use-portal="false"
						content-position="absolute"
						size="small"
						:forced-position="{
							left: '-23px',
							bottom: '48px',
							'white-space': 'nowrap'
						}"
					>
						<template #trigger>
							<ZyroButton
								v-qa="'builderheader-menuitemhome-addnewlink'"
								theme="outline"
								:title="t('common.addLink')"
								icon="link-add"
								@click="openModal({ name: 'AddLinkModal' })"
							>
								<template #icon>
									<Icon
										name="add_link"
										dimensions="16px"
									/>
								</template>
							</ZyroButton>
						</template>
						<p class="z-body-small">
							{{ t('common.addLink') }}
						</p>
					</ZyroTooltip>
				</div>
			</div>
		</div>
		<PageSettingsPopup
			v-if="activeDrawerPageSettingsPopup"
			:key="activeDrawerPageSettingsPopup.id"
			:page-id="activeDrawerPageSettingsPopup.id"
			:open-tab="activeDrawerPageSettingsPopup.tab"
			@close="activeDrawerPageSettingsPopup = null"
		/>
	</ZyroDrawer>
</template>

<script>
import Icon from '@/components/global/Icon.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroDrawer from '@/components/global/ZyroDrawer.vue';
import ZyroTooltip from '@/components/global/ZyroTooltip.vue';

import {
	ref,
	onMounted,
	defineComponent,
	computed,
} from 'vue';
import {
	mapActions,
	useStore,
} from 'vuex';
import DrawerList from '@/components/builder-controls/multipage-drawer/DrawerList.vue';
import EmptyPagesBlock from '@/components/builder-controls/multipage-drawer/EmptyPagesBlock.vue';
import {
	mapActionsGui,
	GUI_NAMESPACE,
	OPEN_MODAL,
} from '@/store/builder/gui';
import {
	MODAL_ADD_PAGE,
	GAMIFICATION_TASK_CHANGE_LOGO,
	NAVIGATION_TYPE_PAGE,
	NAVIGATION_TYPE_LINK,
	NAVIGATION_TYPE_FOLDER,
	NAVIGATION_GROUP_ROOT,
	NAVIGATION_GROUP_HIDDEN,
} from '@/constants';
import PageSettingsPopup from '@/components/builder-modals/modals/PageSettingsPopup.vue';
import { useNavigationEditableItems } from '@/use/navigation/useNavigationEditableItems';
import { isDesktopSafari } from '@/utils/browserIdentifiers';
import { useDrawerPageSettingsPopup } from '@/use/useDrawerPageSettingsPopup';
import { useI18n } from 'vue-i18n';
import { useStorage } from '@vueuse/core';
import Popup from '@/components/global/Popup.vue';
import { useGamification } from '@/use/useGamification';
import EventLogApi from '@/api/EventLogApi';

export default defineComponent({
	components: {
		Icon,
		ZyroButton,
		ZyroDrawer,
		ZyroTooltip,
		DrawerList,
		EmptyPagesBlock,
		PageSettingsPopup,
		Popup,
	},

	setup() {
		const {
			dispatch,
			getters,
		} = useStore();
		const { t } = useI18n();
		const {
			rootEditableItems,
			hiddenEditableItems,
			handleItemsSort,
		} = useNavigationEditableItems();

		const {
			activeDrawerPageSettingsPopup,
			setActiveDrawerPageSettingsPopup,
		} = useDrawerPageSettingsPopup();
		const {
			isGamificationVisible,
			getAchievementById,
		} = useGamification();

		const hasUserSeenHiddenLogoHint = useStorage('hasUserSeenHiddenLogoHint', false);
		const isLogoHintVisible = computed(() => isGamificationVisible.value
			&& !getAchievementById(GAMIFICATION_TASK_CHANGE_LOGO)?.isCompleted
			&& hasUserSeenHiddenLogoHint.value === false
			&& getters.siteNav.every(({ isHidden }) => isHidden));

		const closeLogoHintTooltip = () => {
			hasUserSeenHiddenLogoHint.value = true;
		};

		const content = ref(null);
		const isDialogOpen = ref(false);

		const openAddPageModal = () => {
			dispatch(`${GUI_NAMESPACE}/${OPEN_MODAL}`, {
				name: MODAL_ADD_PAGE,
			});

			activeDrawerPageSettingsPopup.value = null;

			EventLogApi.logEvent({
				eventName: 'website_builder.add_page.enter',
				isHostingerEvent: true,
			});
		};

		/**
		 * This is a Safari hack!
		 *
		 * Popups in the drawer are being closed on click-outside.
		 * Modals cannot be used with <Portal>,
		 * because they must be inside <Popup/> to prevent instant closing.
		 *
		 * This breaks in Safari - when scrollbar appear on smaller screens,
		 * stacking context changes and fixed modal repositions inside drawer instead of document.
		 *
		 * There are multiple such dialogs, so to prevent massive prop drilling
		 * I just used MutationObserver to watch for DOM changes in the component ref.
		 *
		 */

		onMounted(() => {
			if (!isDesktopSafari) {
				return;
			}

			const dialogObserver = new MutationObserver(() => {
				const dialog = content.value.querySelector('.modal');

				isDialogOpen.value = !!dialog;
			});

			dialogObserver.observe(content.value, {
				subtree: true,
				childList: true,
			});
		});

		return {
			t,
			activeDrawerPageSettingsPopup,
			setActiveDrawerPageSettingsPopup,
			content,
			isDialogOpen,
			rootEditableItems,
			hiddenEditableItems,
			handleItemsSort,
			NAVIGATION_GROUP_ROOT,
			NAVIGATION_GROUP_HIDDEN,
			NAVIGATION_TYPE_PAGE,
			NAVIGATION_TYPE_LINK,
			openAddPageModal,
			isLogoHintVisible,
			closeLogoHintTooltip,
		};
	},
	methods: {
		...mapActions([
			'updateCurrentPageId',
			'mergePageData',
			'addEmptyPage',
		]),
		...mapActionsGui({
			openModal: OPEN_MODAL,
		}),
		...mapActions('navigation', [
			'setItemData',
			'addItem',
		]),
		handleItemMove({
			toId,
			item,
		}) {
			// Allow moving item (which is not a folder) without subitems to anywhere
			if (item.linkType !== NAVIGATION_TYPE_FOLDER && item.subItems.length === 0) {
				return true;
			}

			if (toId === NAVIGATION_GROUP_ROOT || toId === NAVIGATION_GROUP_HIDDEN) {
				return true;
			}

			return false;
		},
		edit(data) {
			const {
				navItemId,
				name,
				linkType,
				linkedPageId,
			} = data.newValue;

			if (linkedPageId) {
				this.mergePageData({
					pageId: linkedPageId,
					pageData: {
						name,
					},
				});
			}

			if (linkType === NAVIGATION_TYPE_LINK || linkType === NAVIGATION_TYPE_FOLDER) {
				this.setItemData({
					data: {
						navItemId,
						name,
					},
				});
			}
		},
		handleItemClick({
			linkedPageId,
			isCurrent,
		}) {
			if (linkedPageId && !isCurrent) {
				this.updateCurrentPageId(linkedPageId);
			}
		},
		addFolder() {
			this.addItem({
				item: {
					linkType: NAVIGATION_TYPE_FOLDER,
					name: this.t('common.newDropdown'),
					subItems: [],
				},
			});
		},
	},
});
</script>

<style lang="scss" scoped>
.multipage-drawer {
	overflow: visible;
}

.multipage-drawer-content {
	display: flex;
	flex-direction: column;
	height: 100%;

	&__header {
		flex: 0;
		width: 100%;
		padding: 24px 24px 0;
	}

	&__title {
		margin-bottom: 8px;
	}

	&__description {
		color: $color-gray;
	}

	&__content {
		flex: 1;
		overflow-x: hidden;
		overflow-y: auto;

		&--no-scroll {
			overflow: hidden;
		}
	}

	&__footer {
		display: flex;
		justify-content: space-between;
		width: 100%;
		padding: 16px 24px;
		margin-top: auto;
	}

	&__footer-right-side {
		display: flex;
	}

	&__footer-dropdown-button {
		margin-right: 8px;
	}
}

.logo-hint {
	position: absolute;
	width: 340px;
	padding: 12px 16px;
	background-color: #fff;
	border-radius: 8px;
	transform: translate(16px, -50%);
	box-shadow: 0 6px 14px rgba(0, 0, 0, 10%);

	&__container {
		position: relative;
	}

	&__heading {
		font-weight: 700;
		margin-bottom: 4px;
	}

	&__content {
		line-height: 1.7;
	}

	&__close-button {
		position: absolute;
		right: 4px;
		top: 0;

		&:hover {
			cursor: pointer;
		}
	}

	&::before {
		content: "";
		position: absolute;
		top: 50%;
		left: -16px;
		width: 16px;
		height: 10px;
		border-top: 10px solid transparent;
		border-bottom: 10px solid transparent;
		border-right: 10px solid #fff;
		transform: translateY(-50%);
	}
}
</style>
