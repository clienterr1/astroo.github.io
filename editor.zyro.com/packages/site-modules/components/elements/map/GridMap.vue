<template>
	<div
		class="grid-map"
		:class="{ 'grid-map--loading': !isIframeLoaded }"
	>
		<iframe
			ref="iframeRef"
			class="grid-map__frame"
			width="100%"
			height="100%"
			:src="renderSrc"
		/>
		<div
			v-show="!isIframeLoaded"
			class="grid-map__pin"
		/>
	</div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'GridMap',

	props: {
		isIframeLoaded: {
			type: Boolean,
			default: false,
		},
		shouldRender: {
			type: Boolean,
			default: true,
		},
		src: {
			type: String,
			required: true,
		},
	},

	computed: {
		renderSrc() {
			return this.shouldRender ? this.src : null;
		},
	},
});
</script>

<style lang="scss" scoped>
@mixin skeleton-placeholder {
	position: relative;
	overflow: hidden;
	pointer-events: none;

	&::after {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		width: 200%;
		content: "";
		background-image:
			linear-gradient(
				to right,
				rgb(235 239 242 / 100%) 0%,
				rgb(235 239 242 / 0%) 35%,
				rgb(235 239 242 / 100%) 50%,
				rgb(235 239 242 / 0%) 85%,
				rgb(235 239 242 / 100%) 100%
			);
		background-size: 100% 100%;
		animation: placeholder-shimmer 1s linear 0s infinite;
	}

	@keyframes placeholder-shimmer {
		0% {
			transform: translate3d(0, 0, 0);
		}

		100% {
			transform: translate3d(50%, 0, 0);
		}
	}
}

.grid-map {
	position: relative;
	width: 100%;
	height: 100%;
	background-color: $color-gray-light;

	&__frame {
		width: 100%;
		height: 100%;
	}

	&__pin {
		position: absolute;
		top: 50%;
		left: 50%;
		z-index: 2;
		width: 26px;
		height: 26px;
		margin-top: -37px;
		margin-left: -13px;
		background-color: $color-danger;
		border-radius: 50%;

		&::before {
			position: absolute;
			top: 8px;
			left: 8px;
			z-index: 2;
			width: 10px;
			height: 10px;
			content: "";
			background: $color-danger-dark;
			border-radius: 50%;
		}

		&::after {
			position: absolute;
			top: 17px;
			right: 1px;
			left: 1px;
			z-index: 1;
			width: 0;
			height: 0;
			content: "";
			border-top: 20px solid $color-danger;
			border-right: 12px solid transparent;
			border-left: 12px solid transparent;
		}
	}

	&--loading {
		@include skeleton-placeholder;
	}
}
</style>
