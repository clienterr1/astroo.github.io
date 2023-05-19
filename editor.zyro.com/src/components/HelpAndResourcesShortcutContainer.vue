<template>
	<div class="shortcut-container">
		<p class="z-body-small">
			<slot name="title" />
		</p>
		<p class="z-body-small shortcut-container__shortcut-text">
			<slot name="shortcut" />
		</p>
	</div>
</template>

<style lang="scss" scoped>
.shortcut-container {
	display: flex;
	justify-content: space-between;

	&__shortcut-text {
		color: $color-gray;
	}
}
</style>
