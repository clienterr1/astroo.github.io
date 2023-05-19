<template>
	<div class="premium">
		<h5 class="premium__title z-h5">
			{{ $t('builder.publishedModalRoot.premium.title') }}
		</h5>
		<p class="premium__text z-body-small">
			{{ $t('builder.publishedModalRoot.premium.text') }}
		</p>
		<ZyroButton
			theme="outline"
			size="xs"
			class="z-button-small"
			@click="$emit('connect-domain')"
		>
			{{ $t('builder.publishedModalRoot.premium.btn') }}
		</ZyroButton>
	</div>
</template>

<script>
import ZyroButton from '@/components/global/ZyroButton.vue';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroButton,
	},
});
</script>
<style lang="scss" scoped>
.premium {
	padding: 32px 40px;
	text-align: center;
	background-color: $color-gray-light;

	&__title {
		margin-bottom: 8px;
		font-size: 20px;
		color: $color-dark;
	}

	&__text {
		margin-bottom: 16px;
		color: $color-gray;
	}
}
</style>
