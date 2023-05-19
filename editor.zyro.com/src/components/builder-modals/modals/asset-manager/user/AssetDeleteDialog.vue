<template>
	<SystemDialogModal
		v-if="isDeleteAssetModalOpened"
		:is-loading="isAssetBeingDeleted"
		:title="modalTitle"
		:primary-button-text="$t('common.cancel')"
		:secondary-button-text="$t('common.delete')"
		secondary-button-color="warning"
		:is-button-disabled="folderToDelete && !isSelected"
		class="delete-dialog"
		@close="resetDialogStates"
		@click-primary="resetDialogStates"
		@click-secondary="handleDeleteAsset"
	>
		<template v-if="folderToDelete">
			<i18n-t
				keypath="builder.foldersDeleteMessage"
				tag="p"
			>
				<b>{{ $t('builder.foldersDeleteMessageSlot', directoryToDeleteFileCount, { count: directoryToDeleteFileCount }) }}</b>
			</i18n-t>
			<div class="delete-dialog__checkbox-wrapper">
				<ZyroCheckbox
					data-qa="asset-delete-dialog-folder-checkbox"
					is-filled
					:model-value="isSelected"
					@update:model-value="isSelected = !isSelected"
				/>
				<p
					class="z-body-small delete-dialog__checkbox-label"
					@click="isSelected = !isSelected"
				>
					{{ $t('builder.foldersDeleteConfirmation') }}
				</p>
			</div>
		</template>
		<template v-else>
			{{ $t('builder.assetManagerDialogAreYouSure') }}<br>
			{{ $t('builder.assetManagerDialogImageRemoveFromSite') }}
		</template>
	</SystemDialogModal>
</template>

<script>
import {
	defineComponent,
	ref,
	computed,
} from 'vue';
import { useAssets } from '@/use/useAssets';
import { useAssetManagerFolders } from '@/use/useAssetManagerFolders';
import SystemDialogModal from '@/components/builder-modals/modals/SystemDialogModal.vue';
import ZyroCheckbox from '@/components/global/ZyroCheckbox.vue';
import { useI18n } from 'vue-i18n';
import { getFilesInDirectory } from '@/utils/assets';
import { getFileNameFromURL } from '@zyro-inc/site-modules/utils/modifyString';

export default defineComponent({
	components: {
		SystemDialogModal,
		ZyroCheckbox,
	},
	emits: ['close'],
	setup(props, context) {
		const {
			isDeleteAssetModalOpened,
			isAssetBeingDeleted,
			deleteMediaAsset,
			assetsToDelete,
			folderToDelete,
			assets,
		} = useAssets(props, context);
		const { t } = useI18n();
		const {
			deleteAssetFromFoldersData,
			deleteFolderFromFoldersData,
			assetPaths,
		} = useAssetManagerFolders({
			assets,
		});
		const isSelected = ref(false);

		const modalTitle = computed(() => (folderToDelete.value ? t('builder.foldersDeleteFolder') : t('builder.assetManagerTabUserDelete')));
		const directoryToDeleteFileCount = computed(() => getFilesInDirectory({
			directory: folderToDelete.value.path,
			assets: assets.value,
			assetPaths: assetPaths.value,
			includeFromSubfolders: true,
		})?.length);

		const resetDialogStates = () => {
			isDeleteAssetModalOpened.value = false;
			isSelected.value = false;
			folderToDelete.value = null;
			assetsToDelete.value = [];
		};

		const handleDeleteAsset = async () => {
			if (assetsToDelete.value.length) {
				await deleteMediaAsset();
			}

			if (folderToDelete.value) {
				deleteFolderFromFoldersData({
					path: folderToDelete.value.path,
				});
			} else {
				const assetNameWithHash = getFileNameFromURL(assetsToDelete.value[0].url, true);

				await deleteAssetFromFoldersData({
					id: assetNameWithHash,
				});
			}

			resetDialogStates();
		};

		return {
			isDeleteAssetModalOpened,
			isAssetBeingDeleted,
			handleDeleteAsset,
			resetDialogStates,
			folderToDelete,
			isSelected,
			modalTitle,
			directoryToDeleteFileCount,
		};
	},
});
</script>
<style scoped lang="scss">
.delete-dialog {
	&__checkbox-wrapper {
		display: flex;
		align-items: center;
		margin-top: 16px;
	}

	&__checkbox-label {
		margin-left: 8px;
		cursor: pointer;
	}
}
</style>
