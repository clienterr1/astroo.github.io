<template>
	<div
		v-qa="`folder-thumbnail-${folderName}`"
		class="folder-thumbnail"
	>
		<div
			class="folder-thumbnail__content-wrapper"
			@click="handleFolderClick"
		>
			<div>
				<ZyroSvgDeprecated
					class="folder-thumbnail__icon"
					name="folder"
					dimensions="24px"
				/>
			</div>
			<AssetNameInput
				v-if="isAssetBeingRenamed"
				ref="nameInputRef"
				:asset-name="folderName"
				class="folder-thumbnail__name-input"
				@toggle-input="toggleInput"
			/>
			<p
				v-else
				class="folder-thumbnail__name z-body-small"
				:title="folderName"
			>
				{{ folderName }}
			</p>
			<div
				v-if="!isAssetBeingRenamed"
				class="folder-thumbnail__hover-backdrop"
			/>
		</div>
		<AssetControls
			is-folder
			@rename-asset="isAssetBeingRenamed = !isAssetBeingRenamed"
			@delete-asset="$emit('delete-asset')"
		/>
	</div>
</template>

<script>
import AssetNameInput from '@/components/builder-modals/modals/asset-manager/user/AssetNameInput.vue';

import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';
import AssetControls from '@/components/builder-modals/modals/asset-manager/user/AssetControls.vue';

import {
	defineComponent,
	ref,
} from 'vue';

export default defineComponent({
	components: {
		ZyroSvgDeprecated,
		AssetControls,
		AssetNameInput,
	},
	props: {
		folderName: {
			type: String,
			required: true,
		},
	},
	emits: [
		'open-directory',
		'rename-asset',
		'delete-asset',
	],
	setup(props, context) {
		const isAssetBeingRenamed = ref(false);
		const nameInputRef = ref(null);

		const handleFolderClick = () => {
			if (isAssetBeingRenamed.value) {
				return;
			}

			context.emit('open-directory');
		};

		const toggleInput = (newName) => {
			context.emit('rename-asset', newName);
			isAssetBeingRenamed.value = !isAssetBeingRenamed.value;
		};

		return {
			nameInputRef,
			isAssetBeingRenamed,
			handleFolderClick,
			toggleInput,
		};
	},
});
</script>

<style lang="scss" scoped>
.folder-thumbnail {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	max-height: 56px;
	padding: 16px 8px;
	cursor: pointer;
	border: 1px solid $color-gray-border;
	border-radius: 4px;

	&__hover-backdrop {
		position: absolute;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
		transition: opacity 0.3s;

		&:hover,
		&:focus {
			background: rgba($color-dark, 0.2);
			opacity: 1;
		}
	}

	&__content-wrapper {
		display: flex;
		align-items: center;
		width: 100%;
		max-width: 155px;
	}

	&__icon {
		margin-right: 8px;
		color: $color-gray;
	}

	&__name {
		display: block;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	&__name-input {
		width: 100%;
		margin-bottom: 0;
	}
}
</style>
