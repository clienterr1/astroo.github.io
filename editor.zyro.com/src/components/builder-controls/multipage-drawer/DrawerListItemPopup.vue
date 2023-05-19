<template>
	<ZyroButton
		ref="settingsButtonRef"
		v-qa="`sitemenu-btn-settings-${item.name || item.id}`"
		class="popup__trigger"
		icon="settings"
		:title="$t('common.settings')"
		@click.stop="togglePopup"
	>
		<template #icon>
			<Icon
				name="settings"
				dimensions="16px"
			/>
		</template>
	</ZyroButton>
	<Popup
		v-if="isPopupOpen"
		placement="right-start"
		:target-ref="$refs.settingsButtonRef?.$el"
		@click-outside="handleClickOutside"
	>
		<Component
			:is="buttonSetComponent"
			:item="item"
			class="popup-content"
			:toggle="togglePopup"
			@open-page-settings-popup="$emit('open-page-settings-popup', $event)"
			@start-renaming="$emit('start-renaming')"
		/>
	</Popup>
</template>

<script>
import Icon from '@/components/global/Icon.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';
import Popup from '@/components/global/Popup.vue';

import FolderButtons from '@/components/builder-controls/multipage-drawer/popup-buttons/FolderButtons.vue';
import LinkButtons from '@/components/builder-controls/multipage-drawer/popup-buttons/LinkButtons.vue';
import PageButtons from '@/components/builder-controls/multipage-drawer/popup-buttons/PageButtons.vue';

import {
	NAVIGATION_TYPE_PAGE,
	NAVIGATION_TYPE_LINK,
	NAVIGATION_TYPE_FOLDER,
} from '@/constants';

import { defineComponent } from 'vue';

const POPUP_BUTTONS = {
	[NAVIGATION_TYPE_PAGE]: 'PageButtons',
	[NAVIGATION_TYPE_LINK]: 'LinkButtons',
	[NAVIGATION_TYPE_FOLDER]: 'FolderButtons',
};

export default defineComponent({
	components: {
		Icon,
		Popup,
		ZyroButton,
		PageButtons,
		LinkButtons,
		FolderButtons,
	},

	props: {
		item: {
			type: Object,
			required: true,
		},
	},

	emits: [
		'start-renaming',
		'open-page-settings-popup',
	],

	data() {
		return {
			isPopupOpen: false,
		};
	},

	computed: {
		buttonSetComponent() {
			return POPUP_BUTTONS[this.item.linkType];
		},
	},

	methods: {
		togglePopup() {
			this.isPopupOpen = !this.isPopupOpen;
		},
		handleClickOutside(event) {
			if (!event.target?.closest('[role="dialog"]')) {
				this.isPopupOpen = false;
			}
		},
	},
});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/components/Popup";
</style>
