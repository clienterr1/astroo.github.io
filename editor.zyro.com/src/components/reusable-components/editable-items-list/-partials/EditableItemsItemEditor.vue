<template>
	<form
		ref="itemEditorRef"
		class="item-editor"
		data-qa="edit-items-item-editor-form"
		@submit.prevent="$emit('submit')"
	>
		<ZyroFieldInput
			color="light"
			class="item-editor__input"
			padding="7px"
			:error="error"
			:placeholder="placeholder"
			:model-value="modelValue"
			focus-on-mount
			input-data-qa="edititems-item-input-newitem"
			@update:model-value="$emit('update:model-value', $event)"
		/>
		<ZyroButton
			color="black"
			theme="primary"
			class="item-editor__button"
			border-radius="0px"
			type="submit"
			data-qa="edititems-item-btn-additem"
		>
			<template #icon>
				<Icon
					name="check-mark-thick"
					dimensions="16px"
					is-custom
				/>
			</template>
		</ZyroButton>
	</form>
</template>

<script>
import Icon from '@/components/global/Icon.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroFieldInput from '@/components/global/ZyroFieldInput.vue';
import { onClickOutside } from '@vueuse/core';
import {
	ref,
	defineComponent,
} from 'vue';

export default defineComponent({
	components: {
		Icon,
		ZyroButton,
		ZyroFieldInput,
	},

	props: {
		modelValue: {
			type: String,
			default: '',
		},
		placeholder: {
			type: String,
			default: '',
		},
		error: {
			type: String,
			default: '',
		},
	},

	emits: ['update:model-value'],

	setup(props, context) {
		const itemEditorRef = ref(null);

		onClickOutside(itemEditorRef, () => {
			context.emit('click-outside');
		});

		return {
			itemEditorRef,
		};
	},

});
</script>

<style lang="scss" scoped>
.item-editor {
	display: grid;
	grid-template-columns: 1fr auto;
	grid-column: 1/-1;
	grid-gap: 10px;
	align-items: flex-start;
	width: 100%;
	padding: 12px;
	background: $color-gray-light;

	&__input {
		margin-bottom: 0;

		/* stylelint-disable-next-line selector-class-pattern */
		:deep(.zyro-input__input) {
			padding: 9px 16px;
		}
	}

	&__button {
		overflow: hidden;
	}
}
</style>
