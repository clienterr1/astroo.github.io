<template>
	<ZyroModal
		max-width="450px"
		max-height="700px"
		height="auto"
		class="choose-placement-modal"
		@close-modal="$emit('close')"
	>
		<div class="choose-placement-modal__content">
			<figure class="choose-placement-modal__image">
				<!-- TODO: "zyro-image" component for dynamic image loading -->
				<slot name="header-image" />
			</figure>

			<h2 class="z-h5 z-h5--spaced">
				{{ title }}
			</h2>
			<p class="z-body z-body--spaced">
				{{ subtitle }}
			</p>

			<div class="choose-placement-modal__cta">
				<ZyroButton
					v-qa="`builder-chooseplacementmodal-btn-${primaryButtonText}`"
					theme="primary"
					class="choose-placement-modal__primary-cta"
					@click="$emit('add-primary')"
				>
					{{ primaryButtonText }}
				</ZyroButton>
				<ZyroButton
					v-if="!hideSecondaryButton"
					v-qa="`builder-chooseplacementmodal-btn-${secondaryButtonText}`"
					theme="outline"
					@click="$emit('add-secondary')"
				>
					{{ secondaryButtonText }}
				</ZyroButton>
			</div>
		</div>
	</ZyroModal>
</template>

<script>
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroModal from '@/components/global/ZyroModal.vue';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroButton,
		ZyroModal,
	},

	props: {
		primaryButtonText: {
			type: String,
			default: '',
		},
		secondaryButtonText: {
			type: String,
			default: '',
		},
		hideSecondaryButton: {
			type: Boolean,
			default: false,
		},
		title: {
			type: String,
			default: '',
		},
		subtitle: {
			type: String,
			default: '',
		},
	},
});
</script>

<style lang="scss" scoped>
.choose-placement-modal {
	&__content {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 60px 0 40px;
		text-align: center;
	}

	&__image {
		margin-bottom: 12px;
	}

	&__cta {
		display: inline-flex;
		flex-direction: column;
		margin-top: 36px;
	}

	&__primary-cta {
		margin-bottom: 10px;
	}
}
</style>
