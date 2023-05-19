<template>
	<ZyroModal
		max-width="540px"
		height="auto"
		content-padding="24px 40px 40px"
		class="legal-content"
		@close-modal="closeModal"
	>
		<div class="legal-content__content">
			<LegalContentGeneratorForm />
			<div class="legal-content__disclaimer">
				<div class="legal-content__disclaimer-title">
					{{ $t('builder.legalContentGenerator.disclaimerTitle') }}
				</div>

				<div class="legal-content__disclaimer-content">
					<Transition
						name="slide-down"
					>
						<div v-show="isDisclaimerVisible">
							<div class="legal-content__disclaimer-text">
								{{ $t('builder.legalContentGenerator.disclaimerTextOne') }}
							</div>
							<div class="legal-content__disclaimer-text">
								{{ $t('builder.legalContentGenerator.disclaimerTextTwo') }}
							</div>
						</div>
					</Transition>
				</div>

				<div
					v-qa="'legalcontentgeneratormodal-disclaimer-trigger'"
					class="legal-content__disclaimer-trigger"
					@click="isDisclaimerVisible = !isDisclaimerVisible"
				>
					<p class="legal-content__disclaimer-trigger-text">
						{{ isDisclaimerVisible ? $t('common.viewLess') : $t('common.viewMore') }}
					</p>

					<ZyroSvgDeprecated
						name="chevron"
						:direction="isDisclaimerVisible ? 'up' : 'down'"
					/>
				</div>
			</div>
		</div>

		<template #footer>
			<ZyroButton
				v-qa="'legalcontentgeneratormodal-btn-submit'"
				class="legal-content__submit"
				theme="primary"
				@click="formSubmitHandler"
			>
				{{ shouldAddPage ? $t('common.addPage') : $t('common.addSection') }}
			</ZyroButton>
		</template>
	</ZyroModal>
</template>

<script setup>
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroModal from '@/components/global/ZyroModal.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';
import LegalContentGeneratorForm from '@/components/legal-content-generator/LegalContentGeneratorForm.vue';

import { useLegalContentGenerator } from '@/components/legal-content-generator/useLegalContentGenerator';

import { ref } from 'vue';

const isDisclaimerVisible = ref(false);

const {
	formSubmitHandler,
	closeModal,
	shouldAddPage,
} = useLegalContentGenerator();

</script>

<style lang="scss" scoped>
.slide {
	&-down-enter-active,
	&-down-leave-active {
		transition: max-height 0.5s ease;
	}

	&-down-leave-to,
	&-down-enter-from {
		max-height: 0;
	}

	&-down-leave-from,
	&-down-enter-to {
		max-height: 200px;
	}
}

.legal-content {
	&__submit {
		margin-left: auto;
	}

	&__disclaimer-content {
		overflow: hidden;
	}

	&__disclaimer-title {
		margin-bottom: 8px;
		font-size: 14px;
		font-weight: 400;
		line-height: 1.4;
		letter-spacing: 0.25px;
	}

	&__disclaimer-text {
		font-size: 12px;
		font-weight: 400;
		line-height: 1.3;
		letter-spacing: 0.25px;

		&:first-child {
			margin-bottom: 8px;
		}
	}

	&__disclaimer-trigger {
		display: flex;
		align-items: center;
		margin-top: 8px;
		color: $color-primary;
		cursor: pointer;
	}

	&__disclaimer-trigger-text {
		margin-right: 4px;
		font-size: 14px;
		line-height: 1.4;
	}
}
</style>
