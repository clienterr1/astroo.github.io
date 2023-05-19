<template>
	<div
		class="items"
	>
		<slot name="header" />
		<div
			ref="items"
			class="items__dropdown-area"
			:class="{ 'items-list-scrollable': isScrollable }"
		>
			<!-- `force-fallback` needs a binded true value, otherwise it doesn't get set -->
			<Draggable
				:model-value="items"
				:item-key="groupId"
				tag="ul"
				:group="{ name: groupName }"
				:data-group-id="groupId"
				:class="{ 'items-list-inner--scrollable': isScrollable }"
				class="items-list-inner"
				ghost-class="drop-placeholder"
				drag-class="item-ghost-dragged"
				handle=".item__drag-handle"
				animation="200"
				direction="vertical"
				easing="cubic-bezier(0.34, 1.56, 0.64, 1)"
				filter=".item-button"
				:force-fallback="true"
				:inverted-swap-threshold="0.4"
				:disabled="isItemBeingEdited"
				:swap-threshold="0.4"
				:empty-insert-threshold="4"
				:prevent-on-filter="false"
				:move="handleMove"
				@update:model-value="$emit('update-items', $event)"
				@end="handleDragEnd"
			>
				<template
					#item="{ element: item, index }"
				>
					<li
						:key="`${item.name}-item-${index}`"
						v-qa="`editableitemlist-${item.name || item.id || item.navItemId}-itemcontainer`"
						:data-item-id="item.id || item.navItemId || item.name"
						class="item-container"
						:data-text="itemPlaceholderText ?? $t('builder.editableItemsList.placeholder')"
					>
						<div
							class="item"
							:class="{
								'item--with-icon': item.icon || item.image,
								'item--disabled': item.isDisabled,
								'item--active': currentItemIndex === index,
								'item--selected': currentSelectedItemIndex === index,
								'item--before-active': currentItemIndex === index + 1,
								'item--no-border': isItemPlaceholderShown(item),
							}"
							@click="$emit('item-click', item)"
						>
							<EditableItemsItemEditor
								v-if="index === currentItemIndex"
								:model-value="inputValue"
								:placeholder="placeholder"
								:error="error"
								@submit="editCurrentItem"
								@update:model-value="handleInput"
								@click-outside="stopEditing"
							/>
							<template v-else>
								<ZyroTooltip
									position="right"
									toggle-event="hover"
									:use-portal="false"
									content-position="absolute"
									size="small"
									:forced-position="{
										left: '36px',
										bottom: '0',
										'white-space': 'nowrap'
									}"
								>
									<template #trigger>
										<ZyroButton
											class="item__drag-handle"
											theme="plain"
											color="black"
											:title="$t('common.move')"
										>
											<template #icon>
												<Icon
													name="drag_indicator"
													dimensions="16px"
												/>
											</template>
										</ZyroButton>
									</template>
									<p class="section-control__resize-handle-text z-body-small">
										{{ $t('builder.editableItemsList.dragToMove') }}
									</p>
								</ZyroTooltip>
								<ZyroSvgDeprecated
									v-if="item.icon"
									class="item__icon"
									:location="item.iconLocation"
									:name="item.icon"
								/>
								<FlagDropdown
									v-if="item.locale"
									:language="item"
								/>
								<p
									v-qa="`${item.vQa}`"
									class="z-body-small item__content"
									:class="{ 'z-body-small--strong': item.isCurrent }"
									@dblclick="startEditingItemByDoubleClick(index, item)"
								>
									{{ item.name }}
									<span
										v-if="item.pill"
										data-qa="pill"
										class="z-body-small item__content pill"
									>
										{{ item.pill }}
									</span>
								</p>

								<div
									class="item-button"
									:class="{ 'item__right-side-button' : isScrollable }"
								>
									<slot
										name="item-button"
										:item="item"
										:index="index"
										:start-editing-item="() => startEditingItem(index, item)"
									/>
								</div>
							</template>
						</div>
						<div v-show="isItemPlaceholderShown(item)">
							<slot name="item-placeholder" />
						</div>
						<div
							v-if="item.hasSubList && item.subItems"
							class="item-container__subitems"
						>
							<EditableItemsList
								v-bind="{
									...$props,
									items: item.subItems,
									groupId: item.id || item.navItemId,
								}"

								@draggable-end="(sortableData) => $emit('draggable-end', sortableData)"
								@edit="(data) => $emit('edit', data)"
								@item-click="$emit('item-click', $event)"
							>
								<!-- https://github.com/vuejs/eslint-plugin-vue/issues/1165#issuecomment-634305195 -->
								<!--
								Pass scoped slots down to the subitems list
								(https://gist.github.com/loilo/73c55ed04917ecf5d682ec70a2a1b8e2)
							-->
								<template
									v-for="(_, name) in $slots"
									#[name]="slotData"
								>
									<slot
										:name="name"
										v-bind="slotData"
									/>
								</template>
							</EditableItemsList>
						</div>
					</li>
				</template>
			</Draggable>
		</div>
	</div>
</template>

<script>
import Icon from '@/components/global/Icon.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';
import ZyroTooltip from '@/components/global/ZyroTooltip.vue';

/**
 * EditableItemsList.vue
 * Component for sorting an array of object and editing them. Supports multi-level lists.
 * Events:
 * @item-click - item in a list is clicked.
 * @update-items - returns updated array of items after sorting an element.
 * @edit - item in a list has been edited. Returns (itemBeforeEdit, itemAfterEdit, itemArrayIndex).
 * @draggable-move - drag event has occured. Check `handleMove` for more details.
 * @draggable-end - drag event has ended. Check `handleDragEnd` for return value.
 * @draggable-add - add event has ended. Check `handleDragAdd` for return value.
 *
 * Slots:
 *  header: allows to add custom header to the list.
 *  item-button: allows to add a custom button/any element to the most right of the button.
 *   Exposed slotted attributes:
 *    item (Object). Data of the current item.
 *    index (Number). Index of the current item in the list.
 *    startEditingItem (Function). Triggers the start of editing the current item.
 */
import Draggable from 'vuedraggable';
import EditableItemsItemEditor from '@/components/reusable-components/editable-items-list/-partials/EditableItemsItemEditor.vue';
import FlagDropdown from '@/components/multilingual/FlagDropdown.vue';

import {
	useEditableItemInput,
	defaultValidator,
} from '@/components/reusable-components/editable-items-list/useEditableItemInput';

import { defineComponent } from 'vue';

export default defineComponent({

	// Recursive usage of a component needs a defined name
	name: 'EditableItemsList',

	components: {
		Icon,
		ZyroButton,
		ZyroSvgDeprecated,
		ZyroTooltip,
		EditableItemsItemEditor,
		Draggable,
		FlagDropdown,
	},

	props: {
		/**
		 * Array of objects be rendered. The structure is as follows:
		 *
		 * Required attributes:
		 *  name: (String, Required). Value that will be showed as item content.
		 *
		 * Optional attributes:
		 *  id (String). Unique identifier for the item. Fallbacks to `name`.
		 *  icon (String). Icon for the item.
		 *  iconLocation (String). Attribute passed to ZyroSvgDeprecated.vue.
		 *  iconTitle (String). Attribute passed to ZyroSvgDeprecated.vue.
		 *  isDisabled (Boolean). Determines whether disabled styles should be applied to the item.
		 *  isCurrent (Boolean). Determines whether currently selected item styles should be applied.
		 *  vQa (String). v-qa directive value for the item.
		 *  subItems (Array of items). Items to be displayed as a sub-list of the item.
		 *  hasSubList (Boolean). Used in conjunction with subItems. If item has subItems attribute,
		 *    but subItems array is empty, an empty list still exists so items could be dragged into it.
		 *    But, if this attribute is active, sub-list won't be created.
		 *    This can be used to limit the depth of the lists.
		 *   isItemPlaceholderShown (Boolean). Determines wether a placeholder below an item is shown. Is used in conjunction
		 *   with items subItems array length and with isItemBeingMoved data property. Check isItemBeingMoved method for more details.
		 */
		items: {
			type: Array,
			default: () => [],
			validator: (value) => {
				if (value.length > 0) {
					return value.every((item) => 'name' in item);
				}

				return true;
			},
		},
		/**
		 * Value to be shown when edit input field is empty
		 */
		placeholder: {
			type: String,
			default: '',
		},
		/**
		 * Determines wether items in the list can be edited by double clicking them
		 */
		isEditableByDoubleClick: {
			type: Boolean,
			default: true,
		},
		/**
		 * Determines wether the list should have a maximum height (300px) and when it reaches it,
		 * become scrollable.
		 */
		scrollable: {
			type: Boolean,
			default: true,
		},
		/**
		 * "VueDraggable" list group name.
		 * Useful when using `handleAdd` even to determine
		 * the name of the list to which the item has been addded.
		 */
		groupName: {
			type: String,
			default: 'draggable-items',
		},
		/**
		 * Returned by the `handleAdd` and `handleDragEnd` events.
		 * This is the ID which is applied to the ROOT list.
		 * All sublists get the ID of the parent item.
		 */
		groupId: {
			type: String,
			default: 'draggable-items',
		},
		/**
		 * "VueDraggable" move callback.
		 * https://github.com/SortableJS/Vue.Draggable#move
		 * Useful to control to which items dragging should be allowed.
		 * Check handleMove for passed event data
		 */
		moveCallback: {
			type: Function,
			default: null,
		},
		/**
		 * Custom validator for the input.
		 * If validation fails, error message is shown and submit of editing is not allowed.
		 * By default, validator checks if the value is empty.
		 */
		validateValue: {
			type: Function,
			default: defaultValidator,
		},
		currentSelectedItemIndex: {
			type: Number,
			default: null,
		},
		itemPlaceholderText: {
			type: String,
			default: null,
		},
	},

	emits: [
		'update-items',
		'edit',
		'draggable-move',
		'draggable-end',
		'item-click',
	],

	setup(props, context) {
		const {
			handleInput,
			setInputValue,
			inputValue,
			error,
		} = useEditableItemInput(props, context);

		return {
			handleInput,
			setInputValue,
			inputValue,
			error,
		};
	},

	data() {
		return {
			currentItemIndex: null,
			isItemBeingMoved: false,
		};
	},

	computed: {
		/**
		 * Temporary hack until we have positioning issues fixed.
		 * If list items have a button with popup, popup gets hidden and unclickable because
		 * of `overflow: scroll`. 5 items is an approximate value until list gets scrollable
		 * and when it should have `overflow: scroll`.
		 *
		 */
		isScrollable() {
			return this.scrollable && this.items.length >= 5;
		},
		isItemBeingEdited() {
			return this.currentItemIndex !== null;
		},
	},

	methods: {
		isItemPlaceholderShown(item) {
			return !this.isItemBeingMoved && item.subItems?.length === 0 && item.isItemPlaceholderShown;
		},
		startEditingItemByDoubleClick(index, item) {
			if (!this.isEditableByDoubleClick) {
				return;
			}

			this.startEditingItem(index, item);
		},
		startEditingItem(index, { name }) {
			this.currentItemIndex = index;
			this.setInputValue(name);
		},
		stopEditing() {
			this.currentItemIndex = null;
		},
		editCurrentItem() {
			if (this.error) {
				return;
			}

			const itemBeforeEdit = this.items[this.currentItemIndex];

			this.$emit('edit', {
				oldValue: itemBeforeEdit,
				newValue: {
					...itemBeforeEdit,
					name: this.inputValue,
				},
				index: this.currentItemIndex,
			});
			this.setInputValue('');
			this.currentItemIndex = null;
		},
		/**
		 * Parses out data from sortable event.
		 * Returns:
		 *  fromId - ID of the group from which the element was moved
		 *  toId - ID of the group to which the element was moved
		 *  itemId - ID of the item that was moved
		 *  oldIndex - index of the item in the old group array
		 *  newIndex - index of the item in the new group array
		 */
		getSortableEventData(sortableEvent) {
			const {
				from,
				to,
				item,
				oldIndex,
				newIndex,
			} = sortableEvent;
			const fromId = from.dataset.groupId;
			const toId = to.dataset.groupId;
			const { itemId } = item.dataset;

			return {
				fromId,
				toId,
				itemId,
				oldIndex,
				newIndex,
			};
		},
		handleMove(draggableEvent) {
			this.isItemBeingMoved = true;
			this.$emit('draggable-move');

			if (!this.moveCallback) {
				return null;
			}

			const toId = draggableEvent.to.dataset.groupId;
			const fromId = draggableEvent.from.dataset.groupId;
			const item = draggableEvent.draggedContext.element;

			return this.moveCallback({
				fromId,
				toId,
				item,
			});
		},
		handleDragEnd(sortableEvent) {
			this.isItemBeingMoved = false;
			this.$emit('draggable-end', this.getSortableEventData(sortableEvent));
		},
	},
});
</script>

<style lang="scss" scoped>
.pill {
	padding: 0 8px;
	margin-left: 6px;
	font-weight: 700;
	color: $color-light;
	background: $color-azure;
	border-radius: 100px;
}

.items-list-inner {
	display: flex;
	flex-direction: column;
	width: 100%;
	list-style: none;

	&--scrollable {
		max-height: 300px;
	}
}

.items-list-scrollable {
	padding-right: 8px;
	overflow-y: scroll;
}

.items {
	&__add-item {
		margin-bottom: 1px;
	}

	&__add-item-button {
		width: 100%;
	}

	&__add-item-button-container {
		position: relative;
		padding: 20px 0;
		margin-left: 4px;
	}
}

.item {
	$this: &;

	position: relative;
	display: grid;
	grid-template-columns: auto 1fr auto;
	grid-gap: 8px;
	align-items: center;
	padding: 12px 0;
	cursor: pointer;
	border-bottom: 1px solid $color-gray-border;

	&__drag-handle {
		min-width: 24px;
		overflow: hidden;
		cursor: move;
	}

	&__icon {
		max-width: 16px;
	}

	&__content {
		margin-bottom: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	&__right-side-button {
		margin-left: auto;
		overflow: hidden;
	}

	&-button {
		justify-self: self-start;
	}

	&--before-active {
		margin-bottom: 1px;
		border-bottom: none;
	}

	&--active {
		padding: 0;
		margin-bottom: 1px;
		border-bottom: none;
	}

	&--selected {
		background-color: $color-gray-light;
		border: 1px solid $color-gray;
	}

	&--with-icon {
		grid-template-columns: 36px 46px minmax(auto, 200px) auto;
	}

	&--disabled {
		color: $color-gray;
	}

	&--no-border {
		border-bottom: 1px solid transparent;
	}

	&:hover,
	&:focus {
		background: $color-gray-light;
		transition: background 0.3s ease 0s;
	}
}

.item-container {
	&__subitems {
		margin-left: 32px;

		.item {
			padding-right: 24px;
		}
	}
}

.item-ghost-dragged {
	background-color: $color-gray-light;
	opacity: 0.8;

	// Draggable shows cloned item - including the tooltip, so hide it.
	:deep() {
		.tooltip {
			&__content,
			&__triangle {
				visibility: hidden;
			}
		}
	}
}

// Draggable allows only CSS class for placeholder styles, so no custom HTML can be used.
// Because of that, all the content inside is created via CSS.
.drop-placeholder {
	position: relative;
	font-size: 14px;
	font-weight: 700;
	line-height: 1.43;
	color: $color-gray;
	text-align: center;
	visibility: hidden;

	&::before {
		position: absolute;
		top: 6px;
		left: 0;
		width: 100%;
		padding: 16px;
		visibility: visible;
		content: attr(data-text);
		border: 1px dashed $color-gray-border;
	}

	&::after {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 2px;
		visibility: visible;
		content: "";
		background-color: $color-azure;
	}
}
</style>
