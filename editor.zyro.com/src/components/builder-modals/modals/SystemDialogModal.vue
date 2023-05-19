<template>
	<ZyroModal
		:max-width="maxWidth"
		max-height="auto"
		height="auto"
		:width="width"
		class="choose-placement-modal"
		content-padding="0"
		:title="title"
		:style="computedStyles"
		@close-modal="$emit('close')"
	>
		<div
			class="choose-placement-modal__content"
			:class="{ 'choose-placement-modal__content--has-title': title }"
		>
			<slot />
		</div>
		<template #footer>
			<ZyroButton
				v-qa="'systemdialogmodal-primary-btn'"
				class="choose-placement-modal__primary-button"
				:theme="primaryButtonTheme"
				@click="$emit('click-primary')"
			>
				{{ primaryButtonText }}
			</ZyroButton>
			<ZyroButton
				v-qa="'systemdialogmodal-seconday-btn'"
				theme="primary"
				:color="secondaryButtonColor"
				:is-disabled="isButtonDisabled"
				@click="$emit('click-secondary')"
			>
				<ZyroLoader
					v-if="isLoading"
					size="26px"
					color="var(--color-light)"
					weight="3px"
				/>
				<template v-else>
					{{ secondaryButtonText }}
				</template>
			</ZyroButton>
		</template>
	</ZyroModal>
</template>

<script>
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroModal from '@/components/global/ZyroModal.vue';

import ZyroLoader from '@zyro-inc/site-modules/components/ZyroLoader.vue';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroButton,
		ZyroModal,
		ZyroLoader,
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
		primaryButtonMargin: {
			type: String,
			default: '0 16px 0 0',
		},
		primaryButtonTheme: {
			type: String,
			default: 'plain',
		},
		secondaryButtonColor: {
			type: String,
			default: 'black',
		},
		title: {
			type: String,
			default: '',
		},
		maxWidth: {
			type: String,
			default: '470px',
		},
		width: {
			type: String,
			default: 'auto',
		},
		isLoading: {
			type: Boolean,
			default: false,
		},
		isButtonDisabled: {
			type: Boolean,
			default: false,
		},
	},

	computed: {
		computedStyles() {
			return {
				'--primary-button-margin': this.primaryButtonMargin,
			};
		},
	},
});
</script>

<style lang="scss" scoped>
.choose-placement-modal {
	&__content {
		padding: 24px;

		&--has-title {
			padding-top: 0;
		}
	}

	&__primary-button {
		margin: var(--primary-button-margin);
	}
}
</style>
