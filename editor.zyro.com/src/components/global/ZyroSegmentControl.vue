<template>
	<div
		class="zyro-segment-control"
		:class="{ 'zyro-segment-control--darker': isBackgroundDark }"
	>
		<button
			v-for="control in controls"
			:key="control.title"
			v-qa="`builder-sectionsettings-tab-${control.title}`"
			:class="{ 'zyro-segment-control__button--active': control.title === activeControl.title }"
			class="zyro-segment-control__button z-body-small"
			@click="$emit('update:active-control', control)"
		>
			{{ control.title }}
		</button>
		<div class="zyro-segment-control__background" />
	</div>
</template>

<script>
import {
	defineComponent,
	computed,
} from 'vue';

export default defineComponent({
	props: {
		controls: {
			type: Array,
			required: true,
			validator: (controls) => controls.every((item) => 'title' in item),
		},
		activeControl: {
			type: Object,
			required: true,
			validator: (activeControl) => 'title' in activeControl,
		},
		isBackgroundDark: {
			type: Boolean,
			default: false,
		},
	},
	emits: ['update:active-control'],
	setup(props) {
		const numberOfControls = computed(() => props.controls.length);
		const activeControlIndex = computed(() => props.controls.findIndex((control) => control.title === props.activeControl.title));

		return {
			numberOfControls,
			activeControlIndex,
		};
	},
});
</script>

<style lang="scss" scoped>
.zyro-segment-control {
	$this: &;

	position: relative;
	display: flex;
	width: 100%;
	background-color: $color-gray-light;
	border-radius: $border-radius-round;

	&--darker {
		background-color: $color-gray-light;

		#{$this}__background {
			border-color: $color-gray-light;
		}
	}

	&__button {
		z-index: 1;
		display: flex;
		flex: 1 0;
		align-items: center;
		justify-content: center;
		min-height: 40px;
		padding: 8px 16px;
		color: $color-gray;
		cursor: pointer;
		background-color: transparent;
		border: 2px solid transparent;
		border-radius: $border-radius-round;
		transition: 0.2s all;

		&--active {
			color: $color-dark;
		}
	}

	&__background {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 0;
		width: calc(100% / v-bind(numberOfControls));
		height: 100%;
		background-color: $color-light;
		border: 2px solid $color-gray-light;
		border-radius: $border-radius-round;
		transition: transform 0.5s ease-in-out;
		transform: translateX(calc(v-bind(activeControlIndex) * 100%));
	}
}
</style>
