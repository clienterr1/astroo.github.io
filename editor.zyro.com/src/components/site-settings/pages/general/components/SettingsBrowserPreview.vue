<template>
	<div class="browser-preview">
		<div class="browser-preview__header">
			<Component
				:is="src ? 'img' : 'zyro-svg'"
				class="browser-preview__header-favicon"
				:name="defaultIcon"
				:src="src"
			/>
			<div class="browser-preview__header-title">
				{{ title || siteHomePageTitle }}
			</div>
			<ZyroSvgDeprecated
				class="browser-preview__header-background"
				:name="`preview-settings-browser${showDescription ? '-full' : ''}`"
			/>
			<div class="browser-preview__header-input">
				{{ pageUrl.toLowerCase() || siteUrl.toLowerCase() }}
			</div>
		</div>
		<div
			v-if="showDescription"
			class="browser-preview__content"
		>
			<div class="browser-preview__content-title">
				{{ title || siteHomePageTitle }}
			</div>
			<div class="browser-preview__content-link z-body-small">
				{{ pageUrl || siteUrl }}
			</div>
			<div class="browser-preview__content-text z-body-small">
				{{ description }}
			</div>
		</div>
	</div>
</template>

<script>
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import {
	mapGetters,
	mapState,
} from 'vuex';

import { getPagePathFromId } from '@zyro-inc/site-modules/utils/page/getPagePathFromId';
import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroSvgDeprecated,
	},

	props: {
		src: {
			type: String,
			default: null,
		},
		title: {
			type: String,
			default: '',
		},
		defaultIcon: {
			type: String,
			default: 'gray-rectangle',
		},
		description: {
			type: String,
			default: '',
		},
		showDescription: {
			type: Boolean,
			default: false,
		},
	},

	computed: {
		...mapState([
			'website',
			'currentLocale',
		]),
		...mapGetters([
			'siteUrl',
			'siteHomePageTitle',
		]),
		...mapState('gui', ['activeModalSettings']),
		pageUrl() {
			const url = getPagePathFromId({
				siteData: this.website,
				pageId: this.activeModalSettings.itemId,
				locale: this.currentLocale,
			});

			return `${this.siteUrl}${url}`;
		},
	},
});
</script>

<style lang="scss" scoped>
@mixin fade-text-end($width, $background-color) {
	width: $width;
	overflow: hidden;
	white-space: nowrap;

	&::after {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		width: 30%;
		height: 100%;
		content: "";
		background-image:
			(linear-gradient(
				to right,
				rgba($color-dark, 0) 0%,
				$background-color 100%
			));
	}
}

.browser-preview {
	max-width: 426px;
	margin-top: 10px;
	overflow: hidden;
	box-shadow: 0 2px 4px rgb(0 0 0 / 4.46%);

	&__header {
		position: relative;
		overflow: hidden;
	}

	&__header-title {
		position: absolute;
		top: 16px;
		left: 86px;
		z-index: 1;
		font-size: 9px;
		font-weight: 500;
		line-height: 1.56;
		letter-spacing: 0.3px;

		@include fade-text-end(90px, $color-light);
	}

	&__header-input {
		position: absolute;
		top: 40px;
		bottom: 14px;
		left: 100px;
		font-size: 9px;
		font-weight: 300;
		line-height: 2.44;
		color: $color-gray-dark;
		letter-spacing: 0.45px;

		@include fade-text-end(300px, $color-gray-light);
	}

	&__header-favicon {
		position: absolute;
		top: 19px;
		left: 68px;
		z-index: 1;
		max-width: 11px;
		max-height: 11px;
	}

	&__content {
		height: auto;
		padding: 16px;
	}

	&__content-text {
		margin-bottom: 3px;
		color: $color-gray;
	}

	&__content-link {
		color: $color-success-dark;
	}

	&__content-title {
		margin-bottom: 8px;
		font-size: 18px;
		font-weight: bold;
		line-height: 1.2;
		color: $color-primary-dark;
	}
}
</style>
