<template>
	<div class="ai-recommendation">
		<ZyroSvgDeprecated
			class="ai-recommendation__icon"
			name="ai-tools"
		/>

		<p class="ai-recommendation__text">
			<slot />
		</p>
	</div>
</template>
<script>

import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroSvgDeprecated,
	},
});
</script>
<style lang="scss" scoped>
.ai-recommendation {
	display: flex;
	align-items: flex-start;
	margin-bottom: 8px;
	font-size: 13px;

	&__icon {
		flex-shrink: 0;
		width: 24px;
		height: 24px;
		margin-right: 8px;
	}

	&__text {
		line-height: 1.25;
		color: $color-gray;
	}
}
</style>
