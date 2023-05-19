<template>
	<div class="link-settings-file-download">
		<div
			v-if="href"
			class="link-settings-file-download__selected-file"
		>
			<ZyroSvgDeprecated
				name="document"
				class="link-settings-file-download__selected-file-document-icon"
			/>

			<p class="link-settings-file-download__selected-file-name z-body-small">
				{{ getAssetNameFromUrl(href, true) }}
			</p>

			<ZyroButton
				class="link-settings-file-download__selected-file-x-icon"
				@click="clearLink"
			>
				<template #icon>
					<Icon
						name="close"
						dimensions="20px"
					/>
				</template>
			</ZyroButton>
		</div>

		<EmptyPagesBlock
			v-else
			class="link-settings-file-download__empty-pages-block"
			:subtitle="$t('builder.linkSettingsNoFileSelected')"
		/>

		<div class="link-settings-file-download__select-file-container">
			<ZyroButton
				v-qa="'button-select-file'"
				theme="primary"
				class="link-settings-file-download__select-file"
				@click="openAssetManager"
			>
				{{ selectDocumentButtonText }}
			</ZyroButton>
		</div>

		<Teleport
			v-if="isAssetManagerOpen"
			to="body"
		>
			<AssetManager
				:visible-categories="[ASSETS_CATEGORY_DOCUMENT, ASSETS_CATEGORY_IMAGE]"
				@update-target="$emit('update:target', '_blank')"
				@select-image="selectImage"
				@close="closeAssetManager"
			/>
		</Teleport>
	</div>
</template>

<script>
import Icon from '@/components/global/Icon.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import EmptyPagesBlock from '@/components/builder-controls/multipage-drawer/EmptyPagesBlock.vue';
import AssetManager from '@/components/builder-modals/modals/AssetManager.vue';
import {
	ASSETS_CATEGORY_DOCUMENT,
	ASSETS_CATEGORY_IMAGE,
} from '@/constants';
import { getAssetNameFromUrl } from '@/use/useAssets';

import { defineComponent } from 'vue';

export default defineComponent({

	components: {
		Icon,
		ZyroButton,
		ZyroSvgDeprecated,
		EmptyPagesBlock,
		AssetManager,
	},

	props: {
		href: {
			type: String,
			default: null,
		},
	},

	emits: ['update:href'],

	setup() {
		return {
			getAssetNameFromUrl,
			ASSETS_CATEGORY_IMAGE,
			ASSETS_CATEGORY_DOCUMENT,
		};
	},

	data() {
		return {
			isAssetManagerOpen: false,
		};
	},

	computed: {
		selectDocumentButtonText() {
			return this.href ? this.$t('builder.linkSettingsChangeFile') : this.$t('builder.linkSettingsSelectFile');
		},
	},

	methods: {
		openAssetManager() {
			this.isAssetManagerOpen = true;
		},
		closeAssetManager() {
			this.isAssetManagerOpen = false;
		},
		selectImage(event) {
			this.$emit('update:href', event.url);
			this.closeAssetManager();
		},
		clearLink() {
			this.$emit('update:href', null);
			this.$emit('update:target', null);
		},
	},
});
</script>

<style lang="scss" scoped>
.link-settings-file-download {
	&__selected-file {
		display: flex;
		align-items: center;
		padding: 16px 3px 16px 16px;
		border-bottom: 1px solid $color-gray-light;
	}

	&__selected-file-document-icon {
		flex-shrink: 0;
		margin-right: 18px;
	}

	&__selected-file-name {
		flex-grow: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: pre;
	}

	&__empty-pages-block {
		margin-right: 0;
		margin-left: 0;
	}

	&__selected-file-x-icon {
		flex-shrink: 0;
	}

	&__select-file-container {
		display: flex;
		justify-content: center;
	}

	&__select-file {
		margin-top: 16px;
	}
}
</style>
