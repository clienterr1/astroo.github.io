<template>
	<div class="warning-tooltip">
		<ZyroTooltip
			toggle-event="hover"
			mode="dark"
			position="right"
		>
			<template #trigger>
				<ZyroSvgDeprecated name="warning" />
			</template>
			<slot />
		</ZyroTooltip>
	</div>
</template>
<script>
import ZyroTooltip from '@/components/global/ZyroTooltip.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import { defineComponent } from 'vue';

export default defineComponent({
	name: 'WarningTooltip',

	components: {
		ZyroTooltip,
		ZyroSvgDeprecated,
	},
});
</script>
<style lang="scss">
@import "@zyro-inc/site-modules/scss/components/WarningTooltip";
</style>
