<template>
	<div
		class="dashboard-banner-base"
		:class="`dashboard-banner-base--${theme}`"
	>
		<slot />
	</div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
	props: {
		theme: {
			type: String,
			default: 'gray',
			validator: (value) => [
				'gray',
				'blue',
				'pink-gradient',
			].includes(value),
		},
	},
});
</script>

<style lang="scss" scoped>
.dashboard-banner-base {
	display: flex;
	align-items: center;
	padding: 12px 24px;
	margin-bottom: 24px;
	border-radius: 12px;

	&--gray {
		background: $color-gray-light;
	}

	&--blue {
		background: $color-azure;
	}

	&--pink-gradient {
		background: linear-gradient(180deg, $color-danger-dark 0%, $color-danger 100%);
	}

	@media screen and (max-width: $media-mobile) {
		padding: 16px;
	}
}
</style>
