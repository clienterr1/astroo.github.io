<template>
	<a
		v-qa="'article-link'"
		class="article-link z-body-small z-link"
		target="_blank"
		rel="noopener"
		:href="href"
		@click="logEvent"
	>
		<slot />
	</a>
</template>

<script>
import EventLogApi from '@/api/EventLogApi';
import { isHostingerBrand } from '@/utils/isHostingerBrand';
import { eventNames } from '@/data/analyticEventList';
import { mapState } from 'vuex';
import { REGEX_MATCH_FROM_FIRST_DASH } from '@zyro-inc/site-modules/constants/regex';
import { defineComponent } from 'vue';

export default defineComponent({
	props: {
		href: {
			type: String,
			required: true,
		},
	},

	computed: {
		...mapState('user', ['user']),
	},

	methods: {
		logEvent() {
			if (isHostingerBrand) {
				EventLogApi.logEvent({
					eventName: 'website_builder.help_articles.shown',
					eventProperties: {
						articleLink: this.href.match(REGEX_MATCH_FROM_FIRST_DASH)[1],
					},
					isHostingerEvent: true,
				});

				return;
			}

			EventLogApi.logEvent({
				eventName: eventNames.builder.click_help_article,
				eventProperties: {
					articleLink: this.href,
				},
				user: this.user.user,
			});
		},
	},
});
</script>

<style lang="scss" scoped>
.article-link {
	margin-bottom: 8px;
}
</style>
