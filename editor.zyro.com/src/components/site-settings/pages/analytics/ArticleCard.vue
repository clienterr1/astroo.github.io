<template>
	<a
		href="https://www.hostinger.com/tutorials/drive-traffic-to-your-website"
		target="_blank"
		rel="noopener noreferrer"
		class="article-card"
		@click="logArticleClick"
	>
		<div class="article-card__icon-wrap">
			<ZyroSvgDeprecated
				name="file-text"
				class="article-card__icon"
			/>
		</div>
		<p class="z-body z-body--strong article-card__title">
			{{ $t('builder.analyticsArticleDriveTraffic') }}
		</p>
		<p class="z-link article-card__link">
			{{ $t('common.learnMore') }}
			<ZyroSvgDeprecated
				name="external-link-small"
				class="article-card__link-icon"
			/>
		</p>
	</a>
</template>
<script>
import { defineComponent } from 'vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';
import EventLogApi from '@/api/EventLogApi';

export default defineComponent({
	components: {
		ZyroSvgDeprecated,
	},
	setup() {
		const logArticleClick = () => {
			EventLogApi.logEvent({
				eventName: 'website_builder.website_settings_analytics.help_article_enter',
				isHostingerEvent: true,
			});
		};

		return {
			logArticleClick,
		};
	},
});
</script>
<style lang="scss" scoped>
.article-card {
	$this: &;

	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	padding: 16px 24px;
	text-decoration: none;
	background: $color-light;
	border: 1px solid $color-gray-border;
	border-radius: $border-radius-medium;

	&__icon-wrap {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		padding: 12px;
		margin-right: 24px;
		border: 1px solid $color-gray-border;
		border-radius: 8px;
	}

	&__icon {
		width: 16px;
		height: 16px;
	}

	&__title {
		width: 100%;
	}

	&__link {
		display: flex;
		gap: 6px;
		align-items: center;
		color: $color-primary;
		white-space: nowrap;
	}

	&__link-icon {
		width: 16px;
		height: 16px;
		color: $color-primary;
	}
}
</style>
