<template>
	<div
		v-qa="'tooltip'"
		class="tooltip"
	>
		<slot />
		<div
			v-qa="'tooltip__popup'"
			:class="`tooltip__popup tooltip__popup--${tooltipVerticalPosition}`"
		>
			{{ tooltipText }}
		</div>
	</div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
	props: {
		tooltipText: {
			type: String,
			required: true,
		},
		tooltipVerticalPosition: {
			type: String,
			default: 'top',
		},
	},
});
</script>

<style lang="scss" scoped>
.tooltip {
	position: relative;

	&__popup {
		position: absolute;
		left: 50%;
		z-index: 1;
		padding: 3px 6px;
		font-size: 14px;
		line-height: 18px;
		color: var(--color-light);
		white-space: nowrap;
		pointer-events: none;
		background-color: var(--color-dark);
		border-radius: 3px;
		opacity: 0;
		transition: opacity 0ms 200ms;

		&--top {
			top: 0%;
			transform: translate(-50%, calc(-100% - 4px));
		}

		&--bottom {
			top: 100%;
			transform: translate(-50%, 4px);
		}
	}

	&:hover &__popup {
		opacity: 1;
	}
}

</style>
