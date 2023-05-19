<template>
	<div
		ref="heatmapRef"
		class="heatmap"
		:class="heatmapClass"
		data-qa="builder-heatmap-overlay"
	>
		<BuilderHeatmapNotification
			v-if="showOverlay"
			class="heatmap__notification"
			data-qa="builder-heatmap-loader-generatingattentionmap"
			:is-loading="isLoading"
			:has-failed="hasFailed"
			:error-message="errorMessage"
			@retry="callHeatmapApi"
		/>
		<div
			ref="preview"
			v-qa="`builder-heatmap-preview-${showOverlay ? 'off' : 'on'}`"
			class="heatmap__preview"
			:style="previewStyle"
			:class="previewClass"
		/>
		<BuilderHeatmapControls
			class="heatmap__controls"
			:is-preview-enabled="isPreviewEnabled"
			:show-overlay="showOverlay"
			@toggle="isPreviewEnabled = !isPreviewEnabled"
		/>
	</div>
</template>

<script>
import {
	mapState,
	mapGetters,
	useStore,
} from 'vuex';

import BuilderHeatmapControls from '@/components/builder-view/components/BuilderHeatmapControls.vue';
import BuilderHeatmapNotification from '@/components/builder-view/components/BuilderHeatmapNotification.vue';

import {
	mapStateGui,
	CLOSE_HEATMAP,
} from '@/store/builder/gui';
import {
	useApi,
	AI_PAGE_HEATMAP,
} from '@/use/useApi';

import {
	ref,
	defineComponent,
} from 'vue';

import { onClickOutside } from '@/utils/onClickOutside';
import { DATA_SELECTOR_HEATMAP } from '@/constants';

export default defineComponent({
	components: {
		BuilderHeatmapNotification,
		BuilderHeatmapControls,
	},

	setup() {
		const {
			isLoading,
			hasFailed,
			errorMessage,
			result,
			callApi,
		} = useApi();

		const { dispatch } = useStore();

		const heatmapRef = ref(null);

		onClickOutside({
			target: heatmapRef,
			preventSelector: DATA_SELECTOR_HEATMAP,
		}, () => {
			dispatch(`gui/${CLOSE_HEATMAP}`);
		});

		return {
			result,
			isLoading,
			hasFailed,
			errorMessage,
			callApi,
			heatmapRef,
		};
	},

	data() {
		return {
			isPreviewEnabled: true,
		};
	},

	computed: {
		...mapState([
			'website',
			'websiteId',
		]),
		...mapStateGui(['isHeatmapOpen']),
		...mapGetters([
			'siteMeta',
			'currentPage',
		]),
		showOverlay() {
			return this.isLoading || this.hasFailed;
		},
		heatmapClass() {
			return ({
				'heatmap--bordered': this.isHeatmapOpen,
				'heatmap--darkened': this.showOverlay,
			});
		},
		previewClass() {
			return {
				'heatmap__preview--enabled': this.isPreviewEnabled,
			};
		},
		previewStyle() {
			return this.result && {
				backgroundImage: `url(${this.result})`,
			};
		},
	},

	mounted() {
		this.callHeatmapApi();
	},

	methods: {
		async callHeatmapApi() {
			const {
				offsetWidth: width,
				offsetHeight: height,
			} = this.$refs.heatmapRef;

			this.callApi(AI_PAGE_HEATMAP, {
				method: 'post',
				data: {
					zyroWebsiteData: this.website,
					path: this.currentPage?.slug ? `/${this.currentPage.slug}` : '/',
					siteId: this.websiteId,
					mode: 'base64',
					width: Math.round(width),
					height: Math.round(height),
					heatmapOnly: true, // flag for AI service
				},
				params: {
					...(import.meta.env.VITE_SCREENSHOT_PREVIEW && {
						screenshotPreview: import.meta.env.VITE_SCREENSHOT_PREVIEW,
					}),
				},
			});
		},
	},
});
</script>

<style lang="scss" scoped>
$border-offset: 5px;

.heatmap {
	position: absolute;
	top: 0;
	bottom: 0;
	z-index: $z-index-controls-heatmap;
	width: 100%;
	border: solid 0 $color-azure;
	transition:
		border-width 200ms $transition-timing-easing-standard,
		background-color 200ms $transition-timing-easing-standard;

	&--bordered {
		border-width: 0 $border-offset $border-offset;
	}

	&--darkened {
		background-color: rgba($color-dark, 0.3);
	}

	&__preview {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: $z-index-controls-heatmap-preview;
		pointer-events: none;
		background-position: -$border-offset 0;
		opacity: 0;
		transition: opacity 400ms $transition-timing-easing-standard;

		&--enabled {
			opacity: 1;
		}
	}
}
</style>
