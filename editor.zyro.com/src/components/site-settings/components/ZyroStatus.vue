<template>
	<div class="status">
		<ZyroSvgDeprecated
			v-show="statusDone"
			name="check-round-green"
			class="status__icon"
		/>
		<span class="status__text z-body-small z-font-weight-bold">
			{{ statusText }}
		</span>
	</div>
</template>
<script>
import { defineComponent } from 'vue';

import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

export default defineComponent({
	components: {
		ZyroSvgDeprecated,
	},

	props: {
		statusDone: {
			type: Boolean,
			default: false,
		},
		text: {
			type: String,
			default: null,
		},
		textDone: {
			type: String,
			default: null,
		},
	},

	computed: {
		statusText() {
			const completedStatusText = this.textDone ?? this.$t('common.completed');
			const defaultStatusText = this.text ?? this.$t('common.update');

			return this.statusDone ? completedStatusText : defaultStatusText;
		},
	},
});
</script>

<style lang="scss" scoped>
.status {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	margin-right: 8px;

	&__icon {
		width: 12px;
		height: 12px;
		margin-right: 8px;
	}

	&__text {
		margin-bottom: 0;
		color: $color-dark;

		@media screen and (max-width: $media-mobile) {
			opacity: 0;
		}
	}
}

</style>
