<template>
	<div class="blog-list-item-meta">
		<div class="font-secondary">
			<p
				v-show="showName"
				v-qa="'blog-author'"
				class="blog-list-item-meta__author-name"
			>
				{{ authorName }}
			</p>
			<p
				v-show="showDate || showMinutes"
				class="blog-list-item-meta__subtitle"
			>
				<span v-if="showDate && date">
					{{ date }}
				</span>
				<span v-if="showMinutes">
					{{ `${minutesAmount} ${minReadText}` }}
				</span>
			</p>
		</div>
	</div>
</template>

<script>
import { defineComponent } from 'vue';

const DEFAULT_MIN_READ_TEXT = 'min read'; // TODO: should come from UI/data.json for translations

export default defineComponent({
	props: {
		authorName: {
			type: String,
			default: '',
		},
		minutesAmount: {
			type: String,
			default: '0',
		},
		minReadText: {
			type: String,
			default: DEFAULT_MIN_READ_TEXT,
		},
		date: {
			type: String,
			default: '',
		},
		showAvatar: {
			type: Boolean,
			default: true,
		},
		showName: {
			type: Boolean,
			default: true,
		},
		showDate: {
			type: Boolean,
			default: true,
		},
		showMinutes: {
			type: Boolean,
			default: true,
		},
	},
});
</script>

<style lang="scss" scoped>
@import "@zyro-inc/site-modules/components/blocks/blog/BlockBlogFonts";

.blog-list-item-meta {
	color: var(--blog-post-header-text-color);
	opacity: 0.8;

	&__author-name {
		margin-bottom: 4px;
	}

	&__subtitle {
		span:nth-of-type(2)::before {
			content: " · ";
		}
	}
}
</style>
