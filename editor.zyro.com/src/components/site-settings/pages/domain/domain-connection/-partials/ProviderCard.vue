<template>
	<div class="provider-card">
		<ZyroSvgDeprecated
			:name="icon"
			class="provider-card__logo"
		/>
		<div class="provider-card__info">
			<p class="z-body provider-card__info-text">
				<slot name="text" />
			</p>
			<slot name="footer" />
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

	props: {
		icon: {
			type: String,
			default: null,
		},
	},
});
</script>

<style lang="scss" scoped>
.provider-card {
	display: flex;
	align-items: flex-start;
	justify-content: flex-start;
	width: 100%;
	padding: 24px;
	background-color: $color-gray-light;

	&__logo {
		width: 70px;
		height: 70px;
		margin-right: 24px;
	}

	&__info-text {
		margin-bottom: 8px;
	}
}
</style>
