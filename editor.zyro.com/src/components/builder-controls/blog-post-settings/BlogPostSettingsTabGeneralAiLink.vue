<template>
	<a
		v-qa="`blogpostsettings-useaititlegenerator-click`"
		target="_blank"
		class="z-link z-link--dark"
		href="https://zyro.com/ai/blog-title-generator?ref=builder"
	>
		{{ $t('builder.blog.blogPostSettings.AIRecommendationSlotTitleGenerator') }}
	</a>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({});
</script>
