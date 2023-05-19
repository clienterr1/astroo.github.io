<template>
	<AssetsGridWrapper>
		<FolderThumbnail
			v-for="folder in folders"
			:key="folder.id"
			:folder-name="folder.name"
			is-folder
			@open-directory="$emit('open-directory', folder.path)"
			@rename-asset="$emit('rename-asset', {
				asset: folder,
				newName: $event
			})"
			@delete-asset="$emit('delete-asset', folder)"
		/>
	</AssetsGridWrapper>
</template>

<script>
import FolderThumbnail from '@/components/builder-modals/modals/asset-manager/user/FolderThumbnail.vue';
import AssetsGridWrapper from '@/components/builder-modals/modals/asset-manager/user/AssetsGridWrapper.vue';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		FolderThumbnail,
		AssetsGridWrapper,
	},
	props: {
		folders: {
			type: Array,
			required: true,
		},
	},
	emits: [
		'open-directory',
		'rename-asset',
		'delete-asset',
	],
});
</script>
