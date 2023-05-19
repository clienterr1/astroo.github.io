<template>
	<Transition
		name="fade"
		mode="out-in"
	>
		<img
			v-bind="$attrs"
			:loading="isEager ? 'eager': 'lazy'"
			:src="imageUrl"
			:alt="alt"
			:srcset="srcset"
			:sizes="sizes"
			class="ecommerce-product-image"
			:class="{ 'ecommerce-product-image--loading': !isLoaded }"
			@load="isLoaded = true"
			@error="isLoaded = true"
		>
	</Transition>
</template>

<script>
import {
	getOptimizedSrc,
	getGridItemSrcset,
	getGridItemSizes,
} from '@zyro-inc/site-modules/utils/getSrcsets';

import { defineComponent } from 'vue';

export default defineComponent({
	props: {
		alt: {
			type: String,
			default: null,
		},
		src: {
			type: String,
			required: true,
		},
		isEager: {
			type: Boolean,
			default: false,
		},
		objectFit: {
			type: String,
			default: 'cover',
		},
		width: {
			type: Number,
			default: null,
		},
		height: {
			type: Number,
			default: null,
		},
		enableSrcset: {
			type: Boolean,
			default: false,
		},
		imageOrigin: {
			type: String,
			default: 'other',
		},
		isLossless: {
			type: Boolean,
			default: false,
		},
		siteId: {
			type: String,
			default: null,
		},
	},

	data() {
		return {
			imageUrl: this.src,
			srcset: null,
			isLoaded: false,
		};
	},

	computed: {
		sizes() {
			return this.enableSrcset ? getGridItemSizes(this.width, null) : null;
		},
	},

	watch: {
		objectFit(newValue, oldValue) {
			// watch objectFit values and fetch new one only if the image has property crop
			// so the new value would be re-fitted with full size into the image frame
			if (newValue !== oldValue && oldValue === 'cover' && this.imageUrl.includes('fit=crop')) {
				this.imageUrl = this.getImageUrl();
				this.srcset = this.getSrcSet();
			}
		},
	},

	created() {
		this.imageUrl = this.getImageUrl();
		this.srcset = this.getSrcSet();
	},

	methods: {
		getImageUrl() {
			return getOptimizedSrc(this.imageOrigin, this.src, this.siteId, {
				width: this.width,
				height: this.height,
				shouldContain: this.objectFit === 'contain',
				isLossless: this.isLossless,
			});
		},
		getSrcSet() {
			return this.enableSrcset ? getGridItemSrcset(this.imageOrigin, this.src, this.siteId, {
				width: this.width,
				height: this.height,
				shouldContain: this.objectFit === 'contain',
				isLossless: this.isLossless,
			}) : null;
		},
	},
});
</script>

<style lang="scss">
.ecommerce-product-image {
	&--loading {
		visibility: hidden;
	}
}
</style>
