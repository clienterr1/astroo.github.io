<template>
	<div>
		<ZyroCssShorthandControl
			:model-value="padding"
			units="px"
			data-qa="edit-video-popup-layout-padding"
			:label="$t('common.padding')"
			:title-vertical="$t('common.vertical')"
			:title-horizontal="$t('common.horizontal')"
			@update:model-value="updatePadding"
		/>
	</div>
</template>

<script>
import ZyroCssShorthandControl from '@/components/global/ZyroCssShorthandControl.vue';

import {
	mapGetters,
	mapActions,
} from 'vuex';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroCssShorthandControl,
	},

	computed: {
		...mapGetters([
			'currentElement',
			'currentElementStyles',
		]),
		padding() {
			return this.currentElementStyles['grid-item-padding'] || '0';
		},
	},

	methods: {
		...mapActions(['mergeCurrentElementData']),

		updatePadding(newValue) {
			this.mergeCurrentElementData({
				elementData: {
					settings: {
						styles: {
							'grid-item-padding': newValue,
						},
					},
				},
			});
		},
	},
});
</script>
