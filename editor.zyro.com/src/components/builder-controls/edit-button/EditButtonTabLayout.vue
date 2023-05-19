<template>
	<div class="layout">
		<ZyroLabel class="layout__alignment-label">
			{{ $t('builder.editButton.tabLayoutLabel') }}
		</ZyroLabel>

		<div class="layout__alignment">
			<ZyroIconControls
				:model-value="align"
				:icons="$options.ICONS_ALIGN"
				@update:model-value="updateAlign"
			/>
			<ZyroIconControls
				:model-value="justify"
				:icons="$options.ICONS_JUSTIFY"
				:toggleable="false"
				@update:model-value="updateJustify"
			/>
		</div>
	</div>
</template>

<script>
import ZyroIconControls from '@/components/global/ZyroIconControls.vue';
import ZyroLabel from '@/components/global/ZyroLabel.vue';

import {
	mapGetters,
	mapActions,
} from 'vuex';

import { defineComponent } from 'vue';

const ICONS_ALIGN = [
	{
		value: 'flex-start',
		icon: 'align-left',
	},
	{
		value: 'center',
		icon: 'align-center',
	},
	{
		value: 'flex-end',
		icon: 'align-right',
	},
];

const ICONS_JUSTIFY = [
	{
		value: 'flex-start',
		icon: 'align',
		direction: 'up',
	},
	{
		value: 'center',
		icon: 'align-middle',
	},
	{
		value: 'flex-end',
		icon: 'align',
		direction: 'down',
	},
];

export default defineComponent({
	components: {
		ZyroIconControls,
		ZyroLabel,
	},

	ICONS_ALIGN,
	ICONS_JUSTIFY,

	computed: {
		...mapGetters(['currentElementStyles']),
		align() {
			return this.currentElementStyles.align;
		},
		justify() {
			return this.currentElementStyles.justify;
		},
	},

	methods: {
		...mapActions(['mergeCurrentElementData']),

		updateAlign(newValue) {
			this.mergeCurrentElementData({
				elementData: {
					settings: {
						styles: {
							align: newValue,
						},
					},
				},
			});
		},
		updateJustify(newValue) {
			this.mergeCurrentElementData({
				elementData: {
					settings: {
						styles: {
							justify: newValue,
						},
					},
				},
			});
		},
	},
});
</script>

<style lang="scss" scoped>
.layout {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: flex-start;

	&__alignment {
		display: flex;

		> *:not(:last-child) {
			margin-right: 24px;
		}

		&-label {
			margin-top: 16px;
		}
	}
}
</style>
