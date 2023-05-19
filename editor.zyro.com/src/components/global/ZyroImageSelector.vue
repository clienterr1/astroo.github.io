<template>
	<div
		class="zyro-image-selector"
		:style="computedStyles"
	>
		<button
			class="zyro-image-selector__button"
			data-qa="builder-sectionsettings-btn-addimage"
			:title="selectorText"
			@click="handleClick"
		>
			<img
				v-if="selectedImageSrc"
				:src="selectedImageSrc"
				alt=""
				class="zyro-image-selector__image"
			>
			<div
				v-if="isDemoMode"
				class="zyro-image-selector__description-demo"
			>
				<DemoJoinZyroInlineDisclaimer :text="$t('builder.demoBuilderChooseBuilderToUploadImages')" />
			</div>
			<div
				v-else
				class="zyro-image-selector__description z-button"
			>
				<ZyroSvgDeprecated
					class="zyro-image-selector__icon"
					name="camera"
				/>
				{{ selectorText }}
			</div>
		</button>
		<Teleport
			v-if="showAssetManager"
			to="body"
		>
			<AssetManager
				:visible-categories="[ASSETS_CATEGORY_IMAGE]"
				@select-image="setNewImage($event), showAssetManager = false"
				@close="showAssetManager = false"
			/>
		</Teleport>
	</div>
</template>

<script>
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';
import { mapState } from 'vuex';

import { getImageSrc } from '@zyro-inc/site-modules/utils/getImageSrc';

import AssetManager from '@/components/builder-modals/modals/AssetManager.vue';
import {
	ASSETS_CATEGORY_IMAGE,
	ASSETS_CATEGORY_DOCUMENT,
} from '@/constants';
import DemoJoinZyroInlineDisclaimer from '@/components/reusable-components/DemoJoinZyroInlineDisclaimer.vue';

import { defineComponent } from 'vue';

export default defineComponent({

	components: {
		ZyroSvgDeprecated,
		AssetManager,
		DemoJoinZyroInlineDisclaimer,
	},

	props: {
		origin: {
			type: String,
			default: null,
		},
		path: {
			type: String,
			default: null,
		},
		objectFit: {
			type: String,
			default: 'contain',
			validator: (value) => [
				'contain',
				'cover',
			].includes(value),
		},
	},
	emits: ['update'],

	setup() {
		return {
			ASSETS_CATEGORY_IMAGE,
			ASSETS_CATEGORY_DOCUMENT,
		};
	},

	data() {
		return {
			showAssetManager: false,
		};
	},

	computed: {
		...mapState([
			'websiteId',
			'isDemoMode',
		]),
		selectedImageSrc() {
			return getImageSrc(this.origin, this.path, this.websiteId);
		},
		computedStyles() {
			return {
				'--z-object-fit': this.objectFit || undefined,
			};
		},
		selectorText() {
			return this.selectedImageSrc ? this.$t('common.replaceImage') : this.$t('common.addImage');
		},
	},

	methods: {
		setNewImage(newValue) {
			this.$emit('update', newValue);
		},
		handleClick() {
			if (this.isDemoMode) {
				return;
			}

			this.showAssetManager = true;
		},
	},
});
</script>

<style lang="scss" scoped>
.zyro-image-selector {
	margin-bottom: 16px;

	&__button {
		position: relative;
		display: block;
		width: 100%;
		height: 200px;
		cursor: pointer;
		background-color: $color-gray-border;
	}

	// Image is used instead of background image, because background-image flickers
	&__image {
		object-fit: var(--z-object-fit, contain);
		width: 100%;
		height: 100%;
		object-position: center center;
	}

	&__icon {
		margin-bottom: 10px;
	}

	&__description {
		position: absolute;
		bottom: 0;
		left: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		padding: 20px 0;
		color: $color-light;
		background: rgb(0 0 0 / 60%);
		backdrop-filter: blur(2px);
	}

	&__description-demo {
		position: absolute;
		bottom: 0;
		left: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		padding: 20px 0;
		color: $color-light;
		background: rgb(0 0 0 / 60%);
		backdrop-filter: blur(2px);
	}
}
</style>
