<template>
	<ZyroModal
		max-width="351px"
		max-height="640px"
		:title="$t('common.addNewLink')"
		class="add-link-modal"
		@close-modal="isCloseConfirmationShown = true"
	>
		<ZyroFieldInput
			v-model="content"
			input-data-qa="linksettingsmodal-input-name"
			:label="$t('builder.pageSettingsModal.textFields.nameInNavigation.label')"
			:placeholder="$t('common.newLink')"
		/>
		<LinkSettings
			:href="href"
			:target="target"
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
			v-model="isHidden"
			:label="$t('common.hidePage')"
		/>
		<template #footer>
			<ZyroButton @click="closeModal">
				{{ $t('common.cancel') }}
			</ZyroButton>
			<ZyroButton
				theme="primary"
				data-qa="addlinkmodal-btn-save"
				@click="submitForm"
			>
				{{ $t('common.save') }}
			</ZyroButton>
		</template>
		<UnsavedChangesModal
			v-if="isCloseConfirmationShown"
			:item-before-edit="itemBeforeEdit"
			:item-after-edit="itemAfterEdit"
			@discard="closeModal"
			@close-modal="isCloseConfirmationShown = false"
		/>
	</ZyroModal>
</template>

<script>
import {
	defineComponent,
	ref,
} from 'vue';
import { mapActions } from 'vuex';
import { useI18n } from 'vue-i18n';

import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroFieldInput from '@/components/global/ZyroFieldInput.vue';
import ZyroFieldToggle from '@/components/global/ZyroFieldToggle.vue';
import ZyroModal from '@/components/global/ZyroModal.vue';

import { LINK_TYPE_EXTERNAL } from '@zyro-inc/site-modules/constants';

import LinkSettings from '@/components/builder-controls/edit-button/LinkSettings.vue';
import UnsavedChangesModal from '@/components/builder-modals/modals/UnsavedChangesModal.vue';
import {
	mapActionsGui,
	CLOSE_MODAL,
} from '@/store/builder/gui';
import { NAVIGATION_TYPE_LINK } from '@/constants';

const INITIAL_TARGET = null;
const INITIAL_HREF = null;
const INITIAL_REL = 'nofollow';
const INITIAL_HIDDEN_VALUE = false;
const INITIAL_LINK_TYPE = LINK_TYPE_EXTERNAL;

export default defineComponent({
	name: 'AddLinkModal',

	components: {
		ZyroButton,
		ZyroFieldInput,
		ZyroFieldToggle,
		ZyroModal,
		LinkSettings,
		UnsavedChangesModal,
	},

	setup() {
		const { t } = useI18n();
		const initialName = t('common.newLink');

		const content = ref(initialName);
		const href = ref(INITIAL_HREF);
		const target = ref(INITIAL_TARGET);
		const rel = ref(INITIAL_REL);
		const linkType = ref(INITIAL_LINK_TYPE);
		const isHidden = ref(INITIAL_HIDDEN_VALUE);

		const itemBeforeEdit = {
			name: initialName,
			// TODO: needs mapper:
			url: INITIAL_HREF,
			target: INITIAL_TARGET,
			linkType: INITIAL_LINK_TYPE,
			rel: INITIAL_REL,
			isHidden: INITIAL_HIDDEN_VALUE,
		};

		return {
			itemBeforeEdit,
			content,
			href,
			target,
			rel,
			linkType,
			isHidden,
		};
	},

	data() {
		return {
			isCloseConfirmationShown: false,
		};
	},

	computed: {
		itemAfterEdit() {
			return {
				name: this.content || this.$t('common.newLink'),
				url: this.href,
				target: this.target,
				linkType: this.linkType,
				rel: this.rel,
				isHidden: this.isHidden,
			};
		},
	},

	methods: {
		...mapActionsGui({
			closeModal: CLOSE_MODAL,
		}),
		...mapActions('navigation', ['addItem']),
		submitForm() {
			if (this.itemAfterEdit.url) {
				this.addItem({
					item: {
						name: this.itemAfterEdit.name,
						href: this.itemAfterEdit.url,
						target: this.itemAfterEdit.target,
						isDownload: this.itemAfterEdit.linkType === 'download',
						rel: this.itemAfterEdit.rel,
						linkType: NAVIGATION_TYPE_LINK,
					},
					isHidden: this.itemAfterEdit.isHidden,
				});
			}

			this.closeModal();
		},
	},
});
</script>
<style lang="scss" scoped>
.add-link-modal {
	padding: 5vh 0;

	@media screen and (max-width: $media-mobile) {
		padding: 0;
	}
}
</style>
