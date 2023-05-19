<template>
	<div class="og-preview">
		<p class="og-preview__title z-body-small">
			{{ $t('siteSettings.general.ogImage.content.label') }}
		</p>
		<Component
			:is="src ? 'img' : 'zyro-svg'"
			:src="src"
			:name="defaultIcon"
			alt="OG Image preview"
			class="og-preview__image"
		/>
		<p class="og-preview__user-title z-body-small">
			{{ siteHomePageTitle }}
		</p>
		<p class="og-preview__url z-body-small">
			{{ siteUrl || 'https://www.yourwebsitestitle.zyrosite.com' }}
		</p>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import { isHostingerBrand } from '@/utils/isHostingerBrand';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroSvgDeprecated,
	},

	props: {
		src: {
			type: String,
			default: '',
		},
	},

	setup() {
		return {
			isHostingerBrand,
		};
	},

	computed: {
		...mapGetters([
			'siteUrl',
			'siteHomePageTitle',
		]),
		defaultIcon() {
			return this.isHostingerBrand ? 'hostinger' : 'preview-ogimage';
		},
	},
});
</script>

<style lang="scss" scoped>
.og-preview {
	height: 239px;
	padding: 13px 10px 10px;
	background-color: $color-gray-light;

	&__title {
		margin-bottom: 14px;
	}

	&__image {
		width: 100%;
		max-height: 123px;
		object-fit: cover;
	}

	&__user-title {
		margin-bottom: 6px;
	}
}
</style>
