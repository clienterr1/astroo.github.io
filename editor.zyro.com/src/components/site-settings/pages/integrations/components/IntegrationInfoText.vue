<template>
	<div>
		<i18n-t
			:key="translationKey"
			:keypath="translationKey"
			tag="p"
			class="z-body integration-info-text__text"
		>
			<IntegrationInfoTextTranslations
				:bold-spans="boldSpans"
				:link-text="linkText"
				:link-href="linkHref"
			/>
		</i18n-t>
	</div>
</template>

<script>
import { defineComponent } from 'vue';
import IntegrationInfoTextTranslations from '@/components/site-settings/pages/integrations/components/IntegrationInfoTextTranslations.vue';

export default defineComponent({
	components: {
		IntegrationInfoTextTranslations,
	},
	props: {
		translationKey: {
			type: String,
			required: true,
		},
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
.integration-info-text {
	&__text {
		margin-bottom: 32px;

		&:last-child {
			margin-bottom: 0;
		}
	}
}
</style>
