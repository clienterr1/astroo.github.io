<template>
	<span
		class="z-link"
		@click="openDrawer({ id:DRAWER_ADD_ELEMENT })"
	>
		<ZyroSvgDeprecated
			class="subtitle-icon"
			name="plus-circle"
		/>
		<!-- Using v-text to remove white-spaces on left ant right -->
		<span
			class="z-body-small z-body-small--strong"
			v-text="$t('builder.emptyBlockWarning.subtitleSlot')"
		/>
	</span>
</template>

<script>
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import { DRAWER_ADD_ELEMENT } from '@/constants';
import {
	mapActionsGui,
	OPEN_DRAWER,
} from '@/store/builder/gui';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroSvgDeprecated,
	},

	setup() {
		return {
			DRAWER_ADD_ELEMENT,
		};
	},

	methods: {
		...mapActionsGui({
			openDrawer: OPEN_DRAWER,
		}),
	},
});
</script>

<style lang="scss" scoped>
	.subtitle-icon {
		margin-right: 4px;
		vertical-align: text-top;
	}
</style>
