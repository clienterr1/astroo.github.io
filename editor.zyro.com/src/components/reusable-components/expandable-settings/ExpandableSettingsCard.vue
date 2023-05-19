<template>
	<div class="expandable-settings">
		<div class="expandable-settings__header">
			<p class="expandable-settings__title z-h5">
				{{ title }}
			</p>
			<button
				class="expandable-settings__close-button"
				data-qa="expandable-settings-close"
				@click="$emit('close')"
			>
				<ZyroSvgDeprecated
					name="close-sm"
					dimensions="16px"
				/>
			</button>
		</div>
		<div class="expandable-settings__content">
			<slot />
		</div>
		<Transition name="fade">
			<div
				v-if="isFooterShown"
				class="expandable-settings__footer"
			>
				<slot name="footer" />
			</div>
		</Transition>
	</div>
</template>

<script>
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroSvgDeprecated,
	},

	props: {
		title: {
			type: String,
			required: true,
		},
		isFooterShown: {
			type: Boolean,
			default: false,
		},
	},
});
</script>

<style lang="scss" scoped>
$padding-settings-header: 24px;
$padding-close-button: 8px;
$border-size-popup: 1px;

.expandable-settings {
	position: relative;
	display: flex;
	flex: 1 1 auto;
	flex-direction: column;
	width: 100%;
	height: 100%;

	&__header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		padding: $padding-settings-header calc($padding-settings-header - 8px) 16px $padding-settings-header;
	}

	&__title {
		padding-top: calc($padding-close-button / 2);
	}

	&__close-button {
		padding: $padding-close-button;
		cursor: pointer;
	}

	&__content {
		overflow-x: visible;
		overflow-y: auto;
	}

	&__footer {
		position: relative;
		z-index: 1;
		width: 100%;
		padding: 16px 24px;
		margin-top: auto;
		background-color: $color-light;
		box-shadow: 0 0 14px rgba($color-dark, 10%);
	}
}
</style>
