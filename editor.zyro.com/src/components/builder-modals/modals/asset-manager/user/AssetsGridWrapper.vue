<template>
	<div class="assets-grid">
		<slot />
	</div>
</template>

<style lang="scss" scoped>
.assets-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
	grid-gap: 8px;
	padding: 0 20px 24px;
}
</style>
