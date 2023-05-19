<template>
	<div>
		<ZyroImageSelector
			v-qa="'sitesettings-popup-input-ogimage-name'"
			:origin="ogImageOrigin"
			:path="ogImagePath"
			@update="$emit('og-image-change', $event)"
		/>
		<p class="subtitle z-body-small">
			{{ $t('builder.pageSettingsModal.socialImageSubtitle') }}
		</p>
	</div>
</template>
<script>
import ZyroImageSelector from '@/components/global/ZyroImageSelector.vue';

export default {
	components: {
		ZyroImageSelector,
	},
	props: {
		ogImageOrigin: {
			type: String,
			default: null,
		},
		ogImagePath: {
			type: String,
			default: null,
		},
		ogImageAlt: {
			type: String,
			default: '',
		},
	},
	emits: ['og-image-change'],
};
</script>
<style lang="scss" scoped>
.subtitle {
	color: $color-gray;
}
</style>
