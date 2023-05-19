<template>
	<ZyroModal
		max-width="350px"
		max-height="640px"
		:title="$t('common.linkSettings')"
		class="add-link-modal"
		@close-modal="closeModal"
	>
		<ZyroFieldInput
			v-model="name"
			:label="$t('builder.pageSettingsModal.textFields.nameInNavigation.label')"
			input-data-qa="linksettingsmodal-input-name"
			:placeholder="$t('common.newLink')"
		/>
		<LinkSettings
			:target="target"
			:href="href"
			:rel="rel"
			:type="linkType"
			disable-internal-pages
			@update:href="href = $event"
			@update:rel="rel = $event"
			@update:target="target = $event"
			@update:type="linkType = $event"
		/>
		<ZyroFieldToggle
			id="addLinkModal-toggle"
			v-model="isItemHidden"
			v-qa="`linksettingsmodal-hidepage-toggle-${isItemHidden ? 'hidden' : 'visible'}`"
			:label="$t('common.hidePage')"
		/>
		<template #footer>
			<ZyroButton
				v-qa="'linksettingsmodal-btn-close'"
				@click="closeModal"
			>
				{{ $t('common.cancel') }}
			</ZyroButton>
			<ZyroButton
				v-qa="'linksettingsmodal-btn-submit'"
				theme="primary"
				@click="submitForm"
			>
				{{ $t('common.save') }}
			</ZyroButton>
		</template>
	</ZyroModal>
</template>

<script>
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroFieldInput from '@/components/global/ZyroFieldInput.vue';
import ZyroFieldToggle from '@/components/global/ZyroFieldToggle.vue';
import ZyroModal from '@/components/global/ZyroModal.vue';

import {
	mapState,
	mapActions,
	mapGetters,
} from 'vuex';

import { LINK_TYPE_EXTERNAL } from '@zyro-inc/site-modules/constants';

import LinkSettings from '@/components/builder-controls/edit-button/LinkSettings.vue';
import {
	mapActionsGui,
	CLOSE_MODAL,
} from '@/store/builder/gui';

import { defineComponent } from 'vue';

export default defineComponent({
	name: 'LinkSettingsModal',

	components: {
		ZyroButton,
		ZyroFieldInput,
		ZyroFieldToggle,
		ZyroModal,
		LinkSettings,
	},

	data() {
		return {
			name: this.$t('common.newLink'),
			href: null,
			target: null,
			rel: 'nofollow',
			linkType: LINK_TYPE_EXTERNAL,
			isItemHidden: false,
		};
	},

	computed: {
		...mapState('gui', ['activeModalSettings']),
		...mapGetters('navigation', ['getItemById']),
		itemId() {
			return this.activeModalSettings.itemId;
		},
	},

	mounted() {
		const {
			href,
			target,
			rel,
			isDownload,
			isHidden,
		} = this.getItemById(this.itemId);

		this.name = this.activeModalSettings.pageName;
		this.href = href;
		this.target = target;
		this.rel = rel;
		this.isDownload = isDownload;
		this.isItemHidden = isHidden;
	},

	methods: {
		...mapActions('navigation', [
			'setItemData',
			'changeItemVisibility',
		]),
		...mapActionsGui({
			closeModal: CLOSE_MODAL,
		}),
		submitForm() {
			if (this.getItemById(this.itemId).isHidden !== this.isItemHidden) {
				this.changeItemVisibility({
					itemId: this.itemId,
					isHidden: this.isItemHidden,
				});
			}

			this.setItemData({
				data: {
					navItemId: this.itemId,
					name: this.name || this.$t('common.newLink'),
					href: this.href,
					target: this.target,
					rel: this.rel,
					isDownload: this.linkType === 'download',
					isHidden: this.isItemHidden,
				},
			});

			this.closeModal();
		},
	},
});
</script>
