<template>
	<div class="zyro-label">
		<label
			:for="forProp"
			class="zyro-label__label"
			:class="{
				'z-body-small': theme === 'primary',
				'z-subheading-small': theme === 'secondary',
				'z-body-small--strong': bold
			}"
		>
			<slot />
		</label>
	</div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
	props: {
		bold: {
			type: Boolean,
			default: true,
		},
		for: {
			type: String,
			default: '',
		},
		theme: {
			type: String,
			default: 'primary',
			validator: (value) => [
				'primary',
				'secondary',
			].includes(value),
		},
	},

	computed: {
		// Using `for` directly in template causes ESLint parsing error, since it confuses it with `for` loop token
		forProp() {
			return this.for;
		},
	},
});
</script>

<style lang="scss" scoped>
.zyro-label {
	display: inline-flex;
	align-items: center;
	justify-content: flex-start;
	width: 100%;
	font-size: 13px;

	&__label {
		display: inline-block;
	}
}
</style>
