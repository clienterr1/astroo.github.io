<template>
	<div
		v-if="allowEditing"
		class="edit-actions"
	>
		<template v-if="!isLinkedBlockHidden">
			<div
				v-if="isSlideshow"
				data-qa="builder-section-btn-editslideshow"
				class="edit-actions__button edit-actions__slideshow-buttons-container"
			>
				<ZyroButton @click="previousSlideshowSlide">
					<template #icon>
						<ZyroSvgDeprecated
							name="chevron"
							direction="left"
						/>
					</template>
				</ZyroButton>
				<ZyroButton
					class="edit-actions__button-slideshow-manage"
					:is-disabled="isDemoMode"
					@click="openSlideshowSettings"
				>
					<span class="z-body-small">{{ slideshowSlideName }}</span>
				</ZyroButton>
				<ZyroButton @click="nextSlideshowSlide">
					<template #icon>
						<ZyroSvgDeprecated
							name="chevron"
							direction="right"
						/>
					</template>
				</ZyroButton>
			</div>
			<ZyroButton
				v-if="blockType === 'BlockEcwidStore'"
				class="edit-actions__button"
				data-qa="builder-section-btn-managestore"
				theme="editor"
				:title="$t('builder.editStore.title')"
				@click="openStoreSettings"
			>
				{{ $t('builder.editStore.title') }}
			</ZyroButton>
			<ZyroButton
				v-if="isBlockEcommerceProduct && !isBlockInEcommerceProductPage(blockId)"
				class="edit-actions__button"
				data-qa="builder-section-btn-assignproduct"
				theme="editor"
				:title="$t('builder.zyroEcommerceAssignProduct')"
				@click="openBlockAssignProduct"
			>
				{{ $t('builder.zyroEcommerceAssignProduct') }}
			</ZyroButton>
			<ZyroButton
				v-if="isBlockEcommerceProductList"
				class="edit-actions__button"
				data-qa="builder-section-btn-manageproducts"
				theme="editor"
				:title="$t('builder.ecommerceManageProducts')"
				@click="handleEcommerceManageButtonClick"
			>
				{{ $t('builder.ecommerceManageProducts') }}
			</ZyroButton>
			<ZyroButton
				v-if="blockType === 'BlockBlogHeader'"
				class="edit-actions__button"
				data-qa="builder-section-btn-changeposttitle"
				theme="editor"
				@click="openBlogPostSettings"
			>
				{{ $t('builder.editBlockButton.changePostTitle') }}
			</ZyroButton>
			<ZyroButton
				v-if="allowEditBackground"
				ref="buttonEditBackground"
				class="edit-actions__button"
				data-qa="builder-section-btn-changebackground"
				theme="editor"
				@click="openBlockBackground"
			>
				{{ $t('builder.editBlockButton.changeBackground') }}
			</ZyroButton>
			<ZyroButton
				v-if="blockType === 'BlockImageSlideshow' && !isDemoMode"
				class="edit-actions__button"
				data-qa="builder-section-btn-changeslides"
				theme="editor"
				@click="isSlideshowModalShown = true"
			>
				{{ $t('builder.editBlockButton.changeSlides') }}
			</ZyroButton>
			<Teleport
				v-if="isSlideshowModalShown"
				to="body"
			>
				<AssetManager
					is-slideshow
					:visible-categories="[ASSETS_CATEGORY_IMAGE]"
					:slideshow-id="blockId"
					@select-image="addSlidesToSlideshow([$event])"
					@select-images="addSlidesToSlideshow"
					@close="isSlideshowModalShown = false"
				/>
			</Teleport>

			<template v-if="isBlockNavigation">
				<ZyroButton
					v-qa="'builder-section-btn-editnavigation'"
					class="edit-actions__button"
					theme="editor"
					:title="$t('builder.editBlockButton.editNavigation')"
					@click="openDrawer({ id: DRAWER_MULTI_PAGE })"
				>
					{{ $t('builder.editBlockButton.editNavigation') }}
				</ZyroButton>
				<ZyroButton
					v-qa="'builder-section-btn-changelogo'"
					class="edit-actions__button"
					theme="editor"
					:title="$t('builder.editBlockButton.changeLogo')"
					@click="$emit('edit-block', { tabId: 'logo' })"
				>
					{{ $t('builder.editBlockButton.changeLogo') }}
				</ZyroButton>
				<ControlsTooltip
					v-if="isSiteWithStore"
					:title="$t('builder.editBlockButton.editShoppingCart')"
				>
					<ZyroButton
						v-qa="'builder-section-btn-editcart'"
						class="edit-actions__button"
						theme="editor"
						:title="$t('builder.editBlockButton.editShoppingCart')"
						@click="$emit('edit-block', { tabId: 'cart' })"
					>
						<template #icon>
							<Icon
								name="shopping_bag"
								dimensions="16px"
							/>
						</template>
					</ZyroButton>
				</ControlsTooltip>
				<ControlsTooltip :title="$t('builder.editBlockButton.editStyles')">
					<ZyroButton
						v-qa="'builder-section-btn-editstyles'"
						class="edit-actions__button"
						theme="editor"
						icon="styles-brush"
						:title="$t('builder.editBlockButton.editStyles')"
						@click="$emit('edit-block', { tabId: 'style' })"
					>
						<template #icon>
							<Icon
								name="brush"
								dimensions="16px"
							/>
						</template>
					</ZyroButton>
				</ControlsTooltip>
			</template>

			<ControlsTooltip :title="title">
				<ZyroButton
					class="edit-actions__button"
					data-qa="builder-section-btn-settings"
					theme="editor"
					icon="settings"
					:title="title"
					@click="openBlockSettings"
				>
					<template #icon>
						<Icon
							name="settings"
							dimensions="16px"
						/>
					</template>
				</ZyroButton>
			</ControlsTooltip>
			<ControlsTooltip
				v-if="allowDuplication"
				:title="$t('common.duplicate')"
			>
				<ZyroButton
					class="edit-actions__button"
					data-qa="builder-sectionedit-buttonduplicate"
					theme="editor"
					:title="$t('common.duplicate')"
					@click="$emit('duplicate-block')"
				>
					<template #icon>
						<Icon
							name="content_copy"
							dimensions="16px"
						/>
					</template>
				</ZyroButton>
			</ControlsTooltip>

			<ZyroButton
				v-if="allowSorting"
				class="edit-actions__button"
				data-qa="builder-sectionedit-buttonsort"
				theme="editor"
				title="Sort"
				@click="$emit('sort-block-components')"
			>
				<template #icon>
					<Icon
						name="loop"
						dimensions="16px"
					/>
				</template>
			</ZyroButton>

			<template v-if="isReorderingAllowed">
				<ControlsTooltip
					:title="$t('builder.editBlockButton.moveUp')"
				>
					<ZyroButton
						v-qa="'builder-section-btn-moveup'"
						class="edit-actions__button"
						theme="editor"
						:title="$t('builder.editBlockButton.moveSectionUp')"
						:disabled="!isMovingBlockUpAllowed"
						@click="$emit('move-block-up')"
					>
						<template #icon>
							<Icon
								name="arrow_upward"
								dimensions="16px"
							/>
						</template>
					</ZyroButton>
				</ControlsTooltip>
				<ControlsTooltip
					:title="$t('builder.editBlockButton.moveDown')"
				>
					<ZyroButton
						v-qa="'builder-section-btn-movedown'"
						class="edit-actions__button"
						theme="editor"
						:title="$t('builder.editBlockButton.moveSectionDown')"
						:disabled="!isMovingBlockDownAllowed"
						@click="$emit('move-block-down')"
					>
						<template #icon>
							<Icon
								name="arrow_downward"
								dimensions="16px"
							/>
						</template>
					</ZyroButton>
				</ControlsTooltip>
			</template>

			<ControlsTooltip
				v-if="areDefaultControlsShown"
				:title="$t('builder.editBlockButton.hideShow')"
			>
				<VisibilityControls
					v-if="areDefaultControlsShown"
					class="edit-actions__button"
					:is-hidden-desktop="isHiddenDesktop"
					:is-hidden-mobile="isHiddenMobile"
					@set-desktop-visibility="setBlockDesktopHidden"
					@set-mobile-visibility="setBlockMobileHidden"
				/>
			</ControlsTooltip>
			<ControlsTooltip
				v-if="allowRemoval"
				:title="$t('common.delete')"
			>
				<ZyroButton
					v-if="allowRemoval"
					class="edit-actions__button"
					data-qa="builder-sectionedit-buttondelete"
					theme="editor"
					:title="$t('common.delete')"
					@click="removeBlock(false)"
				>
					<template #icon>
						<Icon
							name="delete"
							dimensions="16px"
						/>
					</template>
				</ZyroButton>
			</ControlsTooltip>
			<ControlsTooltip
				v-if="areDefaultControlsShown"
				:title="$t('common.more')"
			>
				<ZyroButton
					ref="contextMenuButtonRef"
					class="edit-actions__button"
					data-qa="builder-sectionedit-buttoncontextmenu"
					theme="editor"
					:title="$t('builder.contextMenuTitle')"
					@click="setContextMenuVisibility({ isOpen: !isContextMenuWithTriggerActive })"
				>
					<template #icon>
						<Icon
							name="more_horiz"
							dimensions="18px"
						/>
					</template>
				</ZyroButton>
			</ControlsTooltip>
		</template>
		<ZyroPopup
			v-if="showLinkedActions"
			type="editor"
			:popper-options="{
				placement: 'bottom-start' ,
				modifiers: [
					{
						name: 'offset',
						options: {
							offset: [
								0,
								4,
							],
						},
					},
				],
			}"
			:show-close-button="false"
		>
			<template #trigger="{ toggle }">
				<ControlsTooltip :title="$t('common.hide')">
					<ZyroButton
						data-qa="builder-sectionedit-buttonlinked"
						theme="primary"
						color="plump-purple"
						:title="$t('common.hide')"
						@click="toggle"
					>
						<template #icon>
							<Icon
								name="link"
								dimensions="16px"
							/>
						</template>
					</ZyroButton>
				</ControlsTooltip>
			</template>
			<div class="edit-actions__hide-block">
				<ZyroButton
					@click="$emit('toggle-linked-block', 'footer', false, isLinkedBlockHidden)"
				>
					<template #icon-left>
						<Icon
							:name="isLinkedBlockHidden ? 'visibility' : 'visibility_off'"
							dimensions="16px"
						/>
					</template>

					{{ isLinkedBlockHidden ?
						$t('builder.globalBlock.showOnSingle') : $t('builder.globalBlock.hideOnSingle') }}
				</ZyroButton>
				<ZyroButton
					@click="$emit('toggle-linked-block', 'footer', true, true)"
				>
					<template #icon-left>
						<Icon
							name="visibility_off"
							dimensions="16px"
						/>
					</template>
					{{ $t('builder.globalBlock.hideOnAll') }}
				</ZyroButton>
				<ZyroButton
					@click="$emit('toggle-linked-block', 'footer', true, false)"
				>
					<template #icon-left>
						<Icon
							name="visibility"
							dimensions="16px"
						/>
					</template>
					{{ $t('builder.globalBlock.showOnAll') }}
				</ZyroButton>
			</div>
		</ZyroPopup>
		<SystemDialogModal
			v-if="showRemoveWarning"
			:title="$t('builder.editBlockButton.deleteLinkedSection')"
			:primary-button-text="$t('common.delete')"
			:secondary-button-text="$t('common.cancel')"
			@click-primary="removeBlock(true)"
			@click-secondary="showRemoveWarning = false"
			@close="showRemoveWarning = false"
		>
			{{ $t('builder.editBlockButton.removeWarningText') }}
		</SystemDialogModal>
		<ContextMenuLayoutBlock
			v-if="isContextMenuWithTriggerActive"
			is-enabled
			:is-pasting-allowed="isPastingAllowed"
			:layout-elements="layoutElements"
			:block-id="blockId"
			:trigger-ref="contextMenuButtonRef?.$el"
			@close-context-menu="setContextMenuVisibility({ isOpen: false })"
		/>
	</div>
