<!-- TODO:
	1. Tests
-->
<template>
	<ZyroPopup
		ref="popup"
		type="no-padding"
		:show-close-button="false"
		class="dropdown"
		:popper-options="popperOptions"
		:class="{
			'is-open': isOpen,
			'dropdown--theme-site-settings': theme === 'site-settings',
		}"
		@toggle="isOpen = $event"
	>
		<template #trigger="{ toggle }">
			<div
				class="dropdown__trigger"
				@click="toggle"
			>
				<ZyroLabel
					v-if="label"
					ref="labelRef"
					:for="id"
					:bold="bold"
					class="dropdown__label"
				>
					{{ label }}
				</ZyroLabel>

				<ZyroFieldWrapper>
					<template #prefix>
						<slot name="prefix" />
					</template>
					<button
						v-if="modelValue"
						v-qa="`dropdown-button-select-${currentItem.title}`"
						class="dropdown__button z-body-small"
						:class="[`dropdown__button--${color}`, `dropdown__button--${buttonSize}`]"
						@click.prevent
					>
						<ZyroSvgDeprecated
							v-if="modelValue.svg"
							:name="modelValue.svg"
							class="dropdown__button-prefix-img"
						/>
						<span class="dropdown__option-title">
							<span
								v-if="showOptionPrefix(currentItem)"
								class="dropdown__option-prefix"
							>
								{{ optionTitlePrefix(currentItem) }}
							</span>
							{{ currentItem.title }}
						</span>
						<span class="dropdown__icon">
							<ZyroSvgDeprecated
								name="chevron"
								direction="down"
							/>
						</span>
					</button>

					<template #suffix>
						<slot name="suffix" />
					</template>
				</ZyroFieldWrapper>

				<div
					v-if="message"
					ref="messageRef"
					class="zyro-dropdown__message"
				>
					{{ message }}
				</div>
			</div>
		</template>

		<div class="select">
			<button
				v-for="option in options"
				:key="option.value || option.title"
				v-qa="`dropdown-option-${option.title}`"
				class="select__item z-body-small"
				@click.prevent="handleSelect(option)"
			>
				<ZyroSvgDeprecated
					v-if="option.svg"
					:name="option.svg"
					class="select__item-prefix-icon"
					dimensions="16px"
				/>
				<span>
					<span
						v-if="showOptionPrefix(option)"
						class="dropdown__option-prefix"
					>
						{{ optionTitlePrefix(option) }}
					</span>
					{{ option.title }}
				</span>
				<ZyroSvgDeprecated
					v-if="isChecked(option)"
					name="check-mark"
					class="select__item-icon"
				/>
			</button>
		</div>
	</ZyroPopup>
</template>

<script>
import ZyroFieldWrapper from '@/components/global/ZyroFieldWrapper.vue';
import ZyroLabel from '@/components/global/ZyroLabel.vue';
import ZyroPopup from '@/components/global/ZyroPopup.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import {
	ref,
	defineComponent,
	computed,
} from 'vue';

