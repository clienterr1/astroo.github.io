<template>
	<ZyroModal
		:max-width="maxWidth"
		:max-height="maxHeight"
		:title="title"
		:is-rounded="isRounded"
		@close-modal="$emit('close')"
	>
		<slot />
		<template #footer>
			<div class="settings__modal-footer">
				<ZyroButton
					v-qa="`sitesettingsmodal-btn-${rightButtonText}`"
					class="button--right"
					:theme="rightButtonTheme"
					:color="rightButtonColor"
					:disabled="isRightButtonDisabled"
					@click="$emit('right-button-click')"
				>
					{{ rightButtonText ?? $t('common.save') }}
				</ZyroButton>
				<ZyroButton
					v-qa="`sitesettingsmodal-btn-${leftButtonText}`"
					class="button--left"
					:theme="leftButtonTheme"
					@click="$emit('left-button-click')"
				>
					{{ leftButtonText ?? $t('common.cancel') }}
				</ZyroButton>
			</div>
		</template>
	</ZyroModal>
</template>

<script>
import { defineComponent } from 'vue';

import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroModal from '@/components/global/ZyroModal.vue';

export default defineComponent({
	components: {
		ZyroButton,
		ZyroModal,
	},

	props: {
		rightButtonTheme: {
			type: String,
			default: 'primary',
		},
		isRounded: {
			type: Boolean,
			default: true,
		},
		rightButtonColor: {
			type: String,
			default: 'black',
		},
		rightButtonText: {
			type: String,
			default: null,
		},
		isRightButtonDisabled: {
			type: Boolean,
			default: false,
		},
		leftButtonText: {
			type: String,
			default: null,
		},
		leftButtonTheme: {
			type: String,
			default: 'outline',
		},
		title: {
			type: String,
			required: true,
		},
		maxWidth: {
			type: String,
			default: '606px',
		},
		maxHeight: {
			type: String,
			default: '256px',
		},
	},
});
</script>
<style lang="scss" scoped>
/* stylelint-disable-next-line selector-class-pattern */
:deep(.modal__content) {
	@media screen and (max-width: $media-mobile) {
		max-height: 80px;
	}
}

.settings {
	&__modal-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;

		@media screen and (max-width: $media-mobile) {
			flex-direction: column;
		}

		.button {
			&--right {
				order: 2;

				@media screen and (max-width: $media-mobile) {
					order: 1;
					margin-bottom: 8px;
				}
			}

			&--left {
				order: 1;

				@media screen and (max-width: $media-mobile) {
					order: 2;
				}
			}
		}
	}
}
</style>
