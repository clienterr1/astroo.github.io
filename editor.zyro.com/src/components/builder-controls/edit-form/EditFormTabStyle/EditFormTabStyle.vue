<template>
	<ZyroDropdown
		:model-value="selectedStyleOption"
		:options="styleOptions"
		class="styles-dropdown"
		:label="$t('builder.editForm.customizeElements')"
		@update:model-value="updateSelectedStyleOption"
	/>
	<EditFormButtonStyle v-if="selectedStyleOption.id === 'button'" />
	<EditFormFieldsStyle v-if="selectedStyleOption.id === 'formFields'" />
	<EditFormBackgroundStyle v-if="selectedStyleOption.id === 'background'" />
</template>

<script>

import ZyroDropdown from '@/components/global/ZyroDropdown.vue';

import EditFormButtonStyle from '@/components/builder-controls/edit-form/EditFormTabStyle/EditFormButtonStyle.vue';
import EditFormFieldsStyle from '@/components/builder-controls/edit-form/EditFormTabStyle/EditFormFieldsStyle.vue';
import EditFormBackgroundStyle from '@/components/builder-controls/edit-form/EditFormTabStyle/EditFormBackgroundStyle.vue';

import { useI18n } from 'vue-i18n';

import {
	defineComponent,
	ref,
} from 'vue';

export default defineComponent({
	components: {
		ZyroDropdown,
		EditFormButtonStyle,
		EditFormFieldsStyle,
		EditFormBackgroundStyle,
	},

	setup() {
		const { t } = useI18n();
		const styleOptions = [
			{
				id: 'button',
				title: t('common.submitButton'),
			},
			{
				id: 'formFields',
				title: t('common.formFields'),
			},
			{
				id: 'background',
				title: t('common.background'),
			},
		];
		const selectedStyleOption = ref(styleOptions[1]);
		const updateSelectedStyleOption = (option) => {
			selectedStyleOption.value = option;
		};

		return {
			selectedStyleOption,
			styleOptions,
			updateSelectedStyleOption,
		};
	},
});
</script>
<style lang="scss" scoped>
.styles-dropdown {
	z-index: 2;
}
</style>
