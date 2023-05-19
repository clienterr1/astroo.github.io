<template>
	<div class="seo-setup-card">
		<p class="seo-setup-card__title">
			{{ $t('builder.pageSeoOnboardingTitle') }}
		</p>
		<p class="seo-setup-card__description">
			{{ $t('builder.pageSeoOnboardingSubtitle') }}
		</p>
		<ZyroButton
			theme="outline"
			:title="$t('builder.pageSettingsSeoDrawerSeoCardButtonText')"
			data-qa="page-settings-button-restart-onboarding"
			@click="$emit('redo-seo-setup')"
		>
			{{ $t('builder.pageSettingsSeoDrawerSeoCardButtonText') }}
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
.seo-setup-card {
	&__title {
		margin-bottom: 8px;
		font-size: 16px;
		font-weight: 700;
		line-height: 1.5;
	}

	&__description {
		margin-bottom: 16px;
		font-size: 14px;
		font-weight: 400;
		line-height: 1.71;
		color: $color-gray;
	}
}
</style>
