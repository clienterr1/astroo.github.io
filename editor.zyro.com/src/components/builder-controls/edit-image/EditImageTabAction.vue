<template>
	<div>
		<ZyroDropdown
			:options="imageClickActions"
			:model-value="currentImageClickAction"
			:label="$t('builder.onClick')"
			:message="$t('builder.onClickDescription')"
			button-size="large"
			@update:model-value="setImageClickAction"
		/>
		<LinkSettings
			v-if="currentImageClickAction.value === IMAGE_CLICK_ACTION_LINK"
			:label="$t('builder.editButton.tabActionLabel')"
			:target="currentElement.target"
			:href="currentElement.href"
			:rel="currentElement.rel"
			:type="currentElement.linkType"
			:page-id="currentElement.linkedPageId"
			@update:href="setElementProperty('href', $event)"
			@update:pageId="setElementProperty('linkedPageId', $event)"
			@update:rel="setElementProperty('rel', $event)"
			@update:target="setElementProperty('target', $event)"
			@update:type="setElementProperty('linkType', $event)"
		/>
	</div>
</template>

<script>
import ZyroDropdown from '@/components/global/ZyroDropdown.vue';

import { useStore } from 'vuex';

import {
	IMAGE_CLICK_ACTION_NONE,
	IMAGE_CLICK_ACTION_LIGHTBOX,
	IMAGE_CLICK_ACTION_LINK,
	TARGET_SELF,
} from '@zyro-inc/site-modules/constants';

import LinkSettings from '@/components/builder-controls/edit-button/LinkSettings.vue';

import {
	defineComponent,
	computed,
	ref,
	onBeforeUnmount,
} from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
	components: {
		ZyroDropdown,
		LinkSettings,
	},

	setup() {
		const { t } = useI18n();
		const {
			getters,
			dispatch,
		} = useStore();
		const imageClickActions = [
			{
				title: t('builder.imageClickAction.action.none'),
				value: IMAGE_CLICK_ACTION_NONE,
			},
			{
				title: t('builder.imageClickAction.action.lightbox'),
				value: IMAGE_CLICK_ACTION_LIGHTBOX,
			},
			{
				title: t('builder.imageClickAction.action.link'),
				value: IMAGE_CLICK_ACTION_LINK,
			},
		];

		const currentElementSettings = computed(() => getters.currentElementSettings);
		const currentElement = computed(() => getters.currentElement);
		const currentElementId = computed(() => getters.currentElementId);
		const currentImageClickAction = computed(() => {
			const currentElementClickAction = imageClickActions
				.find((action) => {
					if (currentElementSettings.value) {
						return action.value === currentElementSettings.value.clickAction;
					}

					return false;
				});

			return currentElementClickAction || imageClickActions[0];
		});

		// elementId here is needed because:
		// - mergeElementData users currentElementId to set element data
		// - this component, before being destoryed, catches input blur event from LinkSettings to format href
		// - element id is unset too early and thus, data is not saved - currentElementId is undefined.
		// So, need to save the elementId explicitly.
		// We should fix this by either:
		// A. Rework how we unset current element - now it gets unset too early.
		//    Same happens in a lot of component where we need to save currentElementId
		// B. Rework EditButton components to have Save/Cancel buttons and save on those actions, instead of click outside.
		// created() {
		const elementId = ref(currentElementId.value);
		const imageClickAction = ref(currentImageClickAction.value);

		const setImageClickAction = (action) => {
			imageClickAction.value = action.value;
			dispatch('mergeElementData', {
				elementId: elementId.value,
				elementData: {
					settings: {
						clickAction: action.value,
					},
				},
			});
		};

		const setElementProperty = (property, value) => {
			dispatch('mergeElementData', {
				elementId: elementId.value,
				elementData: {
					[property]: value,
				},
			});
		};

		onBeforeUnmount(() => {
			if (imageClickAction.value !== IMAGE_CLICK_ACTION_LINK) {
				dispatch('mergeElementData', {
					elementId: elementId.value,
					elementData: {
						settings: {
							href: '',
							target: TARGET_SELF,
							rel: '',
						},
					},
				});
			}
		});

		return {
			IMAGE_CLICK_ACTION_LINK,
			imageClickActions,
			imageClickAction,
			currentImageClickAction,
			currentElement,
			setImageClickAction,
			setElementProperty,

		};
	},
});
</script>
