<template>
	<ZyroButton
		v-bind="$attrs"
		ref="assetSettingsRef"
		color="white"
		theme="primary"
		@click="isAssetSettingsOpen = !isAssetSettingsOpen"
	>
		<template #icon>
			<Icon
				v-qa="isFolder ? 'more-options-folder' : 'more-options-asset'"
				name="more_vert"
				dimensions="16px"
			/>
		</template>
	</ZyroButton>
	<Popup
		v-if="isAssetSettingsOpen"
		:target-ref="assetSettingsRef?.$el"
		placement="right-end"
		portal-selector="[data-portal='asset-manager']"
		auto-update
		is-only-click-inside
		@click-outside="resetPopupStates"
	>
		<div class="control-buttons">
			<button
				v-if="isMovingEnabled"
				ref="moveToButtonRef"
				v-qa="`asset-controls-button-move`"
				class="control-buttons__button z-button-small"
				@mouseenter="isMovingPopupOpen = true"
			>
				<ZyroSvgDeprecated
					dimensions="16px"
					name="folder-move"
				/>
				<span class="control-buttons__button-text">
					{{ $t('builder.foldersMoveTo') }}
				</span>
				<ZyroSvgDeprecated
					dimensions="18px"
					name="chevron-right"
				/>
			</button>
			<button
				v-qa="`asset-controls-button-rename`"
				class="control-buttons__button z-button-small"
				@click="handleRenameClick"
				@mouseenter="isMovingPopupOpen = false"
			>
				<ZyroSvgDeprecated name="type" />
				<span class="control-buttons__button-text">
					{{ $t('common.rename') }}
				</span>
			</button>
			<button
				v-qa="`asset-controls-button-delete`"
				theme="plain"
				class="control-buttons__button z-button-small"
				@click="handleDeleteClick"
			>
				<ZyroSvgDeprecated name="trash" />
				<span class="control-buttons__button-text">
					{{ $t('common.delete') }}
				</span>
			</button>
		</div>
		<Popup
			v-if="isMovingPopupOpen"
			:target-ref="moveToButtonRef"
			placement="right-start"
			:offset="12"
			auto-update
			is-only-click-inside
			portal-selector="[data-portal='asset-manager']"
			@click-outside="isMovingEnabled = false"
		>
			<div
				class="control-buttons"
				@mouseleave="isMovingPopupOpen = false"
			>
				<button
					v-if="currentFolderAsset"
					class="z-button-small control-buttons__button"
					:class="{ 'control-buttons__button--underlined': assetFolders.length }"
					@click="$emit('move-asset-to', '/')"
				>
					<ZyroSvgDeprecated name="folder-outline" />
					<span class="control-buttons__button-text control-buttons__button-text--folders">
						{{ $t('builder.foldersMyLibrary') }}
					</span>
				</button>
				<button
					v-for="folder in assetFolders"
					:key="folder.name"
					v-qa="`asset-controls-moving-folders-${folder.name}`"
					class="control-buttons__button z-button-small"
					@click="$emit('move-asset-to', folder.path)"
				>
					<ZyroSvgDeprecated name="folder-outline" />
					<span class="control-buttons__button-text control-buttons__button-text--folders">
						{{ folder.name }}
					</span>
				</button>
			</div>
		</Popup>
	</Popup>
</template>

<script>
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';
import { ASSETS_TAB_ID_MY_LIBRARY } from '@/constants';
import {
	defineComponent,
	ref,
	computed,
} from 'vue';
import Icon from '@/components/global/Icon.vue';
import Popup from '@/components/global/Popup.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';
import { useAssetManagerFolders } from '@/use/useAssetManagerFolders';
import { useAssets } from '@/use/useAssets';
import { useStore } from 'vuex';

export default defineComponent({
	components: {
		Icon,
		Popup,
		ZyroButton,
		ZyroSvgDeprecated,
	},
	props: {
		isFolder: {
			type: Boolean,
			default: false,
		},
		currentTab: {
			type: Object,
			default: null,
		},
	},
	emits: [
		'rename-asset',
		'delete-asset',
		'move-asset-to',
	],
	setup(props, context) {
		const { getters } = useStore();
		const {
			isDeleteAssetModalOpened,
			assets,
		} = useAssets();
		const { folders } = useAssetManagerFolders({
			assets,
		});
		const assetSettingsRef = ref(false);
		const moveToButtonRef = ref(false);
		const isAssetSettingsOpen = ref(false);
		const isMovingPopupOpen = ref(false);
		const isCurrentTabLibrary = computed(() => props.currentTab && props.currentTab.id === ASSETS_TAB_ID_MY_LIBRARY);
		const isThereAnyFolders = computed(() => folders.value.length);
		const isMovingEnabled = computed(() => (!props.isFolder && isThereAnyFolders.value && isCurrentTabLibrary.value));
		const currentDirectory = computed(() => getters['assets/currentDirectory']);
		const currentFolderAsset = computed(() => folders.value.find((asset) => asset.path === currentDirectory.value));
		const assetFolders = computed(() => folders.value.filter((asset) => asset.path !== currentDirectory.value));

		const resetPopupStates = () => {
			isAssetSettingsOpen.value = false;
			isMovingPopupOpen.value = false;
			isDeleteAssetModalOpened.value = false;
		};

		const handleDeleteClick = () => {
			isAssetSettingsOpen.value = false;
			context.emit('delete-asset');
		};

		const handleRenameClick = () => {
			isAssetSettingsOpen.value = false;
			context.emit('rename-asset');
		};

		return {
			isAssetSettingsOpen,
			isMovingEnabled,
			isMovingPopupOpen,
			resetPopupStates,
			assetFolders,
			currentFolderAsset,
			assetSettingsRef,
			moveToButtonRef,
			handleDeleteClick,
			handleRenameClick,
		};
	},
});
</script>

<style lang="scss" scoped>
.control-buttons {
	$this: &;

	position: relative;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	width: 100%;
	max-height: 50vh;
	padding: 8px;
	overflow: auto;
	background-color: $color-light;
	border-radius: 4px;
	box-shadow: 0 6px 14px rgba($color-dark, 0.1);

	&__button {
		display: flex;
		align-items: center;
		width: 100%;
		min-width: 123px;
		padding: 8px;
		color: black;
		cursor: pointer;
		border-radius: 4px;

		&:hover,
		&:focus {
			background-color: $color-gray-light;
		}

		&--underlined {
			position: relative;

			&::after {
				position: absolute;
				bottom: -4px;
				left: 0;
				width: 100%;
				height: 1px;
				margin-bottom: 4px;
				content: "";
				background-color: $color-gray-border;
			}
		}
	}

	&__button-text {
		margin: 0 8px;
		text-align: start;

		&--folders {
			width: 100%;
			max-width: 150px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
}
</style>
