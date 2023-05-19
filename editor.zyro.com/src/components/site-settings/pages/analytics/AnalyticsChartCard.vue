<template>
	<div class="analytics-card">
		<slot name="title" />
		<slot name="subtitle" />
		<div class="analytics-card__separator" />
		<slot />
	</div>
</template>

<style lang="scss" scoped>
.analytics-card {
	padding: 24px;
	background: $color-light;
	border: 1px solid $color-gray-border;
	border-radius: $border-radius-medium;

	&__separator {
		padding-bottom: 24px;

		&::after {
			position: absolute;
			left: 0;
			width: 100%;
			height: 1px;
			content: "";
			background: $color-gray-border;
		}
	}
}
</style>
