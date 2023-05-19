<template>
	<button
		v-qa="`context-menu-${title}-btn`"
		class="context-menu-button z-body-small"
		:disabled="isDisabled"
	>
		{{ title }}
		<span
			v-if="shortcut"
			class="context-menu-button__shortcut"
		>
			{{ isMac ? shortcut.mac : shortcut.windows }}
		</span>
	</button>
</template>

<script>

import { defineComponent } from 'vue';
import { getIsUserUsingMac } from '@/utils/getIsUserUsingMac';

export default defineComponent({
	props: {
		title: {
			type: String,
			required: true,
		},
		shortcut: {
			type: Object,
			default: null,
			validator: (shortcut) => 'mac' in shortcut && 'windows' in shortcut,
		},
		isDisabled: {
			type: Boolean,
			default: false,
		},
	},

	setup() {
		return {
			isMac: getIsUserUsingMac(),
		};
	},
});
</script>

<style lang="scss" scoped>
.context-menu-button {
	display: flex;
	width: 100%;
	padding: 10px 16px;

	&:disabled {
		color: $color-gray;
	}

	&:hover,
	&:focus-visible {
		&:not(:disabled) {
			cursor: pointer;
			background: $color-gray-light;
		}
	}

	&__shortcut {
		margin-left: auto;
		color: $color-gray;
		letter-spacing: 0.15em;
	}
}
</style>
