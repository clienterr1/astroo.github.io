<template>
	<Component
		:is="componentType"
		v-if="currentElementType"
		class="edit-controls"
		@close="close"
	/>
</template>

<script>
import { addBreadcrumb } from '@sentry/browser';
import {
	mapState,
	mapGetters,
	mapActions,
} from 'vuex';

import BaseEditControls from '@/components/builder-controls/BaseEditControls.vue';
import EditButton from '@/components/builder-controls/edit-button/EditButton.vue';
import EditEmbed from '@/components/builder-controls/edit-embed/EditEmbed.vue';
import EditForm from '@/components/builder-controls/edit-form/EditForm.vue';
import EditGallery from '@/components/builder-controls/edit-gallery/EditGallery.vue';
import EditImage from '@/components/builder-controls/edit-image/EditImage.vue';
import EditInstagramFeed from '@/components/builder-controls/edit-instagram-feed/EditInstagramFeed.vue';
import EditMap from '@/components/builder-controls/edit-map/EditMap.vue';
import EditSocialIcons from '@/components/builder-controls/edit-social-icons/EditSocialIcons.vue';
import EditText from '@/components/builder-controls/edit-text/EditText.vue';
import EditVideo from '@/components/builder-controls/edit-video/EditVideo.vue';
import EditShape from '@/components/builder-controls/edit-shape/EditShape.vue';

import { defineComponent } from 'vue';

const EDITORS = {
	GridTextBox: 'EditText',
	GridButton: 'EditButton',
	GridStripeButton: 'EditButton',
	GridEcommerceButton: 'EditButton',
	GridGallery: 'EditGallery',
	GridImage: 'EditImage',
	GridMap: 'EditMap',
	GridVideo: 'EditVideo',
	GridSocialIcons: 'EditSocialIcons',
	GridInstagramFeed: 'EditInstagramFeed',
	GridForm: 'EditForm',
	GridEmbed: 'EditEmbed',
	GridShape: 'EditShape',
};

export default defineComponent({
	components: {
		EditText,
		EditButton,
		EditGallery,
		EditImage,
		EditMap,
		EditVideo,
		EditSocialIcons,
		EditInstagramFeed,
		EditForm,
		EditEmbed,
		BaseEditControls,
		EditShape,
	},

	computed: {
		...mapState(['currentElementId']),
		...mapGetters(['currentElementType']),
		componentType() {
			return EDITORS[this.currentElementType] ?? 'BaseEditControls';
		},
	},

	created() {
		addBreadcrumb({
			category: 'CONTROLS:ELEMENT',
			message: 'Created',
			data: {
				currentElementId: this.currentElementId,
				type: this.componentType,
			},
			level: 'debug',
			type: 'debug',
		});
	},

	methods: {
		...mapActions(['leaveElementEditMode']),
		...mapActions('undoRedo', ['createSnapshot']),
		close() {
			addBreadcrumb({
				category: 'CONTROLS:ELEMENT',
				message: 'Close',
				data: {
					currentElementId: this.currentElementId,
					type: this.componentType,
				},
				level: 'debug',
				type: 'debug',
			});
			this.leaveElementEditMode();
			this.createSnapshot();
		},
	},
});
</script>
<style lang="scss" scoped>
.edit-controls {
	z-index: $z-index-controls-edit;
}
</style>
