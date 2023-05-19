<template>
	<div class="notification">
		<div
			v-if="isLoading"
			class="notification__loading"
		>
			<ZyroLoader
				class="notification__loader"
				size="56px"
				weight="3px"
			/>
			<div
				v-qa="'builder-heatmap-generating'"
				class="notification__label z-subheading"
			>
				{{ $t('builder.AIHeatmapGenerating') }}
			</div>
		</div>
		<div
			v-else-if="hasFailed"
			class="notification__error"
		>
			<div
				class="notification__label z-subheading"
			>
				{{ errorMessage }}
			</div>
			<ZyroButton
				color="plump-purple"
				class="notification__retry"
				theme="primary"
				type="button"
				@click="$emit('retry')"
			>
				{{ $t('builder.AIHeatmapRetry') }}
			</ZyroButton>
		</div>
	</div>
</template>

<script>
import ZyroButton from '@/components/global/ZyroButton.vue';

import ZyroLoader from '@zyro-inc/site-modules/components/ZyroLoader.vue';

import { defineComponent } from 'vue';

export default defineComponent({

	components: {
		ZyroButton,
		ZyroLoader,
	},

	props: {
		isLoading: {
			type: Boolean,
			required: true,
		},
		hasFailed: {
			type: Boolean,
			required: true,
		},
		errorMessage: {
			type: String,
			default: null,
		},
	},
	emits: ['retry'],
});
</script>

<style lang="scss" scoped>
.notification {
	position: fixed;
	top: 30vh;
	left: calc(50% - 110px);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 220px;
	padding: 32px;
	text-align: center;
	background-color: $color-light;

	&__loader {
		margin: 0 auto;
	}

	&__label {
		margin-top: 32px;
	}

	&__retry {
		margin-top: 32px;
	}
}
</style>
