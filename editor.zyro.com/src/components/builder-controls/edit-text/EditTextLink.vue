<template>
	<div>
		<EditTextButton
			ref="editLinkButton"
			:data-qa="'edittext-textlink-button'"
			:is-active="editor.isActive(TEXT_EDITOR_PROPERTY_LINK_MARK) || isLinkSettingsOpen"
			:tooltip-text="$t('common.link')"
			@click.stop="getLink(); isLinkSettingsOpen = !isLinkSettingsOpen;"
		>
			<ZyroSvgDeprecated name="link" />
		</EditTextButton>
		<Popup
			v-if="isLinkSettingsOpen"
			:target-ref="$refs.editLinkButton && $refs.editLinkButton.$el"
			auto-update
			placement="bottom-start"
			:offset="4"
			portal-selector="[data-portal='builder-preview']"
			@click-outside="clickOutsideHandler"
		>
			<ZyroPopupCard
				:title="$t('common.linkSettings')"
				:show-footer="true"
				max-width="360px"
				type="editor"
				@save="saveLink"
				@close="isLinkSettingsOpen = false"
			>
				<LinkSettings
					ref="linksettings"
					:target="target"
					:href="href"
					:rel="rel"
					:type="type"
					:page-id="pageId"
					@update:href="href = $event"
					@update:rel="rel = $event"
					@update:target="target = $event"
					@update:type="type = $event"
					@update:pageId="pageId = $event"
				/>
				<ZyroButton
					v-if="editor.isActive(TEXT_EDITOR_PROPERTY_LINK_MARK)"
					theme="plain"
					class="remove-link"
					@click.stop="removeLink(); isLinkSettingsOpen = false"
				>
					{{ $t('common.removeLink') }}
				</ZyroButton>
			</ZyroPopupCard>
		</Popup>
	</div>
</template>

<script>
import Popup from '@/components/global/Popup.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroPopupCard from '@/components/global/ZyroPopupCard.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import { mapState } from 'vuex';

import EditTextButton from '@/components/builder-controls/edit-text/EditTextButton.vue';

import { getPagePathFromId } from '@zyro-inc/site-modules/utils/page/getPagePathFromId';
import {
	LINK_TYPE_INTERNAL,
	LINK_TYPE_EXTERNAL,
	LINK_TYPE_DOWNLOAD,
} from '@zyro-inc/site-modules/constants';

import LinkSettings from '@/components/builder-controls/edit-button/LinkSettings.vue';
import {
	TEXT_EDITOR_PROPERTY_LINK_MARK,
	TEXT_EDITOR_DATA_ATTRIBUTE_LINKED_PAGE_ID,
} from '@/constants';
import { useTextEditor } from '@/use/text-editor/useTextEditor';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		Popup,
		ZyroButton,
		ZyroPopupCard,
		ZyroSvgDeprecated,
		EditTextButton,
		LinkSettings,
	},

	setup() {
		const { editor } = useTextEditor();

		return {
			editor,
			TEXT_EDITOR_PROPERTY_LINK_MARK,
		};
	},

	data() {
		return {
			isLinkSettingsOpen: false,
			href: null,
			target: null,
			rel: null,
			type: LINK_TYPE_EXTERNAL,
			pageId: null,
		};
	},

	computed: {
		...mapState([
			'website',
			'currentLocale',
		]),
	},

	methods: {
		saveLink() {
			if (this.editor.view.state.selection.empty) {
				this.editor.commands.selectParentNode();
			}

			const href = this.type === LINK_TYPE_INTERNAL
				? getPagePathFromId({
					siteData: this.website,
					pageId: this.pageId,
					locale: this.currentLocale,
				})
				: this.href;

			this.editor.chain()
				.focus()
				.extendMarkRange('link')
				.setLink({
					href,
					target: this.target ? this.target : '',
					rel: this.rel,
					download: this.type === LINK_TYPE_DOWNLOAD || null,
					style: 'text-decoration: none;',
					[TEXT_EDITOR_DATA_ATTRIBUTE_LINKED_PAGE_ID]: this.pageId,
				})
				.setUnderline()
				.run();

			this.type = LINK_TYPE_EXTERNAL;
			this.isLinkSettingsOpen = false;
		},
		getLink() {
			const linkAttributes = this.editor.getAttributes(TEXT_EDITOR_PROPERTY_LINK_MARK);

			const {
				href,
				target,
				rel,
				download,
			} = linkAttributes;

			this.target = target;
			this.href = href;
			this.rel = rel;
			this.pageId = linkAttributes['data-page-id'];

			if (this.pageId) {
				this.type = LINK_TYPE_INTERNAL;
			}

			if (download) {
				this.type = LINK_TYPE_DOWNLOAD;
			}
		},
		removeLink() {
			this.editor.chain()
				.focus()
				.extendMarkRange('link')
				.unsetLink()
				.unsetUnderline()
				.run();
		},
		clickOutsideHandler(event) {
			if (!event.target?.closest('[role="dialog"]')) {
				this.isLinkSettingsOpen = false;
			}
		},
	},
});
</script>

<style lang="scss" scoped>
.remove-link {
	margin-top: 16px;
	color: $color-primary;
}
</style>
