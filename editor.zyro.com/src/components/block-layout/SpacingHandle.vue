<template>
	<button
		ref="spacingHandle"
		class="spacing-handle"
		:class="{ 'spacing-handle--outside-element-box': isHandleDisplayedOutsideElementBox }"
	>
		<Icon
			class="spacing-handle__icon"
			name="vertical_align_bottom"
			dimensions="16px"
		/>
	</button>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

import Icon from '@/components/global/Icon.vue';

import {
	ELEMENT_POSITION_KEY_MOBILE,
	ELEMENT_POSITION_KEY_DESKTOP,
} from '@zyro-inc/site-modules/constants';

import { SPACING_HANDLE_OUTSIDE_ELEMENT_BOX_WIDTH_THRESHOLD } from '@/constants';

const props = defineProps({
	elementData: {
		type: Object,
		required: true,
	},
});

const { getters } = useStore();

const isMobileMode = computed(() => getters['gui/isMobileMode']);
const elementPositionKey = computed(() => (isMobileMode.value ? ELEMENT_POSITION_KEY_MOBILE : ELEMENT_POSITION_KEY_DESKTOP));
const isHandleDisplayedOutsideElementBox = computed(() => {
	const elementWidth = props.elementData[elementPositionKey.value].width;

	return elementWidth < SPACING_HANDLE_OUTSIDE_ELEMENT_BOX_WIDTH_THRESHOLD;
});

</script>

<style lang="scss" scoped>
$handle-width: 48px;
$handle-height: 24px;
$handle-right-offset: 14px;

.spacing-handle {
	display: flex;
	align-items: center;
	padding: 4px 16px;
	position: absolute;
	top: -#{calc($handle-height / 2)};
	right: 20px;
	background: $color-azure;
	box-shadow: 0 6px 14px rgba($color-light, 10%);
	border-radius: 4px;
	z-index: 2;
	cursor: row-resize;

	&--outside-element-box {
		right: #{($handle-width + $handle-right-offset) * -1};
	}

	&__icon {
		color: $color-light;
	}
}
</style>
