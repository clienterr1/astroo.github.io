<template>
	<div class="site">
		<ZyroSvgDeprecated
			:class="{ disabled: disabled }"
			class="domain-input-bg"
			name="domain-input"
		/>
		<div
			class="domain-input"
			:class="{ 'domain-input--readonly': readonly }"
			@click="handleClick"
		>
			<label
				class="label"
				for="domain"
			>
				https://
			</label>
			<div
				ref="measureInput"
				class="measure-input"
			/>
			<p
				v-if="readonly"
				id="domain"
				data-qa="builder-publishmodal-inputfield-freedomain"
				class="input-field"
				data-hj-whitelist
			>
				{{ modelValue }}
			</p>
			<input
				v-else
				id="domain"
				ref="inputDomain"
				data-qa="builder-publishmodal-inputfield-freedomain"
				type="text"
				class="input-field"
				spellcheck="false"
				autocomplete="off"
				:value="modelValue"
				:readonly="readonly"
				data-hj-whitelist
				@input="updateInput($event.target.value)"
				@focus="onFocus($event)"
			>
			<label
				v-if="!hideSubdomain"
				class="label"
				for="domain"
			>
				{{ previewSubdomain }}
			</label>
		</div>
	</div>
</template>

<script>
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import { captureException } from '@sentry/browser';

import { debounce } from '@zyro-inc/site-modules/utils/debounce';

import { getIsZyroSubdomainAvailable } from '@/api/PublishApi';

import { defineComponent } from 'vue';

export default defineComponent({

	components: {
		ZyroSvgDeprecated,
	},

	props: {
		readonly: {
			type: Boolean,
			default: false,
			required: false,
		},
		modelValue: {
			type: String,
			required: true,
		},
		previewSubdomain: {
			type: String,
			required: true,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		hideSubdomain: {
			type: Boolean,
		},
		isFocused: {
			type: Boolean,
			default: true,
		},
	},
	emits: [
		'focus-input',
		'on-error',
		'clear-message',
		'on-loading-end',
		'on-loading-end',
		'clear-message',
		'on-loading',
		'update:model-value',
	],

	data() {
		return {
			inputTextSelected: false,
			initialValue: '',
		};
	},

	mounted() {
		if (!this.readonly) {
			this.measureInputWidth(this.modelValue);
		}

		this.initialValue = this.modelValue;
	},

	methods: {
		onInput() {
			this.$emit('focus-input');
		},
		measureInputWidth(inputText) {
			this.$refs.measureInput.textContent = inputText;
			this.$refs.inputDomain.style.width = `${this.$refs.measureInput.offsetWidth - 2}px`;
		},
		checkDomain: debounce(async function debouncedDomainCheck() {
			try {
				const result = await getIsZyroSubdomainAvailable(`${this.modelValue}${import.meta.env.VITE_PUBLISH_DOMAIN}`);

				this.$emit(result ? 'on-valid' : 'on-invalid');
			} catch (error) {
				this.$emit('on-error', error.response.data.errors[0]?.msg);

				captureException(error);
			}

			if (!this.$refs.inputDomain.value) {
				this.$emit('clear-message');
			}

			this.$emit('on-loading-end');
		}, 1000),
		updateInput(value) {
			const filteredValue = value
				.replace(/[^\dA-Za-z-]+/g, '')
				.trim()
				.toLowerCase();

			this.$refs.inputDomain.value = filteredValue;
			this.measureInputWidth(filteredValue);

			if (value === '') {
				this.$emit('update:model-value', value);
				this.$emit('on-loading-end');
				this.$emit('clear-message');

				return;
			}

			if (filteredValue === value) {
				this.$emit('on-loading');
				this.$emit('update:model-value', filteredValue);
				this.checkDomain();
			}
		},
		onFocus(event) {
			if (this.isFocused && !this.inputTextSelected) {
				event.target.select();
				this.onInput();
				this.inputTextSelected = true;
			} else {
				this.$refs.inputDomain.selectionStart = this.$refs.inputDomain.selectionEnd;
				this.inputTextSelected = false;
			}
		},
		handleClick() {
			if (!this.readonly) {
				return;
			}

			if (this.hideSubdomain) {
				navigator.clipboard.writeText(`https://${this.modelValue}`);
			} else {
				navigator.clipboard.writeText(`https://${this.modelValue}${this.previewSubdomain}`);
			}
		},
	},
});
</script>
<style lang="scss">
// When this is refactored, update typography as well.

.site {
	position: relative;
	display: flex;

	> .domain-input-bg {
		transition: all 0.2s;

		&.disabled {
			filter: grayscale(1);
		}

		@media screen and (max-width: $media-mobile) {
			display: none;
		}
	}

	> .domain-input {
		position: absolute;
		top: 1px;
		bottom: 0;
		left: 88px;
		display: flex;
		width: 405px;
		height: 32px;
		padding-top: 6px;
		padding-left: 12px;
		margin-top: auto;
		margin-bottom: auto;
		background: white;
		border-radius: 25px;
		transition: all 0.3s ease;

		&--readonly {
			cursor: copy;

			.label {
				cursor: copy;
			}
		}

		&:focus-within {
			background: $color-gray-light;

			&::before {
				position: absolute;
				top: 0;
				left: 0;
				z-index: -1;
				width: 100%;
				height: 100%;
				content: "";
				background: transparent;
				border: 2px solid $color-meteorite;
				border-radius: 25px;
				opacity: 1;
				transform: scale(1.01) translate(0, 0);
			}
		}

		&:hover {
			background: $color-gray-light;
		}

		> .label {
			font-size: 14px;
			font-style: normal;
			font-weight: normal;
			font-stretch: normal;
			line-height: 1.43;
			color: $color-gray;
			user-select: none;

			&:last-child {
				flex-grow: 1;
			}
		}

		> .input-field {
			margin-bottom: 6px;
			font-size: 14px;
			line-height: 1.43;
			letter-spacing: 0.6px;
			background: transparent;
			border: none;

			&:focus {
				outline: none;
			}

			&::selection {
				background: $color-meteorite;
			}
		}

		> .measure-input {
			position: absolute;
			display: inline;
			font-size: 14px;
			line-height: 1.43;
			letter-spacing: 0.6px;
			pointer-events: none;
			visibility: hidden;
		}
	}

	> .link {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 366px;
		height: 50px;
		font-size: 14px;
		font-style: normal;
		font-weight: normal;
		font-stretch: normal;
		line-height: 1.57;
		color: $color-gray;
		letter-spacing: 0.7px;
		background: $color-light;
	}

	> .btn-link {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 143px;
		height: 50px;
		font-size: 10px;
		font-style: normal;
		font-weight: 500;
		font-stretch: normal;
		line-height: normal;
		color: $color-primary;
		text-align: center;
		text-transform: uppercase;
		letter-spacing: 2.6px;
		border: solid 1.5px $color-light;
	}
}

@media screen and (max-width: $media-mobile) {
	.site .domain-input {
		position: static;
		display: block;
		width: 100%;
		height: auto;
		padding: 10px;
		background: $color-gray-light;
		border-radius: 0;

		&:focus-within::before {
			display: none;
		}
	}
}
</style>
