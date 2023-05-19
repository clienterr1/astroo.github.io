<template>
	<div
		class="zyro-icon-select"
		:style="computedStyles"
	>
		<ZyroLabel
			v-if="label"
			:padding="labelPadding"
		>
			{{ label }}
		</ZyroLabel>
		<div class="zyro-icon-select__options">
			<label
				v-for="(option, key) in options"
				:key="`icon-${key}`"
				v-qa="`option-${key}`"
				class="zyro-icon-select__label"
				:class="{ 'zyro-icon-select__label--current' : key === modelValue }"
			>
				<input
					class="zyro-icon-select__input"
					:type="isTogglable ? 'checkbox' : 'radio'"
					:name="isTogglable ? option.name : groupName"
					:value="key"
					@change="updateCurrentSelection(key)"
					@click="$emit('option-click', key)"
				>
				<div
					class="zyro-icon-select__icon-container"
				>
					<ZyroSvgDeprecated
						:name="option.icon"
						class="zyro-icon-select__icon"
						:dimensions="option.iconDimensions || '42px'"
					/>
				</div>
				<span class="zyro-icon-select__name z-body-small">
					{{ option.name }}
				</span>
			</label>
		</div>
	</div>
</template>

<script>
import ZyroLabel from '@/components/global/ZyroLabel.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import { defineComponent } from 'vue';

export default defineComponent({

	components: {
		ZyroLabel,
		ZyroSvgDeprecated,
	},

	props: {
		modelValue: {
			type: String,
			default: null,
		},
		options: {
			type: Object,
			validator: (options) => Object.values(options).every((option) => option.name && option.icon),
			required: true,
		},
		label: {
			type: String,
			default: '',
		},
		labelPadding: {
			type: String,
			default: null,
		},
		iconContainerPadding: {
			type: String,
			default: '18px 10px',
		},
		itemsPerRow: {
			type: Number,
			default: 2,
		},
		isTogglable: {
			type: Boolean,
			default: false,
		},
		groupName: {
			type: String,
			default: 'group',
		},
		activeIconColor: {
			type: String,
			default: null,
		},
		activeBackgroundColor: {
			type: String,
			default: null,
		},
	},
	emits: ['update:model-value'],

	computed: {
		computedStyles() {
			return {
				'--items-per-row': this.itemsPerRow,
				'--icon-container-padding': this.iconContainerPadding,
				'--icon-active-color': this.activeIconColor,
				'--background-active-color': this.activeBackgroundColor,
			};
		},
	},

	methods: {
		updateCurrentSelection(selection) {
			const shouldUncheckSelection = this.isTogglable && selection === this.modelValue;

			this.$emit('update:model-value', shouldUncheckSelection ? null : selection);
		},
	},
});
</script>

<style lang="scss" scoped>
@mixin active-style() {
	--select-border: #{$color-azure};
	--select-background: var(--background-active-color, #{$color-gray-light});
}

.zyro-icon-select {
	$this: &;

	&__options {
		display: grid;
		grid-template-columns: repeat(var(--items-per-row), 1fr);
		grid-gap: 16px;
	}

	&__input {
		width: 0;
		height: 0;
		opacity: 0;

		&:focus-visible {
			+ #{$this}__icon-container {
				@include active-style;
			}
		}
	}

	&__label {
		display: flex;
		flex-direction: column;
		cursor: pointer;

		&--current {
			@include active-style;

			#{$this}__icon {
				color: var(--icon-active-color, #{$color-gray});
			}
		}
	}

	&__name {
		margin-top: 8px;
		text-align: center;
	}

	&__icon {
		margin: auto;
		color: $color-gray;
	}

	&__icon-container {
		display: flex;
		height: 100%;
		padding: var(--icon-container-padding);
		background: var(--select-background);
		border: 1px solid var(--select-border, $color-gray-border);
		border-radius: $border-radius-small;
	}
}
</style>
