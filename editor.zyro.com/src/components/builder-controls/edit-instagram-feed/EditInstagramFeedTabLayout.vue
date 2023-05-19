<template>
	<div>
		<ZyroFieldRange
			:label="$t('builder.editCommon.itemsPerRow')"
			class="edit-instagram-feed__style-range"
			units=""
			:model-value="itemsPerRow"
			min="1"
			max="16"
			@update:model-value="itemsPerRow = $event"
		/>
		<ZyroFieldRange
			:label="$t('builder.editCommon.gapBetweenPhotos')"
			class="edit-instagram-feed__style-range"
			:model-value="itemGap"
			min="0"
			max="72"
			step="8"
			@update:model-value="itemGap = $event"
		/>
	</div>
</template>

<script>
import ZyroFieldRange from '@/components/global/ZyroFieldRange.vue';

import {
	mapState,
	mapGetters,
	mapActions,
} from 'vuex';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroFieldRange,
	},

	computed: {
		...mapState('gui', ['isMobileView']),
		...mapGetters(['currentElementStyles']),
		itemsPerRow: {
			get() {
				const key = this.isMobileView ? 'm-items-per-row' : 'items-per-row';

				return this.currentElementStyles[key];
			},
			set(newValue) {
				const key = this.isMobileView ? 'm-items-per-row' : 'items-per-row';

				this.mergeCurrentElementData({
					elementData: {
						settings: {
							styles: {
								[key]: Number.parseInt(newValue, 10),
							},
						},
					},
				});
			},
		},
		itemGap: {
			get() {
				const key = this.isMobileView ? 'm-item-gap' : 'item-gap';

				return Number.parseInt(this.currentElementStyles[key], 10);
			},
			set(newValue) {
				const key = this.isMobileView ? 'm-item-gap' : 'item-gap';

				this.mergeCurrentElementData({
					elementData: {
						settings: {
							styles: {
								[key]: `${newValue}px`,
							},
						},
					},
				});
			},
		},
	},

	methods: {
		...mapActions(['mergeCurrentElementData']),
	},
});
</script>

<style lang="scss" scoped>
.edit-instagram-feed {
	&__style-range:not(:last-of-type) {
		padding-bottom: 24px;
		border-bottom: 0.5px solid $color-gray-border;
	}
}
</style>
