<template>
	<EditTextMoreItem :title="$t('builder.editText.textGenerator')">
		<button
			class="generator-button z-button-small"
			data-qa="textbox-ai-generator-button"
			:[DATA_ATTRIBUTE_SELECTOR]="DATA_ATTRIBUTE_SELECTOR_DRAWER_TRIGGER"
			@click="toggleDrawer(DRAWER_AI_WRITER)"
		>
			{{ $t('common.open') }}
		</button>
	</EditTextMoreItem>
</template>

<script>
import EditTextMoreItem from '@/components/builder-controls/edit-text/EditTextMoreItem.vue';
import { DRAWER_AI_WRITER } from '@/constants';
import {
	mapActionsGui,
	TOGGLE_DRAWER,
} from '@/store/builder/gui';
import {
	DATA_ATTRIBUTE_SELECTOR,
	DATA_ATTRIBUTE_SELECTOR_DRAWER_TRIGGER,
} from '@zyro-inc/site-modules/constants';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		EditTextMoreItem,
	},

	setup() {
		return {
			DRAWER_AI_WRITER,
			TOGGLE_DRAWER,
			DATA_ATTRIBUTE_SELECTOR,
			DATA_ATTRIBUTE_SELECTOR_DRAWER_TRIGGER,
		};
	},

	methods: mapActionsGui({
		toggleDrawer: TOGGLE_DRAWER,
	}),
});
</script>

<style lang="scss" scoped>
.generator-button {
	padding: 8px 26px;
	color: $color-light;
	cursor: pointer;
	background: $color-dark;
	border-radius: 100px;
}
</style>
