<template>
	<div class="empty-block">
		<h3
			v-if="title"
			class="empty-block__title z-body-small z-body-small--strong"
		>
			{{ title }}
		</h3>
		<p
			v-if="subtitle"
			class="z-body-small"
		>
			{{ subtitle }}
		</p>
	</div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
	props: {
		title: {
			type: String,
			default: '',
		},
		subtitle: {
			type: String,
			default: '',
		},
	},
});
</script>

<style lang="scss" scoped>
.empty-block {
	max-width: 100%;
	padding: 16px;
	margin: 0 24px;
	color: $color-gray;
	text-align: center;
	border: 1px dashed $color-gray-border;

	&__title {
		margin-bottom: 8px;
	}
}
</style>
