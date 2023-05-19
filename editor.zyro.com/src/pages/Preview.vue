<template>
	<div>
		<BuilderHeaderPreview
			class="page-layout__header page-layout__header--sticky"
			@exit-preview="$router.push({ name: BUILDER_ROUTE })"
		>
			<template
				v-if="isCurrentPageTypeBlog"
				#title
			>
				<div class="blog-header">
					<h3 class="z-body z-body--strong">
						{{ currentPage.meta.title || currentPage.name }} ·
						<span class="z-body">
							{{ currentPage.isDraft ? $t('common.draft') : $t('common.published') }}
						</span>
					</h3>
				</div>
			</template>
		</BuilderHeaderPreview>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';

import BuilderHeaderPreview from '@/components/builder-view/headers/BuilderHeaderPreview.vue';
import { BUILDER_ROUTE } from '@/constants/routes';

import { defineComponent } from 'vue';

export default defineComponent({
	name: 'Preview',

	components: {
		BuilderHeaderPreview,
	},

	setup() {
		return {
			BUILDER_ROUTE,
		};
	},

	computed: {
		...mapGetters([
			'currentPage',
			'isCurrentPageTypeBlog',
		]),
	},
});
</script>
<style lang="scss" scoped>
.blog-header {
	display: flex;
	flex-direction: row;

	&__title {
		font-size: 16px;
		line-height: 1.5;
		letter-spacing: 0.03em;

		&--regular {
			font-weight: normal;
		}
	}
}
</style>
