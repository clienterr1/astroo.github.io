<template>
	<div class="page-list">
		<div
			v-if="title"
			class="page-list__title z-body-small z-body-small--strong"
		>
			{{ title }}
		</div>
		<div
			v-if="subtitle"
			class="page-list__description z-body-small"
		>
			{{ subtitle }}
		</div>
		<EditableItemsList
			ref="itemsRef"
			class="page-list__list"
			:class=" { 'page-list__list--empty': isEmpty }"
			:items="navigationItems"
			:scrollable="false"
			:is-editable-by-double-click="false"
			:group-id="groupId"
			:move-callback="moveCallback"
			@draggable-end="(sortableData) => $emit('draggable-end', sortableData)"
			@edit="(data) => $emit('edit', data)"
			@item-click="$emit('item-click', $event)"
		>
			<template #header>
				<div
					v-if="isEmpty"
					class="page-list__empty-block"
				>
					<slot name="placeholder" />
				</div>
			</template>
			<template #item-button="{ item, index, startEditingItem }">
				<DrawerListItemPopup
					:item="item"
					@open-page-settings-popup="$emit('open-page-settings-popup', $event)"
					@start-renaming="startEditingItem(index, item)"
				/>
				<ZyroSvgDeprecated
					v-if="item.isWithPassword"
					name="key"
					class="page-list__item-lock"
				/>
			</template>
			<template #item-placeholder>
				<EmptyPagesBlock
					class="page-list__item-placeholder"
					:title="$t('builder.siteMenu.emptyDropdown')"
					:subtitle="$t('builder.siteMenu.emptyDropdownSubtitle')"
				/>
			</template>
		</EditableItemsList>

		<slot
			name="item-tooltip"
			:targetRef="itemsRef"
		/>
	</div>
</template>

<script>

import DrawerListItemPopup from '@/components/builder-controls/multipage-drawer/DrawerListItemPopup.vue';
import EmptyPagesBlock from '@/components/builder-controls/multipage-drawer/EmptyPagesBlock.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import EditableItemsList from '@/components/reusable-components/editable-items-list/EditableItemsList.vue';

import {
	defineComponent,
	ref,
} from 'vue';

export default defineComponent({
	components: {
		DrawerListItemPopup,
		EditableItemsList,
		EmptyPagesBlock,
		ZyroSvgDeprecated,
	},

	props: {
		title: {
			type: String,
			default: '',
		},
		subtitle: {
			type: String,
			default: '',
		},
		navigationItems: {
			type: Array,
			default: () => [],
		},
		groupId: {
			type: String,
			default: null,
		},
		moveCallback: {
			type: Function,
			default: null,
		},
	},

	emits: [
		'draggable-end',
		'open-page-settings-popup',
		'item-click',
		'edit',
	],

	setup() {
		const itemsRef = ref(null);

		return {
			itemsRef,
		};
	},

	computed: {
		isEmpty() {
			return this.navigationItems.length === 0;
		},
	},
});
</script>

<style lang="scss" scoped>
.page-list {
	width: 100%;
	margin-top: 32px;

	&__title,
	&__description {
		padding: 0 24px;
		padding-bottom: 8px;
	}

	&__description {
		color: $color-gray;
	}

	&__list {
		position: relative;
		min-height: 100%;
		margin: 0 8px;

		/**
		* Don't want to clutter editItemsList with edge-case handling style props,
		* so styling from parent
		*/
		&--empty {
			& :deep(.items__dropdown-area) {
				position: absolute;
				top: 0;
				right: 0;
				left: 0;

				.items-list-inner {
					min-height: 64px;
				}
			}
		}
	}

	&__empty-block {
		pointer-events: none;
	}

	&__item-placeholder {
		margin: 0 8px;
	}

	&__item-lock {
		position: absolute;
		top: 0;
		right: 60px;
		bottom: 0;
		width: 16px;
		height: 16px;
		margin: auto;
		opacity: 0.3;
	}
}
</style>
