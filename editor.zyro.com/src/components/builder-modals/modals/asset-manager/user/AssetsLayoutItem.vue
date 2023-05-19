<template>
	<div class="assets-layout-item">
		<p class="assets-layout-item__image-detail-topic">
			{{ topic }}
		</p>

		<p class="assets-layout-item__image-detail-subtopic">
			{{ subtopic }}
		</p>
	</div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
	props: {
		topic: {
			type: String,
			required: true,
		},
		subtopic: {
			type: String,
			required: true,
		},
	},
});
</script>

<style lang="scss" scoped>
.assets-layout-item {
	&__image-detail-topic {
		font-size: 14px;
		font-weight: 700;
	}

	&__image-detail-subtopic {
		margin-top: 2px;
		font-size: 14px;
		color: $color-gray;
		word-break: break-word;
	}
}
</style>
