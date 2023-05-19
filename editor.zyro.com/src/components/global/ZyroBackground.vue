<template>
	<div
		v-if="!!modelValue.current"
		class="zyro-background-selector"
	>
		<ZyroSegmentControl
			class="zyro-background-selector__tabs"
			:controls="tabs"
			:is-background-dark="isSegmentControlBackgroundDark"
			:active-control="currentTab"
			@update:active-control="changeTab"
		/>
		<ZyroFieldColorPicker
			v-if="currentTab.id === 'color'"
			:is-open="isColorPickerOpen"
			:label="$t('builder.sectionColor')"
			:model-value="modelValue.color"
			placement="left"
			portal-selector="[data-portal='app']"
			@update:model-value="handleBackgroundColorInput"
			@toggle="isColorPickerOpen = !isColorPickerOpen"
			@click-outside="isColorPickerOpen = false"
		/>
		<ZyroImageSelector
			v-if="currentTab.id === 'image'"
			:origin="modelValue.origin"
			:path="modelValue.path"
			:object-fit="objectFit"
			@update="handleBackgroundImageInput"
		/>

		<template v-if="isBackgroundImage">
			<ZyroLabel class="background-overlay-label">
				{{ $t('builder.editBlockTabBackground.overlayOpacity') }}
			</ZyroLabel>
			<ZyroRange
				v-qa="`backgroundsettings-overlayopacity-${overlayOpacity}`"
				:model-value="overlayOpacity"
				units="%"
				min="0"
				step="1"
				max="100"
				@update:model-value="updateOverlayOpacity"
			/>
		</template>
	</div>
</template>

<script>
import ZyroLabel from '@/components/global/ZyroLabel.vue';
import ZyroRange from '@/components/global/ZyroRange.vue';
import ZyroFieldColorPicker from '@/components/global/ZyroFieldColorPicker.vue';
import ZyroImageSelector from '@/components/global/ZyroImageSelector.vue';
import ZyroSegmentControl from '@/components/global/ZyroSegmentControl.vue';
import { useGamification } from '@/use/useGamification';
import cloneDeep from 'lodash.clonedeep';
import { mapState } from 'vuex';
import { GAMIFICATION_TASK_UPDATE_IMAGE } from '@/constants';
import { getImageSrc } from '@zyro-inc/site-modules/utils/getImageSrc';

import { defineComponent } from 'vue';

export default defineComponent({

	components: {
		ZyroLabel,
		ZyroImageSelector,
		ZyroFieldColorPicker,
		ZyroRange,
		ZyroSegmentControl,
	},

	props: {
		modelValue: {
			type: Object,
			required: true,
		},
		objectFit: {
			type: String,
			default: 'contain',
		},
		isSegmentControlBackgroundDark: {
			type: Boolean,
			default: false,
		},
	},

	emits: ['update:model-value'],

	setup() {
		const { completeAchievement } = useGamification();

		return {
			completeAchievement,
		};
	},

	data() {
		return {
			currentTab: null,
			backgroundObjectLocal: {},
			isColorPickerOpen: false,
		};
	},

	computed: {
		...mapState(['websiteId']),
		tabs() {
			return [
				{
					title: this.$t('common.color'),
					id: 'color',
				},
				{
					title: this.$t('common.image'),
					id: 'image',
				},
			];
		},
		isBackgroundImage() {
			return this.backgroundObjectLocal.current === 'image';
		},
		currentBackgroundValue() {
			if (!this.modelValue.path) {
				return '';
			}

			return getImageSrc(this.modelValue.origin, this.modelValue.path, this.websiteId);
		},
		overlayOpacity() {
			return Math.round((Number.parseFloat(this.backgroundObjectLocal['overlay-opacity'], 10) || 0) * 100);
		},
	},

	beforeMount() {
		if (!this.modelValue.current) {
			return;
		}

		this.backgroundObjectLocal = cloneDeep(this.modelValue);
		this.currentTab = this.tabs
			.find((tab) => tab.id === this.backgroundObjectLocal.current);

		if (!this.currentTab) {
			this.backgroundObjectLocal = {
				current: 'color',
				image: '',
				color: '',
			};
			[this.currentTab] = this.tabs;
			this.updateBackground();
		}
	},

	methods: {
		updateOverlayOpacity(newValue) {
			this.backgroundObjectLocal = {
				...this.backgroundObjectLocal,
				'overlay-opacity': `${(newValue / 100).toFixed(2)}`,
			};
			this.updateBackground();
		},
		updateBackground() {
			this.$emit('update:model-value', this.backgroundObjectLocal);
		},
		handleBackgroundColorInput(value) {
			this.backgroundObjectLocal = {
				color: value,
				current: 'color',
				image: null,
				path: null,
				origin: null,
			};
			this.updateBackground();
		},
		handleBackgroundImageInput(value) {
			this.backgroundObjectLocal = {
				image: value.url,
				origin: value.origin,
				path: value.path,
				current: 'image',
				color: null,
			};
			this.updateBackground();

			this.completeAchievement(GAMIFICATION_TASK_UPDATE_IMAGE);
		},
		changeTab(value) {
			this.currentTab = value;
			this.backgroundObjectLocal.current = value.id;
			this.updateBackground();
		},
	},
});
</script>
<style lang="scss" scoped>
.zyro-background-selector {
	width: 100%;

	&__tabs {
		margin-bottom: 16px;
	}

	&__wrapper {
		display: flex;
	}
}

.background-overlay-label,
.background-overlay-separator {
	margin: 16px 0 8px;
}
</style>
