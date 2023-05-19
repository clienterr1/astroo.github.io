<template>
	<div>
		<ZyroFieldInput
			:id="`${currentElementId}-text`"
			:model-value="src"
			:label="$t('builder.editMap.tabActionLabel')"
			@update:model-value="updateSrc"
		/>
	</div>
</template>

<script>
import ZyroFieldInput from '@/components/global/ZyroFieldInput.vue';

import {
	mapState,
	mapGetters,
	mapActions,
} from 'vuex';

import {
	addressToGoogleMapUrl,
	googleMapUrlToAddress,
} from '@/utils/urlValidators';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroFieldInput,
	},

	computed: {
		...mapState(['currentElementId']),
		...mapGetters(['currentElementSettings']),
		src() {
			return googleMapUrlToAddress(this.currentElementSettings.src);
		},
	},

	methods: {
		...mapActions(['mergeCurrentElementData']),

		updateSrc(newValue) {
			this.mergeCurrentElementData({
				elementData: {
					settings: {
						src: addressToGoogleMapUrl(newValue),
					},
				},
			});
		},
	},
});
</script>
