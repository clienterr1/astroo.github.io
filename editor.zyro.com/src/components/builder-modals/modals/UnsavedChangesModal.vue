<template>
	<SystemDialogModal
		v-if="isCloseConfirmationShown"
		:title="$t('siteSettings.common.unsavedChanges')"
		:primary-button-text="$t('common.continueEditing')"
		:secondary-button-text="$t('common.discardChanges')"
		@close="$emit('close-modal')"
		@click-primary="$emit('close-modal')"
		@click-secondary="$emit('discard')"
	>
		<p>
			{{ $t('builder.unsavedChangesModalSubtitle') }}
		</p>
	</SystemDialogModal>
</template>

<script>
import isEqual from 'lodash.isequal';

import SystemDialogModal from '@/components/builder-modals/modals/SystemDialogModal.vue';

import { defineComponent } from 'vue';

/**
 * Should be used with v-if in the parent.
 * When v-if is true, component compares items, and, if they are the same, emits discard event.
 * Otherwise, loads the discard changes confirmation modal.
 */
export default defineComponent({

	components: {
		SystemDialogModal,
	},

	props: {
		itemBeforeEdit: {
			type: Object,
			required: true,
		},
		itemAfterEdit: {
			type: Object,
			required: true,
		},
	},
	emits: ['discard'],

	data() {
		return {
			isCloseConfirmationShown: false,
		};
	},

	mounted() {
		if (isEqual(this.itemBeforeEdit, this.itemAfterEdit)) {
			this.$emit('discard');
		} else {
			this.isCloseConfirmationShown = true;
		}
	},
});
</script>
