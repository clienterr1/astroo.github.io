<template>
	<div>
		<ZyroCollapsible
			v-qa="`sitesettings-generalsettings-card-${qa}`"
			:is-open="isOpen"
			@toggle="isOpen = !isOpen"
		>
			<template #heading>
				{{ title }}
			</template>
			<template #tag>
				<ZyroStatus
					:status-done="isMetaImageUploaded"
					:text-done="isMetaImageUploaded ? $t('common.saved') : ''"
				/>
			</template>
			<template #content>
				<div class="meta-image">
					<div class="meta-image__upload">
						<ZyroLabel
							theme="secondary"
							:bold="false"
							:info-text="infoText"
						>
							{{ label }}
						</ZyroLabel>

						<ZyroImageSelector
							:origin="metaImageOrigin"
							:path="metaImagePath"
							@update="updateImageUrl"
						/>
					</div>
					<div class="meta-image__img-container">
						<ZyroLabel
							:bold="false"
							theme="secondary"
						>
							{{ $t('common.preview') }}
						</ZyroLabel>
						<slot
							name="preview"
							:src="metaImageUrl"
						/>
					</div>
				</div>
			</template>
			<template
				v-if="v$.metaImageUrl.$dirty"
				#footer
			>
				<div>
					<ZyroButton
						v-qa="`sitesettings-generalsettings-card-${qa}-btn-cancel`"
						theme="plain"
						class="meta-image__footer-button"
						@click="isConfirmationModalShown = true"
					>
						{{ $t('common.cancel') }}
					</ZyroButton>
					<ZyroButton
						v-qa="`sitesettings-generalsettings-card-${qa}-btn-save`"
						theme="primary"
						@click="saveChanges"
					>
						{{ $t('common.saveChanges') }}
					</ZyroButton>
				</div>
			</template>
		</ZyroCollapsible>
		<SiteSettingsModal
			v-if="isConfirmationModalShown"
			:title="$t('common.cancelChanges')"
			:right-button-text="$t('common.discard')"
			:left-button-text="$t('common.continueEditing')"
			@close="isConfirmationModalShown = false"
			@left-button-click="isConfirmationModalShown = false"
			@right-button-click="discardChanges"
		>
			{{ $t('siteSettings.common.unsavedChangesText') }}
		</SiteSettingsModal>
	</div>
</template>

<script>

import { mapState } from 'vuex';
import { defineComponent } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroImageSelector from '@/components/global/ZyroImageSelector.vue';
import ZyroLabel from '@/components/global/ZyroLabel.vue';

import { getImageSrc } from '@zyro-inc/site-modules/utils/getImageSrc';

import SiteSettingsModal from '@/components/site-settings/components/SiteSettingsModal.vue';
import ZyroCollapsible from '@/components/site-settings/components/ZyroCollapsible.vue';
import ZyroStatus from '@/components/site-settings/components/ZyroStatus.vue';

export default defineComponent({

	components: {
		ZyroButton,
		ZyroImageSelector,
		ZyroLabel,
		ZyroCollapsible,
		ZyroStatus,
		SiteSettingsModal,
	},

	props: {
		title: {
			type: String,
			default: null,
		},
		label: {
			type: String,
			default: null,
		},
		qa: {
			type: String,
			default: null,
		},
		isFooterVisible: {
			type: Boolean,
			default: true,
		},
		infoText: {
			type: String,
			default: null,
		},
		metaImageInitialImageOrigin: {
			type: String,
			default: null,
		},
		metaImageInitialImagePath: {
			type: String,
			default: null,
		},
	},

	emits: ['save'],

	setup: () => ({
		v$: useVuelidate(),
	}),

	data() {
		return {
			isConfirmationModalShown: false,
			isOpen: false,
			metaImagePath: '',
			metaImageOrigin: '',
			metaImageAlt: '',
		};
	},

	computed: {
		...mapState(['websiteId']),
		isMetaImageUploaded() {
			return !!this.metaImageUrl;
		},
		metaImageUrl() {
			return getImageSrc(this.metaImageOrigin, this.metaImagePath, this.websiteId);
		},
	},

	created() {
		this.setInitialMetaImage();
	},

	validations: {
		metaImageUrl: {},
	},

	methods: {
		setInitialMetaImage() {
			this.metaImageOrigin = this.metaImageInitialImageOrigin || '';
			this.metaImagePath = this.metaImageInitialImagePath || '';
		},
		updateImageUrl({
			origin,
			path,
			alt,
		}) {
			this.v$.metaImageUrl.$touch();
			this.metaImageOrigin = origin;
			this.metaImagePath = path;
			this.metaImageAlt = alt;
		},
		saveChanges() {
			this.$emit('save', {
				origin: this.metaImageOrigin,
				path: this.metaImagePath,
				alt: this.metaImageAlt,
			});
			this.v$.$reset();
		},
		discardChanges() {
			this.isConfirmationModalShown = false;
			this.setInitialMetaImage();
			this.v$.$reset();
		},
	},
});
</script>

<style lang="scss" scoped>
.meta-image {
	display: flex;
	align-items: flex-start;
	justify-content: flex-start;

	@media screen and (max-width: $media-mobile) {
		flex-direction: column;
	}

	&__upload {
		width: 50%;
		margin-right: 40px;

		@media screen and (max-width: $media-mobile) {
			width: 100%;
			margin: 0 0 32px;
		}
	}

	&__img-container {
		width: 50%;

		@media screen and (max-width: $media-mobile) {
			width: 100%;
		}
	}

	&__footer-button {
		margin-right: 32px;

		@media screen and (max-width: $media-mobile) {
			margin-right: 24px;
		}
	}
}
</style>
