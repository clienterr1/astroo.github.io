<template>
	<ButtonStyleSettingsV2 @set-button-style="setButtonStyle" />
</template>

<script>
import { mapActions } from 'vuex';

import ButtonStyleSettingsV2 from '@/components/builder-controls/edit-button/-partials/button-style-tab/ButtonStyleSettingsV2.vue';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ButtonStyleSettingsV2,
	},

	methods: {
		...mapActions(['mergeCurrentElementData']),
		setButtonStyle(stylesToMerge) {
			this.mergeCurrentElementData({
				elementData: {
					...stylesToMerge,
				},
			});
		},
	},
});
</script>
