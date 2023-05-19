<template>
	<div class="flag">
		<img
			class="flag__img"
			:src="src"
			:alt="alt"
		>
		<div class="flag__shadow" />
	</div>
</template>
<script>

import { defineComponent } from 'vue';

export default defineComponent({
	name: 'Flag',

	props: {
		alt: {
			type: String,
			required: true,
		},
		src: {
			type: String,
			default: null,
		},
	},
});
</script>

<style lang="scss">
$flag-border-radius: 2px;

.flag {
	position: relative;
	width: 20px;
	overflow: hidden;
	border-radius: $flag-border-radius;

	&__img {
		display: flex;
		width: 20px;
		height: 15px;
		color: var(--color-gray);
	}

	&__shadow {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border-radius: $flag-border-radius;
		box-shadow: inset 0 0 0 1px rgb(100 100 100 / 15%);
	}
}

</style>
