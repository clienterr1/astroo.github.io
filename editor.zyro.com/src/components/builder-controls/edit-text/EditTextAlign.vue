<template>
	<div>
		<EditTextButton
			ref="editTextButton"
			:is-active="isTextAlignOptionsOpen"
			:tooltip-text="$t('builder.editText.textAlignment')"
			@click="isTextAlignOptionsOpen = !isTextAlignOptionsOpen"
		>
			<ZyroSvgDeprecated :name="iconName" />
		</EditTextButton>
		<Popup
			v-if="isTextAlignOptionsOpen"
			:target-ref="$refs.editTextButton && $refs.editTextButton.$el"
			placement="bottom"
			portal-selector="[data-portal='builder-preview']"
			:offset="4"
			auto-update
			@click-outside="isTextAlignOptionsOpen = false"
		>
			<EditTextIconControls
				:icons="ALIGN_VALUES"
				:model-value="align"
				@update:model-value="updateAlign"
			/>
		</Popup>
	</div>
</template>

<script setup>
import Popup from '@/components/global/Popup.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import { useStore } from 'vuex';

import EditTextButton from '@/components/builder-controls/edit-text/EditTextButton.vue';
import EditTextIconControls from '@/components/builder-controls/edit-text/EditTextIconControls.vue';

import {
	computed,
	ref,
} from 'vue';

const ALIGN_VALUES = [
	{
		translationPath: 'builder.editText.leftAlign',
		value: 'left',
		icon: 'align-left',
	},
	{
		translationPath: 'builder.editText.centerAlign',
		value: 'center',
		icon: 'align-center',
	},
	{
		translationPath: 'builder.editText.rightAlign',
		value: 'right',
		icon: 'align-right',
	},
	{
		translationPath: 'builder.editText.justifiedAlign',
		value: 'justify',
		icon: 'align-justify',
	},
];

const {
	dispatch,
	getters,
} = useStore();

const isTextAlignOptionsOpen = ref(false);
const deviceTextAlignProperty = computed(() => (getters['gui/isMobileMode'] ? 'm-text' : 'text'));

const align = computed(() => {
	if (getters['gui/isMobileMode'] && !getters.currentElementStyles[deviceTextAlignProperty.value]) {
		return getters.currentElementStyles.text;
	}

	return getters.currentElementStyles[deviceTextAlignProperty.value];
});

const iconName = computed(() => ALIGN_VALUES.find((item) => item.value === align.value)?.icon || ALIGN_VALUES[0].icon);

const updateAlign = (newValue) => {
	dispatch('mergeCurrentElementData', ({
		elementData: {
			settings: {
				styles: {
					[deviceTextAlignProperty.value]: newValue,
				},
			},
		},
	}));
};

</script>
