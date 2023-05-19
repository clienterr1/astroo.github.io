<template>
	<div class="options">
		<div
			v-for="option in options"
			:key="option.id"
			class="options__row"
		>
			<ZyroSvgDeprecated
				class="options__row-icon"
				:name="`${tag}-empty`"
				dimensions="16px"
			/>
			<ZyroFieldInput
				class="options__input"
				:model-value="option.value"
				@update:model-value="updateOptionName({
					value: $event,
					id: option.id
				})"
			/>
			<ZyroButton
				class="options__trash"
				@click="removeOption(option.id)"
			>
				<ZyroSvgDeprecated
					class="option__trash-icon"
					name="trash"
					dimensions="16px"
				/>
			</ZyroButton>
		</div>
		<div class="options__row">
			<ZyroButton
				color="black"
				@click="addNewOption"
			>
				<ZyroSvgDeprecated
					class="options__icon-add"
					name="plus"
					dimensions="16px"
				/>
				{{ $t('builder.editForm.addOption') }}
			</ZyroButton>
		</div>
	</div>
</template>
<script>
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroFieldInput from '@/components/global/ZyroFieldInput.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import { generateRandomId } from '@/utils/generateRandomId';

import { defineComponent } from 'vue';

export default defineComponent({

	components: {
		ZyroButton,
		ZyroFieldInput,
		ZyroSvgDeprecated,
	},

	props: {
		options: {
			type: Array,
			default: () => ([]),
		},
		tag: {
			type: String,
			default: 'radio',
		},
	},
	emits: ['update'],

	methods: {
		updateOptionName({
			value,
			id,
		}) {
			const newOptions = this.options.map((option) => (option.id === id ? {
				id,
				value,
			} : option));

			this.saveUpdatedOptions(newOptions);
		},
		addNewOption() {
			const newOptions = [
				...this.options,
				{
					id: generateRandomId(),
					value: `${this.$t('builder.editForm.option')} ${this.options.length + 1}`,
				},
			];

			this.saveUpdatedOptions(newOptions);
		},
		removeOption(optionId) {
			const newOptions = this.options.filter(({ id }) => (id !== optionId));

			this.saveUpdatedOptions(newOptions);
		},
		saveUpdatedOptions(value) {
			this.$emit('update', value);
		},
	},
});
</script>
<style lang="scss" scoped>
.options {
	&__row {
		display: flex;
		flex-direction: row;
	}

	&__row-icon {
		align-self: center;
		margin-right: 8px;
		margin-bottom: 16px;
	}

	&__input {
		width: 100%;
	}

	&__trash {
		margin-bottom: 16px;
	}

	&__trash-icon {
		align-self: center;
		color: $color-gray;

		&:hover {
			color: red;
		}
	}

	&__icon-add {
		margin-right: 8px;
	}
}
</style>
