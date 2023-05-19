<template>
	<div>
		<ZyroFieldInput
			:model-value="currentElementContent"
			input-data-qa="linksettingsmodal-input-name"
			:label="$t('builder.editButton.tabActionLabel')"
			:placeholder="$t('builder.editButton.tabActionLabel')"
			@update:model-value="setElementProperty('content', $event)"
		/>
		<LinkSettings
			v-if="!hideLinkSettings"
			:target="currentElement.target"
			:href="currentElement.href"
			:rel="currentElement.rel"
			:type="currentElement.linkType"
			:page-id="currentElement.linkedPageId"
			@update:href="setElementProperty('href', $event)"
			@update:rel="setElementProperty('rel', $event)"
			@update:target="setElementProperty('target', $event)"
			@update:type="setElementProperty('linkType', $event)"
			@update:pageId="setElementProperty('linkedPageId', $event)"
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

import LinkSettings from '@/components/builder-controls/edit-button/LinkSettings.vue';

import { defineComponent } from 'vue';

const BUTTONS_TO_HIDE_LINK_SETTINGS = [
	'GridStripeButton',
	'GridEcommerceButton',
];

export default defineComponent({
	components: {
		ZyroFieldInput,
		LinkSettings,
	},

	data() {
		return {
			elementId: null,
		};
	},

	computed: {
		...mapState(['currentElementId']),
		...mapGetters([
			'currentElement',
			'currentElementContent',
			'currentElementType',
		]),
		hideLinkSettings() {
			return BUTTONS_TO_HIDE_LINK_SETTINGS.includes(this.currentElementType);
		},
	},

	// elementId here is needed because:
	// - mergeElementData uses currentElementId to set element data
	// - this component, before being destoryed, catches input blur event from LinkSettings to format href
	// - element id is unset too early and thus, data is not saved - currentElementId is undefined.
	// So, need to save the elementId explicitly.
	// We should fix this by either:
	// A. Rework how we unset current element - now it gets unset too early.
	//    Same happens in a lot of component where we need to save currentElementId
	// B. Rework EditButton components to have Save/Cancel buttons and save on those actions, instead of click outside.
	created() {
		this.elementId = this.currentElementId;
	},

	methods: {
		...mapActions(['mergeElementData']),
		setElementProperty(property, value) {
			this.mergeElementData({
				elementId: this.elementId,
				elementData: {
					[property]: value,
				},
			});
		},
	},
});
</script>
