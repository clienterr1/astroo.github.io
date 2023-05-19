<template>
	<div class="empty-blog-drawer">
		<figure class="empty-blog-drawer__image-container">
			<img
				class="empty-blog-drawer__image"
				src="@/assets/images/blog-sample.png"
			>
		</figure>
		<h2 class="z-h5">
			{{ $t('builder.blog.emptyBlogDrawer.title') }}
		</h2>
		<p class="empty-blog-drawer__subtitle z-body">
			{{ $t('builder.blog.emptyBlogDrawer.subtitle') }}
		</p>

		<ul class="list">
			<li class="list__item z-body-small">
				<ZyroSvgDeprecated
					class="list__item-icon"
					name="check-mark-blue"
				/>
				<p>{{ $t('builder.blog.emptyBlogDrawer.listItems.item1') }}</p>
			</li>
			<li class="list__item z-body-small">
				<ZyroSvgDeprecated
					class="list__item-icon"
					name="check-mark-blue"
				/>
				<p>{{ $t('builder.blog.emptyBlogDrawer.listItems.item2') }}</p>
			</li>
			<li class="list__item z-body-small">
				<ZyroSvgDeprecated
					class="list__item-icon"
					name="check-mark-blue"
				/>
				<p>{{ $t('builder.blog.emptyBlogDrawer.listItems.item3') }}</p>
			</li>
			<li class="list__item z-body-small">
				<ZyroSvgDeprecated
					class="list__item-icon"
					name="check-mark-blue"
				/>
				<p>{{ $t('builder.blog.emptyBlogDrawer.listItems.item4') }}</p>
			</li>
		</ul>

		<ZyroButton
			theme="primary"
			size="sm"
			class="empty-blog-drawer__button"
			data-qa="builder-blog-btn-startablog"
			@click="$emit('add-post')"
		>
			{{ $t('builder.blog.emptyBlogDrawer.buttonText') }}
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
.empty-blog-drawer {
	height: 100%;
	padding: 72px 0 32px;
	overflow-x: hidden;
	overflow-y: auto;
	text-align: center;

	&__image {
		max-width: 100%;
	}

	&__subtitle {
		margin-bottom: 48px;
	}

	&__image-container {
		margin-bottom: 16px;
	}

	&__button {
		overflow: hidden;
	}
}

.list {
	width: 85%;
	margin: auto;
	margin-bottom: 48px;

	&__item {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-bottom: 16px;
	}

	&__item-icon {
		margin-right: 11px;
	}
}
</style>
