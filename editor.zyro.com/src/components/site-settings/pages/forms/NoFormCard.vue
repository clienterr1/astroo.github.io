<template>
	<div
		class="no-forms"
		data-qa="sitesettings-forms-noforms"
	>
		<h3 class="z-h5 z-font-weight-light">
			{{ $t('siteSettings.forms.noForms.title') }}
		</h3>
		<p class="z-body">
			{{ $t('siteSettings.forms.noForms.text') }}
		</p>
	</div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({});
</script>

<style lang="scss" scoped>
.no-forms {
	padding: 56px 72px;
	background: $color-light;

	@media screen and (max-width: $media-mobile) {
		padding: 0 16px 32px;
	}
}
</style>
