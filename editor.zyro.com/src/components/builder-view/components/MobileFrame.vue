<template>
	<div
		class="mobile-frame"
		:class="{
			'mobile-frame--layout': isBuilderPreview,
			'mobile-frame--tablet' : isTabletView,
			'mobile-frame--mobile-builder' : isMobileView && isBuilderPreview,
			'zyro-mb-preview': isMobileView && !isBuilderPreview,
		}"
		:style="computedStyles"
	>
		<slot />
	</div>
</template>

<script>
import { mapState } from 'vuex';

import {
	computed,
	defineComponent,
} from 'vue';
import { MOBILE_BLOCK_WIDTH } from '@zyro-inc/site-modules/components/blocks/layout/constants';

export default defineComponent({
	props: {
		isBuilderPreview: {
			type: Boolean,
			default: false,
		},
	},

	setup() {
		const computedStyles = computed(() => ({
			'--mobile-frame-size': `${MOBILE_BLOCK_WIDTH}px`,
		}));

		return {
			computedStyles,
		};
	},

	computed: {
		...mapState('gui', [
			'isMobileView',
			'isTabletView',
		]),
	},
});
</script>

<style lang="scss" scoped>
$border-width: 10px;

.mobile-frame {
	$this: &;

	position: relative;
	width: 100%;
	height: 100%;
	margin: auto;

	&--layout {
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	:deep(.preview-iframe__iframe) {
		transition: 0.4s $transition-timing-easing-decelerate;
	}

	&--tablet {
		:deep(.preview-iframe__iframe) {
			width: 785px;
			height: 96%;
			border: 1px solid $color-gray-border;
		}
	}

	&--mobile-builder {
		height: 85%;
		max-height: 850px;
		margin-top: 20px;

		:deep(.preview-iframe__iframe) {
			width: calc(var(--mobile-frame-size) + $border-width * 2);
			border: $border-width solid black;
			border-radius: 50px;
			box-shadow: 6px 8px 14px rgb(0 0 0 / 50%);
		}
	}

	&.zyro-mb-preview {
		width: var(--mobile-frame-size);
		margin: auto;
	}
}
</style>
