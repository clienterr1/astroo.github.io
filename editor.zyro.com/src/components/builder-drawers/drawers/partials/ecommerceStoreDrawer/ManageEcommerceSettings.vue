<template>
	<div>
		<ZyroPopup
			class="popup"
			:popper-options="{
				placement: 'right',
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
				<ZyroButton
					v-qa="'manage-ecommerce-drawer-btn-settings'"
					theme="outline"
					class="list-button"
					:title="$t('builder.blog.blogDrawer.openModal')"
					@click.stop="toggle"
				>
					<template #icon>
						<Icon
							name="more_vert"
							dimensions="16px"
						/>
					</template>
				</ZyroButton>
			</template>
			<template #default="popup">
				<ZyroButton
					v-qa="'manage-ecommerce-popup-button-removestore'"
					theme="plain"
					:title="$t('builder.manageEcommerceRemoveStore')"
					class="popup-content-button"
					text-class="z-body-small"
					@click="openRemoveStoreModal(popup)"
				>
					<template #icon-left>
						<Icon
							name="delete"
							dimensions="16px"
						/>
					</template>
					{{ $t('builder.manageEcommerceRemoveStore') }}
				</ZyroButton>
			</template>
		</ZyroPopup>
		<Teleport
			v-if="isDeleteModalShown"
			to="body"
		>
			<SystemDialogModal
				v-qa="'blog-post-delete-modal'"
				max-width="420px"
				:title="$t('builder.manageEcommerceRemoveStore')"
				:primary-button-text="$t('common.cancel')"
				:secondary-button-text="$t('common.delete')"
				@click-primary="isDeleteModalShown = false"
				@click-secondary="handleRemoveStoreClick"
				@close="isDeleteModalShown = false"
			>
				<i18n-t
					class="z-body-small remove-store-text"
					keypath="builder.deleteOnlineStoreFromSiteModalTextAll"
					tag="p"
				>
					<span class="z-body-small z-body-small--strong">
						{{ $t('builder.deleteOnlineStoreFromSiteModalTextAllSlot') }}
					</span>
				</i18n-t>
				<p class="z-body-small">
					{{ $t('builder.deleteOnlineStoreFromSiteModalTextRestore') }}
				</p>
			</SystemDialogModal>
		</Teleport>
	</div>
</template>

<script>
import Icon from '@/components/global/Icon.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroPopup from '@/components/global/ZyroPopup.vue';

import { mapActions } from 'vuex';

import SystemDialogModal from '@/components/builder-modals/modals/SystemDialogModal.vue';
import {
	mapActionsGui,
	CLOSE_DRAWER,
} from '@/store/builder/gui';

import { defineComponent } from 'vue';
import { isHostingerBrand } from '@/utils/isHostingerBrand';
import EventLogApi from '@/api/EventLogApi';

export default defineComponent({
	components: {
		Icon,
		ZyroButton,
		ZyroPopup,
		SystemDialogModal,
	},

	data() {
		return {
			isDeleteModalShown: false,
		};
	},

	methods: {
		...mapActionsGui({
			closeDrawer: CLOSE_DRAWER,
		}),
		...mapActions('ecommerce', ['deleteEcommerceItemsFromSite']),
		openRemoveStoreModal(popup) {
			this.isDeleteModalShown = true;
			popup.toggle();
		},
		handleRemoveStoreClick() {
			EventLogApi.logEvent({
				eventName: 'website_builder.ecomm.remove',
				isHostingerEvent: isHostingerBrand,
			});

			this.deleteEcommerceItemsFromSite();
			this.closeDrawer();
		},
	},
});
</script>

<style lang="scss" scoped>
.popup-content-button {
	color: $color-primary;
}

.remove-store-text {
	margin-bottom: 16px;
}
</style>
