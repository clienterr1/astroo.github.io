<template>
	<div
		class="list-option"
		:class="{ 'list-option--active': value === modelValue }"
		tabindex="0"
		@keydown.enter="$emit('submit')"
		@click="$emit('update:model-value', value)"
	>
		<ZyroRadio
			:value="value"
			:model-value="modelValue"
			class="list-option__radio"
		/>
		<div class="list-option__content">
			<slot name="title" />
			<h3
				v-if="!hasSlotContent($slots.title)"
				class="list-option__title z-body-small"
			>
				{{ title }}
			</h3>
			<slot />
		</div>
	</div>
</template>

<script>
import ZyroRadio from '@/components/global/ZyroRadio.vue';

import { defineComponent } from 'vue';

import { hasSlotContent } from '@zyro-inc/site-modules/utils/hasSlotContent';

export default defineComponent({
	components: {
		ZyroRadio,
	},

	props: {
		modelValue: {
			type: String,
			default: null,
		},
		value: {
			type: String,
			required: true,
		},
		title: {
			type: String,
			default: null,
		},
	},

	emits: ['update:model-value'],

	setup() {
		return {
			hasSlotContent,
		};
	},
});
</script>

<style lang="scss" scoped>
.list-option {
	display: flex;
	width: 100%;
	padding: 24px;
	cursor: pointer;
	border: 1px solid $color-gray-border;
	border-radius: 12px;
	transition: border-color 0.2s ease;

	&:not(:last-child) {
		margin-bottom: 8px;
	}

	&:hover {
		border-color: $color-primary-dark;
	}

	&:focus {
		outline: none;
	}

	&--active {
		border-color: $color-primary;
	}

	&__radio {
		margin-right: 8px;
	}

	&__title {
		display: flex;
		gap: 8px;
	}

	&__content {
		width: 100%;
	}
}

@media screen and (max-width: $media-mobile) {
	.list-option {
		display: flex;
		padding: 16px;
	}
}
</style>
