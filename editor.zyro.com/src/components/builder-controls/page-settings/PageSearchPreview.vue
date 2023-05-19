<template>
	<div class="search-preview">
		<div class="search-preview__title">
			{{ $t('builder.pageSettingsModal.searchResultPreview') }}
		</div>
		<div class="search-preview__preview">
			<div class="search-preview__preview-title">
				{{ title }}
			</div>
			<div class="search-preview__preview-link">
				{{ url }}
			</div>
			<div class="search-preview__preview-text">
				{{ description }}
			</div>
		</div>
	</div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
	props: {
		title: {
			type: String,
			default: '',
		},
		description: {
			type: String,
			default: '',
		},
		url: {
			type: String,
			default: '',
		},
	},
});
</script>

<style lang="scss" scoped>
.search-preview {
	&__title {
		margin-bottom: 8px;
		font-size: 14px;
		font-weight: 700;
		line-height: 1.71;
	}

	&__preview {
		max-width: 426px;
		height: auto;
		padding: 12px 16px;
		overflow: hidden;
		border: 1px solid $color-gray-border;
		border-radius: 4px;
	}

	&__preview-title {
		font-size: 20px;
		font-weight: 700;
		line-height: 1.6;
		color: $color-primary-dark;
	}

	&__preview-link {
		font-size: 14px;
		font-weight: 400;
		line-height: 1.71;
		color: $color-success-dark;
	}

	&__preview-text {
		font-size: 14px;
		font-weight: 400;
		line-height: 1.71;
		color: $color-gray;
	}
}
</style>
