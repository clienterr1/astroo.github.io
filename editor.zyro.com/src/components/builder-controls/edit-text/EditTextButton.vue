<template>
	<EditTextTooltip
		:tooltip-text="tooltipText"
		:tooltip-vertical-position="tooltipVerticalPosition"
	>
		<button
			v-qa="dataQa"
			class="toolbar-button z-body-small"
			:class="{
				'toolbar-button--active': isActive,
				'toolbar-button--square': isSquare,
				'toolbar-button--rounded-left': isRoundedLeft,
				'toolbar-button--rounded-right': isRoundedRight
			}"
		>
			<slot />
		</button>
	</EditTextTooltip>
</template>

<script>
import EditTextTooltip from '@/components/builder-controls/edit-text/EditTextTooltip.vue';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		EditTextTooltip,
	},

	props: {
		isActive: {
			type: Boolean,
			default: false,
		},
		isSquare: {
			type: Boolean,
			default: true,
		},
		isRoundedLeft: {
			type: Boolean,
			default: false,
		},
		isRoundedRight: {
			type: Boolean,
			default: false,
		},
		showDropdownIndicator: {
			type: Boolean,
			default: false,
		},
		tooltipText: {
			default: null,
			type: String,
		},
		tooltipVerticalPosition: {
			default: 'top',
			type: String,
		},
		dataQa: {
			type: String,
			default: null,
		},
	},
});
</script>

<style lang="scss" scoped>
.toolbar-button {
	$height: 36px;

	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: $height;
	padding: 0 10px;
	transition: all 0.2s ease;

	&--active {
		background-color: $color-gray-light;
	}

	&--square {
		width: $height;
		padding: 0;
	}

	&--rounded-left {
		border-top-left-radius: $border-radius-round;
		border-bottom-left-radius: $border-radius-round;
	}

	&--rounded-right {
		border-top-right-radius: $border-radius-round;
		border-bottom-right-radius: $border-radius-round;
	}

	&:disabled {
		color: $color-gray-border;
	}

	&:hover {
		cursor: pointer;
		background-color: $color-gray-light;
	}

	&:disabled:hover {
		cursor: default;
		background-color: $color-light;
	}
}
</style>
