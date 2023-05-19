<template>
	<div class="edit-image-tab-styles">
		<div v-if="showImageFitOptions">
			<ZyroLabel class="edit-image-tab-styles__image-fit-label">
				{{ $t('builder.editImage.tabImage.objectFit') }}
			</ZyroLabel>
			<ZyroRadioList
				:model-value="objectFit"
				:options="FIT_OPTIONS"
				@update:model-value="updateObjectFit"
			/>
		</div>
		<template v-if="isImageInLayoutBlock">
			<ZyroButton
				theme="plain"
				class="reset-aspect-ratio"
				@click="resetProportions"
			>
				{{ $t('builder.editImage.tabImage.resetProportions') }}
			</ZyroButton>
			<ZyroSeparator />
		</template>
		<ZyroFieldRange
			:model-value="borderRadius"
			min="1"
			max="100"
			:label="$t('common.cornerRadius')"
			units="%"
			@update:model-value="updateBorderRadius"
		/>
	</div>
</template>

<script>
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroFieldRange from '@/components/global/ZyroFieldRange.vue';
import ZyroLabel from '@/components/global/ZyroLabel.vue';
import ZyroRadioList from '@/components/global/ZyroRadioList.vue';
import ZyroSeparator from '@/components/global/ZyroSeparator.vue';

import {
	mapGetters,
	mapActions,
} from 'vuex';

import { useI18n } from 'vue-i18n';
import { useCurrentGridImage } from '@/use/useCurrentGridImage';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroButton,
		ZyroFieldRange,
		ZyroLabel,
		ZyroRadioList,
		ZyroSeparator,
	},

	setup() {
		const { resetProportions } = useCurrentGridImage();
		const { t } = useI18n();

		const FIT_OPTIONS = {
			contain: {
				name: t('builder.editImage.tabImage.fit'),
			},
			cover: {
				name: t('builder.editImage.tabImage.fill'),
			},
		};

		return {
			FIT_OPTIONS,
			resetProportions,
		};
	},

	computed: {
		...mapGetters('gui', ['isMobileMode']),
		...mapGetters([
			'currentElement',
			'currentElementStyles',
			'currentElementBlockType',
		]),
		objectFit() {
			return this.currentElementStyles['object-fit'] || 'cover';
		},
		borderRadius() {
			const currentBorderRadius = Number.parseInt(this.currentElementStyles['border-radius'], 10);

			return currentBorderRadius ? currentBorderRadius * 2 : 0;
		},
		isImageInLayoutBlock() {
			return this.currentElementBlockType === 'BlockLayout';
		},
		showImageFitOptions() {
			return !this.isMobileMode && !this.isImageInLayoutBlock;
		},
	},

	methods: {
		...mapActions(['mergeCurrentElementData']),
		updateObjectFit(newValue) {
			this.mergeCurrentElementData({
				elementData: {
					settings: {
						styles: {
							'object-fit': newValue,
						},
					},
				},
			});
		},
		updateBorderRadius(newValue) {
			this.mergeCurrentElementData({
				elementData: {
					settings: {
						styles: {
							'border-radius': `${newValue / 2}%`,
						},
					},
				},
			});
		},
	},
});
</script>

<style lang="scss" scoped>
.edit-image-tab-styles {
	&__image-fit-label {
		margin: 8px 0;
	}
}

.reset-aspect-ratio {
	margin-bottom: 16px;
}
</style>
