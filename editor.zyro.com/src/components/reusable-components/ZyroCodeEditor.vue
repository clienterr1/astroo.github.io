<template>
	<div
		class="code-editor"
		:class="{ 'code-editor--overflow-auto': isOverflowAuto }"
		:style="computedStyles"
	>
		<ZyroTextArea
			ref="codeEditorInput"
			autofocus
			class="code-editor__text-area"
			:model-value="modelValue"
			@update:model-value="$emit('update:model-value', $event)"
		/>
	</div>
</template>

<script>
import ZyroTextArea from '@/components/global/ZyroTextArea.vue';

import { defineComponent } from 'vue';

export default defineComponent({

	components: {
		ZyroTextArea,
	},

	props: {
		modelValue: {
			type: String,
			default: '',
		},
		minHeight: {
			type: String,
			default: '262px',
		},
		maxHeight: {
			type: String,
			default: '460px',
		},
		isOverflowAuto: {
			type: Boolean,
			default: true,
		},
	},

	emits: ['update:model-value'],

	computed: {
		computedStyles() {
			return {
				'--min-height': this.minHeight,
				'--max-height': this.maxHeight,
			};
		},
	},

	mounted() {
		this.moveToEnd(this.$refs.codeEditorInput.$el);
	},

	methods: {
		moveToEnd(element) {
			element.focus({
				preventScroll: true,
			});

			if (!element.setSelectionRange) {
				return;
			}

			element.setSelectionRange(element.value.length, element.value.length);
		},
	},
});
</script>

<style lang="scss">
.code-editor {
	user-select: auto;

	&--overflow-auto {
		overflow: auto;
	}

	&__text-area {
		min-height: var(--min-height);
		max-height: var(--max-height);
		resize: vertical;
	}
}
</style>