export default defineComponent({

	components: {
		ZyroFieldWrapper,
		ZyroLabel,
		ZyroPopup,
		ZyroSvgDeprecated,
	},

	props: {
		id: {
			type: String,
			default: '',
		},
		label: {
			type: String,
			default: '',
		},
		message: {
			type: String,
			default: '',
		},
		options: {
			type: Array,
			required: true,
		},
		modelValue: {
			type: Object,
			default: null,
		},
		selectedItems: {
			type: Array,
			default: null,
		},
		bold: {
			type: Boolean,
			default: true,
		},
		buttonSize: {
			type: String,
			default: '',
			validator: (value) => [
				'',
				'large',
			].includes(value),
		},
		theme: {
			type: String,
			default: 'editor',
			validator: (value) => [
				'editor',
				'site-settings',
			].includes(value),
		},
		optionPrefixKey: {
			type: String,
			default: null,
		},
		valueToMatchChecked: {
			type: String,
			default: 'title',
		},
		color: {
			type: String,
			default: 'grey',
			validator(value) {
				return [
					'grey',
					'light',
				].includes(value);
			},
		},
	},
	emits: [
		'update:selectedItems',
		'update:model-value',
	],

	setup() {
		const messageRef = ref(null);
		const labelRef = ref(null);

		const popperOptions = computed(() => ({
			placement: 'bottom',
			modifiers: [
				{
					name: 'offset',
					options: {
						offset: ({ placement }) => {
							if (placement === 'bottom' && messageRef.value) {
								return [
									0,
									-messageRef.value.offsetHeight,
								];
							}

							if (placement === 'top' && labelRef.value) {
								return [
									0,
									-labelRef.value.$el.offsetHeight,
								];
							}

							return [
								0,
								0,
							];
						},
					},
				},
			],
		}));

		return {
			popperOptions,
			messageRef,
			labelRef,
		};
	},

	data() {
		return {
			isOpen: false,
		};
	},

	computed: {
		currentItem() {
			return this.selectedItems ? this.options[0] : this.modelValue;
		},
	},

	methods: {
		handleSelect(option) {
			if (this.selectedItems) {
				const updatedItems = this.isChecked(option)
					? this.selectedItems.filter((item) => item.title !== option.title)
					: [
						...this.selectedItems,
						option,
					];

				this.$emit('update:selectedItems', updatedItems);
			} else {
				this.$emit('update:model-value', option);
				this.$refs.popup.toggle();
			}
		},
		isChecked(option) {
			const hasMatchingOptionValues = !!option.value && (option.value === this.modelValue?.value);
			const hasMatchingOptionalValue = !!option[this.valueToMatchChecked]
				&& this.modelValue && option[this.valueToMatchChecked] === this.modelValue[this.valueToMatchChecked];
			const isChecked = hasMatchingOptionValues || hasMatchingOptionalValue;

			return this.selectedItems
				? this.selectedItems.some((item) => item.title === option.title)
				: isChecked;
		},
		optionTitlePrefix(option) {
			return `${this.optionPrefixKey?.toUpperCase()} ${option[this.optionPrefixKey]}`;
		},
		showOptionPrefix(option) {
			return this.optionPrefixKey && option[this.optionPrefixKey];
		},
	},
});
</script>
<style lang="scss" scoped>
.dropdown {
	$this: &;

	position: relative;
	width: 100%;
	margin-bottom: 16px;

	// styled with v-deep for now, couldn't find any better way
	// how to modify the popup layout used for dropdown look.
	// This is temporary, because dropdown shoudln't depend onn popup in
	// the first place, but for quick option will fit. TODO: Refactor this without
	// popup so no v-deep would be used and no not needed dependencies on other components
	// would be created.
	/* stylelint-disable-next-line selector-class-pattern */
	:deep(.popup__card) {
		z-index: 1;
		width: 100%;
		max-width: none;

		.popup-card {
			&__head {
				padding: 0;
			}

			&__content {
				padding: 0;
			}
		}
	}

	&__label {
		padding: 8px 0;
		margin: 0;
		line-height: 16px;
	}

	&__trigger {
		width: 100%;
	}

	&__icon {
		margin-left: auto;
		transition: transform 0.1s;
	}

	&__button {
		display: flex;
		align-items: center;
		width: 100%;
		height: 40px;
		padding: 0 16px;
		transition: all 0.2s ease;

		&:hover,
		&:focus {
			background-color: $color-gray-light;
		}

		&--large {
			height: 45px;
		}

		&--grey {
			background-color: $color-gray-light;
		}

		&--light {
			background-color: $color-light;
		}
	}

	&__button-prefix-img {
		margin-right: 10px;
	}

	&.is-open {
		#{$this}__icon {
			transform: rotate(180deg);
		}
	}

	&--theme-site-settings {
		margin-bottom: 0;

		#{$this}__button {
			height: 52px;
			background: $color-light;
			border: 1px solid $color-gray-border;
			border-radius: 8px;
		}
	}

	&__option-prefix {
		color: $color-gray;
	}

	&__option-title {
		padding-right: 5px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
}

.select {
	display: flex;
	flex-direction: column;
	width: calc(100% - 4px);
	max-height: 200px;
	padding: 8px 0;
	overflow-y: auto;
	border-radius: 5px;

	&__item {
		display: flex;
		align-items: center;
		padding: 10px 12px 10px 18px;
		text-align: start;
		transition: background-color 0.1s ease-in-out;

		&:hover,
		&:focus {
			background-color: $color-gray-light;
		}
	}

	&__item-icon {
		margin-left: auto;
	}

	&__item-prefix-icon {
		margin-right: 8px;
	}
}

.zyro-dropdown {
	&__message {
		// Margin is not included in offsetHeight in js, so using padding
		padding-top: 8px;
		font-size: 13px;
		color: $color-gray;
		text-align: left;
	}
}
</style>
