<template>
	<div class="empty-block">
		<template v-if="mode === 'with-button'">
			<p class="z-body-small z-body-small--strong empty-block__title">
				{{ $t('builder.blog.blockBlogListEmptyBlock.title') }}
			</p>
			<p class="z-body-small empty-block__subtitle">
				{{ $t('builder.blog.blockBlogListEmptyBlock.subtitle') }}
			</p>
			<ZyroButton
				theme="primary"
				:title="$t('builder.blog.blockBlogListEmptyBlock.addNewPost')"
				class="empty-block__button"
				@click="$emit('add-post-button-click')"
			>
				<template #icon-left>
					<Icon
						name="add"
						dimensions="20px"
					/>
				</template>
				{{ $t('builder.blog.blockBlogListEmptyBlock.addNewPost') }}
			</ZyroButton>
		</template>
		<template v-else-if="mode === 'no-posts'">
			<p class="z-body-small z-body-small--strong empty-block__title">
				{{ $t('builder.blog.blockBlogListEmptyBlock.noPosts') }}
			</p>
		</template>
	</div>
</template>

<script>
import Icon from '@/components/global/Icon.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		Icon,
		ZyroButton,
	},

	props: {
		mode: {
			type: String,
			default: 'with-button',
			validator: (mode) => [
				'with-button',
				'no-posts',
			].includes(mode),
		},
	},

	emits: ['add-post-button-click'],
});
</script>

<style lang="scss" scoped>
.empty-block {
	display: flex;
	flex-direction: column;
	place-content: center;
	place-items: center;
	width: 100%;
	height: 100%;
	padding: 38px 0;
	pointer-events: none;
	border: 1px dashed $color-gray;

	&__title {
		margin-bottom: 8px;
	}

	&__subtitle {
		margin-bottom: 24px;
	}

	&__button {
		pointer-events: initial;
		cursor: pointer;
	}
}
</style>
