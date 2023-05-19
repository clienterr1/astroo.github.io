<template>
	<div class="go-back-button">
		<ZyroButton
			class="go-back-button__button z-body"
			@click="$emit('button-click')"
		>
			<ZyroSvgDeprecated
				class="go-back-button__icon-arrow"
				name="go-back-arrow"
			/>

			<span class="go-back-button__text">
				{{ $t("builder.assetManagerMediaLayoutGoBack") }}
			</span>
		</ZyroButton>
	</div>
</template>

<script>
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroSvgDeprecated,
		ZyroButton,
	},
});
</script>
<style lang="scss" scoped>
$navigation-height: 20px;
$navigation-margin-top: 16px;
$navigation-margin-bottom: 16px;

.go-back-button {
	display: flex;
	align-items: center;
	height: $navigation-height;
	margin-top: $navigation-margin-top;
	margin-bottom: $navigation-margin-bottom;

	&__button {
		display: flex;
		align-items: center;
		color: $color-gray;
		cursor: pointer;
	}

	&__icon-arrow {
		margin-right: 8px;
	}

	&__text {
		font-weight: 500;
		letter-spacing: 0;
	}
}
</style>
