<template>
	<div
		class="block__hidden-overlay"
	>
		<p class="z-body">
			{{ $t('builder.thisSectionIsHidden') }}
		</p>
		<ZyroButton
			theme="primary"
			color="black"
			class="block__hidden-button"
			@click="$emit('button-click')"
		>
			<template #icon-left>
				<Icon
					name="visibility"
					dimensions="16px"
				/>
			</template>
			{{ $t('builder.showSection') }}
		</ZyroButton>
	</div>
</template>

<script>
import Icon from '@/components/global/Icon.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		Icon,
		ZyroButton,
	},
});
</script>

<style lang="scss" scoped>
.block {
	&__hidden-overlay {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: $z-index-controls-block-hidden;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: rgba($color-light, 0.7);
	}

	&__hidden-button {
		margin-top: 16px;
	}
}
</style>
