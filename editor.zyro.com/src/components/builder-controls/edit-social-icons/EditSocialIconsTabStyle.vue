<template>
	<div class="icon">
		<ZyroSegmentControl
			:controls="socialIconStates"
			:active-control="currentSocialIconState"
			@update:active-control="updateCurrentSocialIconState"
		/>

		<div v-if="!isHoverState">
			<ZyroFieldRange
				:model-value="iconSize"
				type="number"
				min="10"
				step="1"
				max="100"
				data-qa="edit-social-icons-popup-icons-rangefield-size"
				:label="$t('builder.editSocialIcons.tabIcon.size')"
				@update:model-value="handleIconSizeInput"
			/>
			<ZyroSeparator />
		</div>
		<ZyroFieldColorPicker
			v-qa="'edit-social-icons-popup-icons-colorfield'"
			:is-open="isColorPickerOpen"
			:model-value="iconColor"
			:label="$t('builder.editSocialIcons.tabIcon.color')"
			class="icon__color"
			@toggle="isColorPickerOpen = !isColorPickerOpen"
			@click-outside="isColorPickerOpen = false"
			@update:model-value="updateIconColor"
		/>
	</div>
</template>

<script>
import ZyroFieldColorPicker from '@/components/global/ZyroFieldColorPicker.vue';
import ZyroSegmentControl from '@/components/global/ZyroSegmentControl.vue';
import ZyroFieldRange from '@/components/global/ZyroFieldRange.vue';
import ZyroSeparator from '@/components/global/ZyroSeparator.vue';

import {
	useStore,
	mapGetters,
	mapActions,
} from 'vuex';

import { useElementContrast } from '@/use/useElementContrast';
import { useDeviceElementHeight } from '@/use/useDeviceElementHeight';
import { lightenDarkenColor } from '@/utils/lightenDarkenColor';

import {
	defineComponent,
	computed,
	ref,
} from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
	components: {
		ZyroFieldColorPicker,
		ZyroFieldRange,
		ZyroSegmentControl,
		ZyroSeparator,
	},

	setup() {
		const { getters } = useStore();
		const currentElementId = computed(() => getters.currentElementId);
		const { updateElementHeightOnDevices } = useDeviceElementHeight();
		const { getLighterColorShade } = useElementContrast();
		const { t } = useI18n();

		const socialIconStates = [
			{
				id: 'normal',
				title: t('builder.editButton.customButtonStyles.normal'),
			},
			{
				id: 'hover',
				title: t('builder.editButton.customButtonStyles.hover'),
			},
		];
		const currentSocialIconState = ref(socialIconStates[0]);
		const isHoverState = computed(() => currentSocialIconState.value.id === 'hover');
		const updateCurrentSocialIconState = (state) => {
			currentSocialIconState.value = state;
		};

		return {
			currentElementId,
			updateElementHeightOnDevices,
			getLighterColorShade,
			socialIconStates,
			currentSocialIconState,
			isHoverState,
			updateCurrentSocialIconState,
		};
	},

	data() {
		return {
			isColorPickerOpen: false,
		};
	},

	computed: {
		...mapGetters(['currentElementStyles']),
		iconSize() {
			return Number.parseInt(this.currentElementStyles['icon-size'], 10);
		},
		iconColor() {
			return this.isHoverState ? this.currentElementStyles['icon-color-hover'] : this.currentElementStyles['icon-color'];
		},

	},

	methods: {
		...mapActions(['mergeCurrentElementData']),
		lightenDarkenColor,
		updateIconColor(value) {
			this.mergeCurrentElementData({
				elementData: {
					settings: {
						styles: {
							[`${this.isHoverState ? 'icon-color-hover' : 'icon-color'}`]: value,
						},
					},
				},
			});
		},
		handleIconSizeInput(newValue) {
			this.mergeCurrentElementData({
				elementData: {
					settings: {
						styles: {
							'icon-size': `${newValue}px`,
						},
					},
				},
			});

			this.updateElementHeightOnDevices({
				elementId: this.currentElementId,
			});
		},
	},
});
</script>

<style lang="scss" scoped>
.icon {
	&__color {
		padding: 8px 0;
		margin-top: 8px;
	}
}
</style>
