<template>
	<EditableItemsList
		:items="editableItems"
		:placeholder="placeholder"
		:item-placeholder-text="itemPlaceholderText"
		:validate-value="validateValue"
		:is-editable-by-double-click="isEditable"
		@edit="$emit('edit', $event)"
		@update-items="$emit('update-items', $event)"
	>
		<template #header>
			<EditableItemsAddButton
				:button-text="buttonText"
				:placeholder="placeholder"
				:validate-value="validateValue"
				@add="$emit('add', $event)"
			>
				<template #button="{ showInput }">
					<EditableItemsDropdown
						:items="dropdownItems"
						:selected-items="selectedItems"
						:title="title"
						@select="$emit('select', $event)"
						@deselect="$emit('deselect', $event)"
					>
						<template #custom-buttons>
							<button
								class="dropdown-item dropdown-item--custom-button"
								data-qa="dropdown-add-button"
								:title="buttonText"
								@click="showInput"
							>
								<div class="dropdown-item__icon">
									<ZyroSvgDeprecated name="plus" />
								</div>
								<p class="z-body-small">
									{{ buttonText }}
								</p>
							</button>
						</template>
					</EditableItemsDropdown>
				</template>
			</EditableItemsAddButton>
		</template>
		<template #item-button="{ item }">
			<ZyroButton
				icon="x"
				:title="$t('common.remove')"
				@click="$emit('deselect', item.name)"
			>
				<template #icon>
					<Icon
						name="close"
						dimensions="20px"
					/>
				</template>
			</ZyroButton>
		</template>
	</EditableItemsList>
</template>

<script>
import Icon from '@/components/global/Icon.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import EditableItemsAddButton from '@/components/reusable-components/editable-items-list/-partials/EditableItemsAddButton.vue';
import EditableItemsDropdown from '@/components/reusable-components/editable-items-list/-partials/EditableItemsDropdown.vue';

import EditableItemsList from '@/components/reusable-components/editable-items-list/EditableItemsList.vue';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		Icon,
		ZyroButton,
		ZyroSvgDeprecated,
		EditableItemsList,
		EditableItemsAddButton,
		EditableItemsDropdown,
	},

	props: {
		editableItems: {
			type: Array,
			default: () => [],
		},
		placeholder: {
			type: String,
			default: '',
		},
		title: {
			type: String,
			default: '',
		},
		buttonText: {
			type: String,
			default: '',
		},
		dropdownItems: {
			type: Array,
			default: () => [],
		},
		selectedItems: {
			type: Array,
			default: () => [],
		},
		isEditable: {
			type: Boolean,
			default: true,
		},
		validateValue: {
			type: Function,
			default: null,
		},
		itemPlaceholderText: {
			type: String,
			default: null,
		},
	},

	emits: [
		'edit',
		'update-items',
		'add',
		'select',
		'deselect',
	],
});
</script>

<style lang="scss" scoped>
@import "@/components/reusable-components/editable-items-list/-partials/DropdownItem";
</style>
