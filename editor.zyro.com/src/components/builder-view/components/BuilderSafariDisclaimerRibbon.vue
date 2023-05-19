<template>
	<div class="safari-ribbon z-body-small">
		<ZyroSvgDeprecated
			class="safari-ribbon__icon"
			name="info-circle"
		/>
		<div class="safari-ribbon__text">
			<i18n-t
				tag="p"
				keypath="builder.safariDisclaimerRibbon"
			>
				<a
					class="safari-ribbon__link"
					:title="$t('builder.safariDisclaimerRibbonLink')"
					target="_blank"
					href="https://support.apple.com/en-us/HT204416"
					rel="noopener noreferrer"
				>
					{{ $t("builder.safariDisclaimerRibbonLink") }}
				</a>
			</i18n-t>
		</div>
	</div>
</template>
<script>
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroSvgDeprecated,
	},
});
</script>
<style lang="scss" scoped>
.safari-ribbon {
	display: flex;
	align-items: center;
	width: 100%;
	padding: 14px 24px;
	color: $color-light;
	background: $color-primary;

	&__icon {
		flex-shrink: 0;
		width: 16px;
		height: 16px;
		margin-right: 8px;
	}

	&__link {
		display: inline-block;
	}
}
</style>
