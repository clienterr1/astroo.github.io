<template>
	<SystemDialogModal
		:title="$t('builder.userStyles.colors.modal.title')"
		:primary-button-text="$t('common.reset')"
		:secondary-button-text="$t('common.keepChanges')"
		@close="closeModal"
		@click-primary="handleReset"
		@click-secondary="closeModal"
	>
		<p>
			{{ $t('builder.userStyles.modal.subtitle') }}
		</p>
	</SystemDialogModal>
</template>

<script>
import { mapState } from 'vuex';

import { useTypographyStylesLibrary } from '@/components/builder-drawers/drawers/partials/stylesDrawer/typograpghy/use/useTypographyStylesLibrary';
import SystemDialogModal from '@/components/builder-modals/modals/SystemDialogModal.vue';
import {
	mapActionsGui,
	CLOSE_MODAL,
} from '@/store/builder/gui';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		SystemDialogModal,
	},

	setup() {
		const {
			updateTypographyStylesLibrary,
			resetSelectedStyleInList,
		} = useTypographyStylesLibrary();

		return {
			updateTypographyStylesLibrary,
			resetSelectedStyleInList,
		};
	},

	computed: {
		...mapState('gui', ['activeModalSettings']),
	},

	methods: {
		...mapActionsGui({
			closeModal: CLOSE_MODAL,
		}),
		handleReset() {
			const {
				title,
				textElementData,
				primaryFont,
				secondaryFont,
			} = this.activeModalSettings;

			this.resetSelectedStyleInList();
			this.updateTypographyStylesLibrary(title, textElementData, primaryFont, secondaryFont);
			this.closeModal();
		},
	},
});
</script>
