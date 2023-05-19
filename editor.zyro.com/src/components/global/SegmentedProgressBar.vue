<template>
	<div class="bar">
		<div
			v-for="(_color, index) in colors"
			:key="`segment-${index + 1}`"
			class="segment"
		>
			<TransitionGroup name="fill">
				<div
					v-if="index + 1 <= progress"
					class="segment-overlay"
					:style="{ 'background-color': colors[progress - 1], }"
				/>
			</TransitionGroup>
		</div>
	</div>
</template>

<script>
import {
	defineComponent,
	TransitionGroup,
} from 'vue';

export default defineComponent({
	components: {
		TransitionGroup,
	},
	props: {
		progress: {
			type: Number,
			default: 0,
		},
		colors: {
			type: Array,
			default: () => [
				'var(--color-danger)',
				'var(--color-warning)',
				'var(--color-success)',
			],
		},
	},
});
</script>

<style lang="scss" scoped>
.bar {
	display: flex;
	column-gap: 4px;
	height: 12px;
}

.segment {
	position: relative;
	flex-grow: 1;
	overflow: hidden;
	background-color: $color-gray-light;

	&:first-child {
		border-radius: 2px 0 0 2px;
	}

	&:last-child {
		border-radius: 0 2px 2px 0;
	}
}

.segment-overlay {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	transition: background-color 0.3s ease;
	transform-origin: left;
}

.fill-enter-active,
.fill-leave-active {
	transition: transform 0.3s ease;
}

.fill-enter-from,
.fill-leave-to {
	transform: scaleX(0);
}
</style>
