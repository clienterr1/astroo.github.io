<template>
	<div class="tags-list">
		<button
			v-for="(tag, index) in tags"
			:key="`tag-${index}`"
			class="tag"
			:class="{ 'tag--selected': isSelected(tag) }"
			:disabled="!isSelected(tag) && isMaxTagsSelected && !isSingleSelect"
			@click.prevent="toggleTag(tag)"
		>
			{{ displayProperty ? tag[displayProperty] : tag }}
		</button>
	</div>
</template>

<script>
import {
	defineComponent,
	computed,
} from 'vue';

export default defineComponent({
	props: {
		tags: {
			type: Array,
			required: true,
		},
		modelValue: {
			type: Array,
			default: () => [],
		},
		maxSelections: {
			type: Number,
			default: null,
		},
		displayProperty: {
			type: String,
			default: null,
		},
		isSingleSelect: {
			type: Boolean,
			default: false,
		},
	},

	emits: [
		'update:model-value',
		'select',
		'deselect',
	],

	setup(props, { emit }) {
		const maxSelectionCount = computed(() => (props.isSingleSelect ? 1 : props.maxSelections));
		const isMaxTagsSelected = computed(() => maxSelectionCount.value && props.modelValue.length >= props.maxSelections);

		const isSelected = (tag) => props.modelValue.includes(tag);

		const toggleTag = (tag) => {
			if (props.isSingleSelect) {
				emit('update:model-value', [tag]);
				emit('select', tag);

				return;
			}

			if (props.modelValue.includes(tag)) {
				emit('update:model-value', props.modelValue.filter((selectedTag) => selectedTag !== tag));
				emit('deselect', tag);

				return;
			}

			emit('update:model-value', [
				...props.modelValue,
				tag,
			]);
			emit('select', tag);
		};

		return {
			isSelected,
			toggleTag,
			isMaxTagsSelected,
		};
	},
});
</script>

<style lang="scss" scoped>
.tags-list {
	display: flex;
	flex-wrap: wrap;
	gap: 12px;
}

.tag {
	padding: 6px 16px;
	font-size: 14px;
	line-height: 1.4;
	color: $color-gray;
	cursor: pointer;
	border: 1px solid $color-gray-border;
	border-radius: 100px;
	transition: all 0.3s ease;

	&--selected {
		color: $color-primary;
		background-color: $color-primary-light;
		border-color: $color-primary;
	}

	&:hover {
		color: $color-primary;
		background-color: $color-primary-light;
	}

	&:disabled {
		color: $color-gray;
		cursor: not-allowed;
	}
}
</style>
