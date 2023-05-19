<template>
	<span
		v-for="boldSpan in boldSpans"
		:key="boldSpan"
		class="z-body z-font-weight-bold"
		v-text="boldSpan"
	/>
	<a
		v-if="linkHref && linkText"
		v-qa="'integration-info-link'"
		class="z-body z-link text-link"
		:href="linkHref"
		target="_blank"
	>
		{{ $t(linkText) }}
	</a>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
	props: {
		linkHref: {
			type: String,
			default: null,
		},
		linkText: {
			type: String,
			default: null,
		},
		boldSpans: {
			type: Array,
			default: () => [],
		},
	},
});
</script>

<style lang="scss" scoped>
.text-link {
	color: $color-primary;
}
</style>
