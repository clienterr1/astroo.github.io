<template>
	<div class="zyro-icon-controls zyro-icon-controls--rounded">
		<EditTextButton
			v-for="icon in icons"
			:key="icon.value"
			:data-qa="`iconcontrols-${icon.value}`"
			:tooltip-text="$t(icon.translationPath)"
			tooltip-vertical-position="bottom"
			class="zyro-icon-controls__icon"
			:is-active="icon.value === modelValue"
			@click="$emit('update:model-value', icon.value)"
		>
			<ZyroSvgDeprecated
				:direction="icon.direction"
				:name="icon.icon"
			/>
		</EditTextButton>
	</div>
</template>

<script>
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import EditTextButton from '@/components/builder-controls/edit-text/EditTextButton.vue';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroSvgDeprecated,
		EditTextButton,
	},

	props: {
		modelValue: {
			type: String,
			default: null,
		},
		icons: {
			type: Array,
			required: true,
		},
	},

	emits: ['update:model-value'],
});
</script>

<style lang="scss" scoped>
.zyro-icon-controls {
	top: 4px;
	display: inline-flex;
	background: $color-light;
	border-radius: $border-radius-small;
	box-shadow: $box-shadow;

	&__icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;

		svg {
			width: 16px;
			height: 16px;
		}
	}

	&--rounded &__icon {
		&:first-child {
			border-radius: 5px 0 0 5px;
		}

		&:last-child {
			border-radius: 0 5px 5px 0;
		}
	}
}
</style>