</template>

<script>
import ContextMenuLayoutBlock from '@/components/context-menu/ContextMenuLayoutBlock.vue';

import {
	computed,
	defineComponent,
	ref,
	watch,
} from 'vue';
import {
	useStore,
	mapState,
	mapGetters,
	mapActions,
} from 'vuex';
import { getMapValue } from '@zyro-inc/site-modules/utils/object';
import AssetManager from '@/components/builder-modals/modals/AssetManager.vue';
import {
	ASSETS_CATEGORY_IMAGE,
	DRAWER_MULTI_PAGE,
	DRAWER_MULTILINGUAL,
	DRAWER_MANAGE_STORE,
} from '@/constants';
import Icon from '@/components/global/Icon.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroPopup from '@/components/global/ZyroPopup.vue';
import ControlsTooltip from '@/components/ControlsTooltip.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';
import EventLogApi from '@/api/EventLogApi';
import { useEditBlockSlideshow } from '@/components/builder-controls/edit-block-slideshow/use/useEditBlockSlideshow';
import {
	ALLOWED_DUPLICATION_BLOCK_TYPES,
	ALLOWED_DUPLICATION_IDS,
	ALLOWED_DUPLICATION_SLOTS,
	ALLOWED_EDIT_BACKGROUND_BLOCK_TYPES,
	ALLOWED_EDITABLE_BLOCK_TYPES,
	ALLOWED_LINKED_ACTIONS_SLOTS,
	ALLOWED_MOVE_UP_DOWN_BLOCK_TYPES,
	ALLOWED_MOVE_UP_DOWN_BLOCK_SLOTS,
	ALLOWED_REMOVABLE_BLOCK_TYPES,
	SLOTS_WITH_REMOVE_WARNING,
} from '@/components/builder-controls/editBlockButtonConstants';
import SystemDialogModal from '@/components/builder-modals/modals/SystemDialogModal.vue';
import VisibilityControls from '@/components/builder-controls/VisibilityControls.vue';
import { STORE_MANAGER_ROUTE } from '@/constants/routes';
import {
	mapActionsGui,
	OPEN_DRAWER,
	OPEN_MODAL,
	CLOSE_MODAL,
} from '@/store/builder/gui';
import { useRedirects } from '@/use/useRedirects';
import { useImageSlideshow } from '@zyro-inc/site-modules/components/blocks/slideshow/useImageSlideshow';
import { useI18n } from 'vue-i18n';
import { isHostingerBrand } from '@/utils/isHostingerBrand';
import { useBlockLayout } from '@zyro-inc/site-modules/components/blocks/layout/useBlockLayout';
import { useLayoutContextMenu } from '@/components/context-menu/useLayoutContextMenu';
import { useContextMenu } from '@/components/context-menu/useContextMenu';

