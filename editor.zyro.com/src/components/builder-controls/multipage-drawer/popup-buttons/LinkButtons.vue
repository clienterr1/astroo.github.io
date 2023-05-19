<template>
	<div>
		<ZyroButton
			class="popup-button"
			data-qa="sitemenusettingspopup-btn-linksettings"
			@click="openLinkSettingsModal(), toggle()"
		>
			<template #icon-left>
				<Icon
					name="settings"
					dimensions="16px"
				/>
			</template>
			{{ $t('common.linkSettings') }}
		</ZyroButton>
		<ZyroButton
			class="popup-button"
			data-qa="sitemenusettingspopup-btn-rename"
			@click="openLinkSettingsModal(), toggle()"
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
				:title="$t('builder.deletePageModal.linkTitle')"
				:primary-button-text="$t('common.cancel')"
				:secondary-button-text="$t('common.delete')"
				secondary-button-color="warning"
				class="delete-modal"
				@click-primary="isDeleteModalShown = false, toggle()"
				@click-secondary="remove"
				@close="isDeleteModalShown = false, toggle()"
			>
				<p class="z-body">
					{{ $t('builder.deletePageModal.text') }}
					<span class="z-body z-body--strong">{{ item.name }}</span>?
				</p>
			</SystemDialogModal>
		</Teleport>
	</div>
</template>

<script>
import Icon from '@/components/global/Icon.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';

import { mapActions } from 'vuex';

import DropdownControlButtons from '@/components/builder-controls/multipage-drawer/popup-buttons/-partials/DropdownControlButtons.vue';
import HideItemButton from '@/components/builder-controls/multipage-drawer/popup-buttons/-partials/HideItemButton.vue';

import SystemDialogModal from '@/components/builder-modals/modals/SystemDialogModal.vue';
import {
	mapActionsGui,
	OPEN_MODAL,
} from '@/store/builder/gui';

import { defineComponent } from 'vue';

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

	data() {
		return {
			isDeleteModalShown: false,
		};
	},

	methods: {
		...mapActionsGui({
			openModal: OPEN_MODAL,
		}),
		...mapActions('navigation', [
			'duplicateItem',
			'removeItem',
		]),
		openLinkSettingsModal() {
			this.openModal({
				name: 'LinkSettingsModal',
				settings: {
					itemId: this.item.navItemId,
					pageName: this.item.name,
				},
			});
		},
		duplicate() {
			this.duplicateItem({
				itemId: this.item.navItemId,
			});
		},
		remove() {
			this.removeItem({
				itemId: this.item.navItemId,
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
