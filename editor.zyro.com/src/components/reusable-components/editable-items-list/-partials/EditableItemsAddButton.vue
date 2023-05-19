<template>
	<EditableItemsItemEditor
		v-if="isInputShown"
		:model-value="inputValue"
		class="add-button-input"
		:placeholder="placeholder"
		:error="error"
		@update:model-value="handleInput"
		@submit="submitValue"
		@click-outside="hideInput"
	/>
	<div
		v-else
		class="add-button-container"
	>
		<slot
			name="button"
			:show-input="showInput"
		>
			<ZyroButton
				class="add-button"
				data-qa="edititems-list-btn-additem"
				@click="isInputVisibleOnAddClick && showInput()"
			>
				<template #icon-left>
					<Icon
						name="add_circle"
						dimensions="16px"
					/>
				</template>
				{{ buttonText }}
			</ZyroButton>
		</slot>
	</div>
</template>

<script>
import Icon from '@/components/global/Icon.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';

import EditableItemsItemEditor from '@/components/reusable-components/editable-items-list/-partials/EditableItemsItemEditor.vue';

import {
	useEditableItemInput,
	defaultValidator,
} from '@/components/reusable-components/editable-items-list/useEditableItemInput';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		Icon,
		ZyroButton,
		EditableItemsItemEditor,
	},

	props: {
		buttonText: {
			type: String,
			default: '',
		},
		placeholder: {
			type: String,
			default: '',
		},
		validateValue: {
			type: Function,
			default: defaultValidator,
		},
		isInputVisibleOnAddClick: {
			type: Boolean,
			default: true,
		},
	},

	setup(props, context) {
		const {
			handleInput,
			showInput,
			hideInput,
			submitValue,
			isInputShown,
			inputValue,
			error,
		} = useEditableItemInput(props, context);

		return {
			handleInput,
			showInput,
			hideInput,
			submitValue,
			isInputShown,
			inputValue,
			error,
		};
	},
});
</script>

<style lang="scss" scoped>
@import "./AddButton";

.add-button-input {
	margin-bottom: 1px;
}

// Position relative is needed if dropdown is passed as custom button
.add-button-container {
	position: relative;
}
</style>
