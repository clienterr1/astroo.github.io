<template>
	<div class="text-container">
		<h2 class="z-body-small z-body-small--strong">
			<slot name="title" />
		</h2>
		<p class="z-body-small">
			<slot />
		</p>
	</div>
</template>

<style lang="scss" scoped>
.text-container {
	margin-bottom: 40px;

	@media screen and (max-width: $media-mobile) {
		margin-bottom: 24px;
	}
}

</style>
