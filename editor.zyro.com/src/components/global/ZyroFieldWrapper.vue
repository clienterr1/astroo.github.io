<template>
	<div class="zyro-field-wrapper">
		<span
			v-if="hasSlotContent($slots.prefix)"
			class="zyro-field-wrapper__prefix"
		>
			<slot name="prefix" />
		</span>

		<slot />

		<span
			v-if="hasSlotContent($slots.suffix)"
			class="zyro-field-wrapper__suffix"
		>
			<slot name="suffix" />
		</span>
	</div>
</template>

<script>
import { defineComponent } from 'vue';

import { hasSlotContent } from '@zyro-inc/site-modules/utils/hasSlotContent';

export default defineComponent({
	setup() {
		return {
			hasSlotContent,
		};
	},
});
</script>

<style lang="scss" scoped>
.zyro-field-wrapper {
	$spacing: 16px;

	display: flex;
	align-items: center;

	&__prefix,
	&__suffix {
		display: flex;
		align-items: center;
	}

	&__prefix {
		margin-right: $spacing;
	}

	&__suffix {
		margin-left: $spacing;
	}
}
</style>
