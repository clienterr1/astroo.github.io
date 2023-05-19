<template>
	<Page
		v-if="pageData"
		:page-data="pageData"
	/>
</template>

<script>
import {
	defineComponent,
	computed,
} from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

import Page from '@/components/Page.vue';

import { SYSTEM_LOCALE } from '@zyro-inc/site-modules/constants';
import { getPathParams } from '@zyro-inc/site-modules/utils/page/getPathParams';
import { getPageIdFromPath } from '@zyro-inc/site-modules/utils/page/getPageIdFromPath';
import { getPageData } from '@zyro-inc/site-modules/utils/getPageData';

export default defineComponent({
	name: 'PageWrapper',
	components: {
		Page,
	},
	setup() {
		const { state } = useStore();
		const route = useRoute();
		const website = computed(() => state.website);
		const currentLocale = computed(() => {
			if (!website.value) {
				return null;
			}

			const { locale } = getPathParams({
				path: route.path,
				defaultLocale: website.value.meta.defaultLocale ?? SYSTEM_LOCALE,
				languageKeys: Object.keys(website.value.languages),
			});

			return locale;
		});

		const pageData = computed(() => {
			if (!website.value) {
				return null;
			}

			const pageId = getPageIdFromPath({
				path: route.path,
				siteData: website.value,
			});

			return getPageData({
				siteData: website.value,
				locale: currentLocale.value,
				pageId,
			});
		});

		return {
			pageData,
		};
	},
});
</script>
