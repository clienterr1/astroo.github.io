<template>
	<ZyroTooltip
		position="right"
		class="info"
		content-position="absolute"
		toggle-event="hover"
		:mode="mode"
	>
		<template #trigger>
			<button
				class="info__button"
			>
				<ZyroSvgDeprecated
					name="help"
				/>
			</button>
		</template>
		<div class="info__content">
			<p class="z-body-small">
				{{ infoText }}
			</p>
		</div>
	</ZyroTooltip>
</template>

<script>
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';
import ZyroTooltip from '@/components/global/ZyroTooltip.vue';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroSvgDeprecated,
		ZyroTooltip,
	},

	props: {
		infoText: {
			type: String,
			default: '',
		},
		mode: {
			type: String,
			default: 'dark',
		},
	},
});

</script>

<style lang="scss" scoped>
.info {
	&__content {
		max-width: 200px;
	}

	&__button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 20px;
		height: 20px;
		color: $color-gray;
	}
}
</style>
