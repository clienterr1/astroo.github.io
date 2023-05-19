<template>
	<div
		class="popup-frame"
		:style="popupStyles"
	>
		<slot />
		<div
			v-if="withArrow"
			class="popup-frame__arrow"
			data-popper-arrow
		/>
	</div>
</template>
<script>
import { defineComponent } from 'vue';

export default defineComponent({
	props: {
		withArrow: {
			type: Boolean,
			default: false,
		},
		maxWidth: {
			type: String,
			default: '400px',
		},
	},

	computed: {
		popupStyles() {
			return {
				'--max-width': this.maxWidth,
			};
		},
	},
});

</script>
<style lang="scss" scoped>
.popup-frame {
	$this: &;

	z-index: $z-index-controls-popup-card;
	max-width: var(--max-width, 400px);
	margin-top: $header-height-editor;
	user-select: none;
	background: $color-light;
	border-radius: 16px;
	box-shadow: $box-shadow;

	&__arrow,
	&__arrow::before {
		position: absolute;
		width: 8px;
		height: 8px;
		background: inherit;
	}

	&__arrow {
		visibility: hidden;
	}

	&__arrow::before {
		visibility: visible;
		content: "";
		transform: rotate(45deg);
	}

	&[data-popper-placement^='top'] > #{$this}__arrow {
		bottom: -4px;
	}

	&[data-popper-placement^='bottom'] > #{$this}__arrow {
		top: -4px;
	}

	&[data-popper-placement^='left'] > #{$this}__arrow {
		right: -4px;
	}

	&[data-popper-placement^='right'] > #{$this}__arrow {
		left: -4px;
	}
}

</style>
