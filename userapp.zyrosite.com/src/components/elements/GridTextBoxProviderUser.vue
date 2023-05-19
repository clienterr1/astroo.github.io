<template>
	<GridTextBox
		:is-white-space-normal="isWhiteSpaceNormal"
		:background-color="data.backgroundColor"
		:content="data.content"
	/>
</template>

<script>
import GridTextBox from '@zyro-inc/site-modules/components/elements/text-box/GridTextBox.vue';

import { defineComponent } from 'vue';

export default defineComponent({
	name: 'GridTextBoxProviderUser',

	components: {
		GridTextBox,
	},

	props: {
		data: {
			type: Object,
			required: true,
		},
	},

	computed: {
		isWhiteSpaceNormal() {
			return this.data.settings.styles.text === 'justify';
		},
	},
});
</script>
