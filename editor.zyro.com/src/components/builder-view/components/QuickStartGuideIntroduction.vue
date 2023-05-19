<template>
	<div
		class="introduction"
		data-qa="quick-start-guide-introduction"
	>
		<div class="introduction__icon-container">
			<ZyroSvgDeprecated
				name="arrow"
				direction="right"
				class="introduction__icon-arrow"
			/>
		</div>
		<p class="z-body z-body--strong introduction__title">
			{{ $t('builder.quickStartGuide') }}
		</p>
		<p class="z-body-small mb-24">
			{{ $t('builder.quickStartGuideSubtitle') }}
		</p>
		<ZyroButton
			data-qa="builder-header-modal-btn-introduction-guide"
			theme="primary"
			@click="$emit('button-click')"
		>
			{{ $t('builder.quickStartGuideStartButton') }}
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
.mb-24 {
	margin-bottom: 24px;
}

.introduction {
	&__icon-container {
		display: inline-flex;
		padding: 12px;
		margin-bottom: 12px;
		background-color: $color-primary-light;
		border-radius: 50px;
	}

	&__title {
		margin-bottom: 8px;
	}

	&__icon-arrow {
		color: $color-primary;
	}
}
</style>
