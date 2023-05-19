<template>
	<div
		class="toast"
		:[DATA_ATTRIBUTE_SELECTOR]="DATA_ATTRIBUTE_SELECTOR_TOAST"
	>
		<div
			class="toast__content"
			:class="{ 'toast__content-separator': showClose }"
		>
			<ZyroSvgDeprecated
				v-if="icon"
				class="toast__icon"
				:name="icon"
			/>
			<div
				class="toast__message"
				v-text="message"
			/>
			<slot />
			<ZyroButton
				v-if="submitLabel"
				theme="primary"
				class="toast__submit-button"
				@click="$emit('submit')"
			>
				{{ submitLabel }}
			</ZyroButton>
		</div>
		<ZyroButton
			v-if="showClose"
			class="toast__close"
			:data-qa="dataQaCloseButton"
			theme="primary"
			:color="buttonColor"
			:title="$t('common.close')"
			@click="$emit('close')"
		>
			<template #icon>
				<Icon
					name="close"
					dimensions="20px"
				/>
			</template>
		</ZyroButton>
	</div>
</template>

<script>
import Icon from '@/components/global/Icon.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';
import {
	DATA_ATTRIBUTE_SELECTOR,
	DATA_ATTRIBUTE_SELECTOR_TOAST,
} from '@zyro-inc/site-modules/constants';
import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		Icon,
		ZyroButton,
		ZyroSvgDeprecated,
	},

	props: {
		submitLabel: {
			type: String,
			default: null,
		},
		message: {
			type: String,
			required: true,
		},
		icon: {
			type: String,
			default: null,
		},
		buttonColor: {
			type: String,
			default: 'black',
		},
		showClose: {
			type: Boolean,
			default: true,
		},
		dataQaCloseButton: {
			type: String,
			default: 'toast-btn-close',
		},
	},
	setup() {
		return {
			DATA_ATTRIBUTE_SELECTOR,
			DATA_ATTRIBUTE_SELECTOR_TOAST,
		};
	},
});
</script>

<style lang="scss" scoped>
.toast {
	display: flex;
	align-items: flex-start;
	max-width: 400px;
	padding: 8px;
	margin-top: 16px;
	font-size: 14px;
	color: $color-light;
	background-color: $color-dark;
	border-radius: $border-radius-small;

	&__content {
		position: relative;
		display: flex;
		justify-content: flex-end;

		@media screen and (max-width: $media-mobile) {
			flex-direction: column;
		}
	}

	&__content-separator {
		padding-right: 16px;
		border-right: 1px solid $color-light;
	}

	&__message {
		padding: 8px 16px;
	}

	&__submit-button {
		align-self: flex-end;
		margin-left: 16px;

		@media screen and (max-width: $media-mobile) {
			align-self: center;
			margin-left: 0;
		}
	}

	&__icon {
		flex-shrink: 0;
		align-self: center;
	}

	&__close {
		margin-left: 8px;
	}
}
</style>
