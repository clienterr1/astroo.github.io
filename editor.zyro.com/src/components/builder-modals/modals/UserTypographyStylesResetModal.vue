<template>
	<ZyroModal
		max-width="320px"
		max-height="240px"
		:title="$t('builder.userStyles.typography.modal.title')"
		@close-modal="closeModal"
	>
		<p>
			{{ $t('builder.userStyles.modal.subtitle') }}
		</p>
		<template #footer>
			<ZyroButton
				v-qa="'userstyles-typography-reset-cancel-btn'"
				@click="closeModal"
			>
				{{ $t('common.cancel') }}
			</ZyroButton>
			<ZyroButton
				v-qa="'userstyles-typography-reset-confirm-btn'"
				theme="primary"
				@click="handleReset"
			>
				{{ $t('common.reset') }}
			</ZyroButton>
		</template>
	</ZyroModal>
</template>

<script>
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroModal from '@/components/global/ZyroModal.vue';

import { useTypographyStylesLibrary } from '@/components/builder-drawers/drawers/partials/stylesDrawer/typograpghy/use/useTypographyStylesLibrary';
import {
	mapActionsGui,
	CLOSE_MODAL,
} from '@/store/builder/gui';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroButton,
		ZyroModal,
	},

	setup() {
		const { resetSelectedTypographyStyles } = useTypographyStylesLibrary();

		return {
			resetSelectedTypographyStyles,
		};
	},

	methods: {
		...mapActionsGui({
			closeModal: CLOSE_MODAL,
		}),
		handleReset() {
			this.resetSelectedTypographyStyles();
			this.closeModal();
		},
	},
});
</script>
