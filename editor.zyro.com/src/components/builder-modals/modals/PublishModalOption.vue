<template>
	<div
		class="publish-modal-option"
		:class="{ 'publish-modal-option--active': isActive }"
		tabindex="0"
		@keydown.enter="$emit('submit')"
		@click="$emit('update:model-value', value)"
	>
		<ZyroRadio
			:value="value"
			:model-value="modelValue"
			class="publish-modal-option__radio"
		/>
		<div class="publish-modal-option__content">
			<div class="publish-modal-option__title z-body-small z-body-small--strong">
				<h4>
					{{ title }}
				</h4>
				<slot name="pill" />
			</div>
			<p
				v-if="subtitle"
				class="publish-modal-option__subtitle z-body-small"
			>
				{{ subtitle }}
			</p>
			<slot name="subtitle" />
		</div>
	</div>
</template>

<script>
import ZyroRadio from '@/components/global/ZyroRadio.vue';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroRadio,
	},

	props: {
		isActive: {
			type: Boolean,
			default: false,
		},
		value: {
			type: String,
			default: null,
		},
		modelValue: {
			type: String,
			required: true,
		},
		title: {
			type: String,
			default: null,
		},
		subtitle: {
			type: String,
			default: null,
		},
	},
});
</script>

<style lang="scss" scoped>
.publish-modal-option {
	display: flex;
	padding: 24px;
	margin-bottom: 16px;
	border: 1px solid transparent;
	border-radius: 8px;
	transition: box-shadow 0.2s, border-color 0.2s;

	&:hover {
		border-color: $color-gray-light;
	}

	&:focus {
		outline: none;
	}

	&--active {
		cursor: pointer;
		border-color: $color-gray-light;
		box-shadow: 0 4px 10px rgb(0 0 0 / 10%);
	}

	&__radio {
		margin-right: 28px;
	}

	&__title {
		display: flex;
		gap: 8px;
		margin-bottom: 8px;
	}

	&__subtitle {
		color: $color-gray;
	}
}

@media screen and (max-width: $media-mobile) {
	.publish-modal-option {
		display: flex;
		padding: 40px 0 0;
		border: none;
		border-top: 1px solid $color-gray-light;
		border-radius: 0;
		transition: none;

		&-text {
			position: relative;
			width: 100%;
			height: 100px;
		}

		&--active {
			box-shadow: none;
		}
	}
}
</style>
