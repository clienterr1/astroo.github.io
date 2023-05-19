<template>
	<div class="user-image__image-container">
		<img
			:src="src"
			class="user-image__image"
			data-qa="chooseimage-uploadedimage"
			@dragstart.prevent
			@click.stop="$emit('click-image', {
				imageKey: id,
				e: $event
			})"
		>
		<slot />
		<div
			v-if="isLoading"
			class="user-image__loader"
		>
			<ZyroSvgDeprecated
				class="user-image__loader-cancel"
				name="x"
				@click="$emit('cancel-upload', id)"
			/>
			<UploadLoader
				class="user-image__loader-svg"
				:progress="loadPercentage"
				@animation-finished="isAnimationFinished = true"
			/>
		</div>
	</div>
</template>

<script>
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import UploadLoader from '@/components/builder-modals/modals/asset-manager/user/UploadLoader.vue';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroSvgDeprecated,
		UploadLoader,
	},

	props: {
		src: {
			type: String,
			required: true,
		},

		isFreshUpload: {
			type: Boolean,
			default: false,
		},

		loadPercentage: {
			type: Number,
			default: null,
		},

		id: {
			type: String,
			required: true,
		},
	},

	data() {
		return {
			isAnimationFinished: false,
		};
	},

	computed: {
		isLoading() {
			return this.isFreshUpload && (this.loadPercentage !== 100 || !this.isAnimationFinished);
		},
	},
});
</script>
<style lang="scss" scoped>
.user-image {
	&__image-container {
		position: relative;
		flex: 1 1 auto;
		height: 150px;
		margin: 0;
		overflow: hidden;
		cursor: var(--cursor, pointer);
		background-color: $color-gray-light;
		border: 1px solid $color-gray-border;
	}

	&__image {
		width: 100%;
		height: 100%;
		object-fit: var(--object-fit, cover);
	}

	&__loader,
	&__loader-cancel {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
	}

	&__loader {
		display: flex;
		background: rgb(0 0 0 / 50%);
	}

	&__loader-svg {
		margin: auto;
	}

	&__loader-cancel {
		$size: 24px;

		width: $size;
		height: $size;
		margin: auto;
		color: $color-light;
		opacity: 0;
		transition: opacity 0.1s $transition-timing-easing-standard;

		&:hover {
			opacity: 1;
		}
	}
}
</style>
