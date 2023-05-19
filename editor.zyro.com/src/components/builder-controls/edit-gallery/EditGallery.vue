<template>
	<BaseEditControls :current-tab="currentTab">
		<template #additional-buttons>
			<ZyroButton
				v-if="!isDemoMode"
				v-qa="`gallery-button-managegallery`"
				theme="editor"
				class="manage-button"
				@click="openGalleryManager"
			>
				{{ $t('builder.editGallery.manageButton') }}
			</ZyroButton>
			<ControlsTooltip :title="$t('builder.editGallery.title')">
				<ZyroButton
					v-qa="`gallery-button-settings`"
					class="settings-button"
					theme="editor"
					:title="$t('builder.editGallery.title')"
					@click="openEditPopup"
				>
					<template #icon>
						<Icon
							name="settings"
							dimensions="16px"
						/>
					</template>
				</ZyroButton>
			</ControlsTooltip>
			<Teleport
				v-if="showGalleryManager"
				to="body"
			>
				<AssetManager
					is-gallery
					:visible-categories="[ASSETS_CATEGORY_IMAGE]"
					:gallery-id="currentElementId"
					@select-image="addImagesToGallery([$event])"
					@select-images="addImagesToGallery($event)"
					@close="showGalleryManager = false"
				/>
			</Teleport>
		</template>
		<ZyroPopupCard
			type="editor"
			:tabs="tabs"
			:current-tab="currentTab"
			:title="$t('builder.editGallery.popupTitle')"
			@update:current-tab="currentTab = $event"
			@close="$emit('close')"
		>
			<Component :is="currentTab.component" />
		</ZyroPopupCard>
	</BaseEditControls>
</template>

<script>
import Icon from '@/components/global/Icon.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroPopup from '@/components/global/ZyroPopup.vue';
import ZyroPopupCard from '@/components/global/ZyroPopupCard.vue';
import ControlsTooltip from '@/components/ControlsTooltip.vue';

import {
	mapActions,
	mapGetters,
	mapState,
} from 'vuex';

import EditGalleryMain from '@/components/builder-controls/edit-gallery/EditGalleryMain.vue';

import EventLogApi from '@/api/EventLogApi';
import BaseEditControls from '@/components/builder-controls/BaseEditControls.vue';
import { useEditGridGallery } from '@/components/builder-controls/edit-gallery/useEditGridGallery';
import AssetManager from '@/components/builder-modals/modals/AssetManager.vue';
import { ASSETS_CATEGORY_IMAGE } from '@/constants';
import { useDeviceElementHeight } from '@/use/useDeviceElementHeight';
import EditTabAnimation from '@/components/builder-controls/reusable-controls/element/EditTabAnimation.vue';

import { useI18n } from 'vue-i18n';

import {
	defineComponent,
	ref,
} from 'vue';

export default defineComponent({
	components: {
		Icon,
		ZyroButton,
		ZyroPopup,
		ZyroPopupCard,
		BaseEditControls,
		ControlsTooltip,
		AssetManager,
		EditGalleryMain,
		EditTabAnimation,
	},

	setup() {
		const { t } = useI18n();
		const tabs = [
			{
				title: t('common.general'),
				component: 'EditGalleryMain',
			},
			{
				title: t('common.animation'),
				component: 'EditTabAnimation',
			},
		];
		const { showGalleryManager } = useEditGridGallery();
		const { updateElementHeightOnDevices } = useDeviceElementHeight();

		const currentTab = ref(tabs[0]);

		return {
			tabs,
			currentTab,
			showGalleryManager,
			ASSETS_CATEGORY_IMAGE,
			updateElementHeightOnDevices,
		};
	},

	computed: {
		...mapState([
			'currentElementId',
			'isDemoMode',
		]),
		...mapGetters(['currentElement']),
	},

	methods: {
		...mapActions([
			'enterElementEditMode',
			'mergeCurrentElementData',
		]),
		openGalleryManager() {
			EventLogApi.logEvent({
				eventName: 'builder.gallery_element.manage',
			});
			this.showGalleryManager = true;
		},
		addImagesToGallery(images) {
			const oldImages = this.currentElement.images;

			const newImages = images.map(({
				path,
				origin,
				alt,
			}) => ({
				path,
				origin,
				alt: alt || '',
			}));

			this.mergeCurrentElementData({
				elementData: {
					images: [
						...oldImages,
						...newImages,
					],
				},
				pushToHistory: true,
			});

			this.updateElementHeightOnDevices({
				elementId: this.currentElementId,
			});
		},
		openEditPopup() {
			// Current editor is based on currentBlock, so we need to set it, comment from EditBlockPopup
			this.enterElementEditMode();
		},
	},
});
</script>

<style lang="scss" scoped>
.manage-button {
	// TODO: BaseEditControls should probably handle this, but it would need lots of refactoring
	margin-right: 8px;
}
</style>
