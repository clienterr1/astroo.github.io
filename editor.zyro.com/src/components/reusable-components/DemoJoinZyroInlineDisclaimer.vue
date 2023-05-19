<template>
	<div class="join-zyro z-body-small">
		<ZyroButton
			theme="primary"
			color="plump-purple"
			class="join-zyro__button"
			@click="handleDemoRedirect"
		>
			{{ $t('common.chooseBuilder') }}
		</ZyroButton>
		{{ text }}
	</div>
</template>

<script>
import { defineComponent } from 'vue';

import { useRedirects } from '@/use/useRedirects';

import ZyroButton from '@/components/global/ZyroButton.vue';

export default defineComponent({
	components: {
		ZyroButton,
	},

	props: {
		text: {
			type: String,
			required: true,
		},
	},

	setup() {
		const { handleDemoRedirect } = useRedirects();

		return {
			handleDemoRedirect,
		};
	},
});
</script>

<style lang="scss" scoped>
.join-zyro {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;

	&__button {
		margin-bottom: 8px;
	}
}
</style>