export default defineComponent({
	components: {
		Icon,
		ZyroButton,
		ZyroPopup,
		ControlsTooltip,
		ZyroSvgDeprecated,
		SystemDialogModal,
		VisibilityControls,
		AssetManager,
		ContextMenuLayoutBlock,
	},
	props: {
		blockType: {
			type: String,
			required: true,
		},
		blockSlot: {
			type: String,
			required: true,
		},
		blockId: {
			type: String,
			required: true,
		},
		isLinkedBlockHidden: {
			type: Boolean,
			default: false,
		},
		isMovingBlockUpAllowed: {
			type: Boolean,
			required: true,
		},
		isMovingBlockDownAllowed: {
			type: Boolean,
			required: true,
		},
	},
	emits: [
		'remove-block',
		'edit-block',
	],
	setup(props, context) {
		const { getters } = useStore();
		const { slideshowRefs } = useImageSlideshow();
		const { t } = useI18n();
		const {
			currentSlideshowSlideName,
			goToPreviousSlideInCurrentActiveSlideshow,
			goToNextSlideInCurrentActiveSlideshow,
		} = useEditBlockSlideshow(props, context);
		const { redirectToEcommerceProducts } = useRedirects();
		const {
			selectedLayoutBlockId,
			copiedElementId,
		} = useLayoutContextMenu();
		const {
			mousePositionX,
			mousePositionY,
			isContextMenuWithTriggerActive,
		} = useContextMenu();

		const currentBlock = computed(() => getters.currentBlock);
		const siteElements = computed(() => getters.siteElements);
		const isPastingAllowed = computed(() => !!siteElements.value[copiedElementId.value]);

		const { layoutElements } = useBlockLayout({
			blockData: currentBlock,
			siteElements,
			shouldBuildResponsive: false,
		});

		const isSlideshowModalShown = ref(false);
		const contextMenuButtonRef = ref(null);

		const slideshowSlideName = computed(() => {
			if (props.blockType === 'BlockImageSlideshow') {
				if (slideshowRefs.value[props.blockId].slideCount === 0) {
					return t('common.noSlides');
				}

				return `${t('common.slide')} ${slideshowRefs.value[props.blockId].currentSlideNumber}`;
			}

			return currentSlideshowSlideName;
		});
		const nextSlideshowSlide = () => {
			if (props.blockType === 'BlockImageSlideshow') {
				const slideshow = slideshowRefs.value[props.blockId];

				if (slideshow.canSlideToNext) {
					slideshow.slideToNext();
				}

				return;
			}

			goToNextSlideInCurrentActiveSlideshow();
		};

		const previousSlideshowSlide = () => {
			if (props.blockType === 'BlockImageSlideshow') {
				const slideshow = slideshowRefs.value[props.blockId];

				if (slideshow.canSlideToPrevious) {
					slideshow.slideToPrevious();
				}

				return;
			}

			goToPreviousSlideInCurrentActiveSlideshow();
		};

		const addSlidesToSlideshow = (slides) => {
			slideshowRefs.value[props.blockId].addSlides(slides);
		};

		const setContextMenuVisibility = ({ isOpen }) => {
			selectedLayoutBlockId.value = isOpen ? props.blockId : null;
			isContextMenuWithTriggerActive.value = isOpen;
			mousePositionX.value = null;
			mousePositionY.value = null;
		};

		watch(() => props.blockId, (newBlockId, oldBlockId) => {
			if (isContextMenuWithTriggerActive.value && newBlockId !== oldBlockId) {
				selectedLayoutBlockId.value = newBlockId;
			}
		});

		return {
			isContextMenuWithTriggerActive,
			isSlideshowModalShown,
			isPastingAllowed,
			addSlidesToSlideshow,
			nextSlideshowSlide,
			previousSlideshowSlide,
			slideshowRefs,
			slideshowSlideName,
			redirectToEcommerceProducts,
			setContextMenuVisibility,
			layoutElements,
			selectedLayoutBlockId,
			contextMenuButtonRef,
		};
	},
	data() {
		return {
			showRemoveWarning: false,
			DRAWER_MULTI_PAGE,
			DRAWER_MULTILINGUAL,
			ASSETS_CATEGORY_IMAGE,
		};
	},
	computed: {
		...mapState([
			'currentPageId',
			'isDemoMode',
		]),
		...mapGetters(['siteBlocks']),
		...mapGetters('flags', ['isLayoutOnly']),
		...mapGetters('gui', ['isMobileMode']),
		...mapGetters('ecwid', ['isLocaleWithEcwid']),
		...mapGetters('ecommerce', [
			'isLocaleWithEcommerceItems',
			'isBlockInEcommerceProductPage',
			'isBlockSingleInEcommerceProductPage',
		]),
		...mapGetters('subscription', [
			'hasActiveEcommerceSubscription',
			'hasExpiredOrActiveUnassignedEcommerceSubscription',
		]),
		isSlideshow() {
			return [
				'BlockSlideshow',
				'BlockImageSlideshow',
			].includes(this.blockType);
		},
		isBlockNavigation() {
			return this.blockType === 'BlockNavigation';
		},
		isBlockEcommerceProduct() {
			return this.blockType === 'BlockEcommerceProduct';
		},
		isBlockEcommerceProductList() {
			return this.blockType === 'BlockEcommerceProductList';
		},
		areDefaultControlsShown() {
			return ![
				'BlockNavigation',
				'BlockEcommerceProduct',
				'BlockEcommerceProductList',
				'BlockBlogList',
				'BlockImageSlideshow',
				'BlockBlogHeader',
			].includes(this.blockType) && this.blockSlot !== 'footer' && this.isLayoutOnly;
		},
		title() {
			const titleMap = {
				BlockNavigation: this.$t('builder.editBlockButton.editHeader'),
				BlockBlogList: this.$t('builder.editBlockButton.editBlogList'),
				BlockBlogHeader: this.$t('builder.editBlockButton.editBlogHeader'),
				default: this.$t('builder.editBlockButton.editSection'),
			};

			return getMapValue(this.blockType, titleMap);
		},
		allowEditing() {
			return getMapValue(this.blockType, ALLOWED_EDITABLE_BLOCK_TYPES);
		},
		allowRemoval() {
			if (this.isBlockEcommerceProduct) {
				return !this.isBlockInEcommerceProductPage(this.blockId);
			}

			return getMapValue(this.blockType, ALLOWED_REMOVABLE_BLOCK_TYPES);
		},
		isReorderingAllowed() {
			if (this.blockSlot) {
				return getMapValue(this.blockSlot, ALLOWED_MOVE_UP_DOWN_BLOCK_SLOTS);
			}

			if (this.isBlockEcommerceProduct) {
				return !this.isBlockSingleInEcommerceProductPage(this.blockId);
			}

			return getMapValue(this.blockType, ALLOWED_MOVE_UP_DOWN_BLOCK_TYPES);
		},
		allowEditBackground() {
			return getMapValue(this.blockType, ALLOWED_EDIT_BACKGROUND_BLOCK_TYPES);
		},
		allowDuplication() {
			if (this.isBlockEcommerceProduct) {
				return !this.isBlockInEcommerceProductPage(this.blockId);
			}

			return getMapValue(this.blockType, ALLOWED_DUPLICATION_BLOCK_TYPES)
			&& getMapValue(this.blockId, ALLOWED_DUPLICATION_IDS)
			&& getMapValue(this.blockSlot, ALLOWED_DUPLICATION_SLOTS);
		},
		showLinkedActions() {
			return getMapValue(this.blockSlot, ALLOWED_LINKED_ACTIONS_SLOTS);
		},
		allowSorting() {
			return (this.blockType === 'BlockGrid' && this.isMobileMode);
		},
		isSiteWithStore() {
			return this.isLocaleWithEcwid || this.isLocaleWithEcommerceItems;
		},
		isHiddenDesktop() {
			return this.siteBlocks[this.blockId].desktop?.isHidden || false;
		},
		isHiddenMobile() {
			return this.siteBlocks[this.blockId].mobile?.isHidden || false;
		},
	},
	methods: {
		...mapActionsGui({
			openModal: OPEN_MODAL,
			closeModal: CLOSE_MODAL,
			openDrawer: OPEN_DRAWER,
		}),
		...mapActions('subscription', ['handleExpiredOrActiveUnassignedSubscription']),
		...mapActions(['updateBlockData']),
		setBlockDesktopHidden(value) {
			this.updateBlockData({
				blockId: this.blockId,
				blockData: {
					desktop: {
						isHidden: value,
					},
				},
				pushToHistory: true,
				merge: true,
			});
		},
		setBlockMobileHidden(value) {
			this.updateBlockData({
				blockId: this.blockId,
				blockData: {
					mobile: {
						isHidden: value,
					},
				},
				pushToHistory: true,
				merge: true,
			});
		},
		removeBlock(forceRemove) {
			if (getMapValue(this.blockSlot, SLOTS_WITH_REMOVE_WARNING) && !forceRemove) {
				this.showRemoveWarning = true;
			} else {
				this.$emit('remove-block');
			}
		},
		async openStoreSettings() {
			EventLogApi.logEvent({
				eventName: 'builder.storefront.click_button(manage_store)',
			});
			if (this.hasActiveEcommerceSubscription) {
				this.$router.push({
					name: STORE_MANAGER_ROUTE,
				});
			} else if (this.hasExpiredOrActiveUnassignedEcommerceSubscription) {
				this.handleExpiredOrActiveUnassignedSubscription({
					subscriptionConnectedCallback: () => {
						this.closeModal();
						this.$router.push({
							name: STORE_MANAGER_ROUTE,
						});
					},
					shouldShowOnlyEcommerceSubscriptions: true,
				});
			} else {
				this.openModal({
					name: 'EditOnlineStoreModal',
				});
			}
		},
		openBlockSettings() {
			if (this.blockType === 'BlockSlideshow') {
				this.$emit('edit-block', {
					startingPopupComponent: 'EditBlockSlideshowSettingsTabs',
					tabId: 'style',
				});
			} else if (this.blockType === 'BlockImageSlideshow') {
				this.$emit('edit-block', {
					startingPopupComponent: 'EditBlockImageSlideshowSettingsTabs',
					tabId: 'style',
				});
			} else {
				this.$emit('edit-block');
			}
		},
		openSlideshowSettings() {
			if (this.blockType === 'BlockSlideshow') {
				this.$emit('edit-block', {
					startingPopupComponent: 'EditBlockSlideshowSettingsTabs',
					tabId: 'slides',
				});

				return;
			}

			this.isSlideshowModalShown = true;
		},
		openBlogPostSettings() {
			this.openModal({
				name: 'BlogPostSettingsModal',
				settings: {
					blogPostId: this.currentPageId,
				},
			});
		},
		openBlockBackground() {
			if (this.blockType === 'BlockSlideshow') {
				this.$emit('edit-block', {
					startingPopupComponent: 'EditBlockSlideshowSlideBackground',
				});
			} else {
				this.$emit('edit-block', {
					tabId: 'background',
				});
			}
		},
		openBlockAssignProduct() {
			this.$emit('edit-block', {
				tabId: 'ecommerce',
			});
		},
		handleEcommerceManageButtonClick() {
			EventLogApi.logEvent({
				eventName: 'website_builder.ecomm_store.enter',
				eventProperties: {
					location: 'section',
				},
				isHostingerEvent: isHostingerBrand,
			});

			this.openDrawer({
				id: DRAWER_MANAGE_STORE,
			});
		},
	},
});
</script>

<style lang="scss" scoped>
.edit-actions {
	display: flex;
	justify-content: center;

	&__button {
		flex-shrink: 0;

		&:not(:last-child) {
			margin-right: 8px;
		}
	}

	&__button-icon {
		margin-right: 8px;
	}

	&__hide-block {
		display: flex;
		flex-direction: column;
	}

	&__slideshow-buttons-container {
		display: flex;
		background-color: $color-light;
		border-width: 2px;
		border-radius: 100px;
		box-shadow: $box-shadow;
		transition-property:
			border-color,
			box-shadow,
			color;
	}

	&__button-slideshow-manage {
		padding: 0 12px;
	}

	@media screen and (max-width: $media-mobile) {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
	}
}
</style>
