<template>
	<div class="empty-state-card">
		<ZyroSvgDeprecated
			name="pie-chart"
			dimensions="48px"
			class="empty-state-card__icon"
		/>
		<p class="empty-state-card__title z-body z-font-weight-bold">
			{{ $t('builder.analyticsNoDataTitle') }}
		</p>
		<p class="empty-state-card__subtitle z-body-small">
			{{ $t('builder.analyticsNoDataSubtitle') }}
		</p>
	</div>
</template>

<script>
import { defineComponent } from 'vue';

import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

export default defineComponent({
	components: {
		ZyroSvgDeprecated,
	},
});
</script>

<style lang="scss" scoped>
.empty-state-card {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 40px;
	background: $color-light;
	border: 1px solid $color-gray-border;
	border-radius: $border-radius-medium;

	&__icon {
		margin-bottom: 24px;
		color: $color-gray;
	}

	&__title {
		margin-bottom: 8px;
	}

	&__subtitle {
		color: $color-gray;
	}
}
</style>
