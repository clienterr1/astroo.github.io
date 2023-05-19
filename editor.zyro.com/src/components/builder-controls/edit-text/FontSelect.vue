<template>
	<Popup
		v-if="isOpen"
		:target-ref="targetRef"
		:placement="placement"
		:offset="offset"
		:auto-update="autoUpdate"
		portal-selector="[data-portal='builder-preview']"
		@click-outside="$emit('click-outside')"
	>
		<div class="font-select-container">
			<div
				class="font-select"
				:[DATA_ATTRIBUTE_SELECTOR]="DATA_ATTRIBUTE_SELECTOR_FONT_SELECT"
				@scroll="lastHoveredFont = null"
			>
				<div class="font-select__group">
					<div class="font-select__title">
						{{ $t('common.inUse') }}:
					</div>
					<EditTextFontSelectItem
						v-for="font in fontsInUse"
						:key="`${font.family}-in-use`"
						:font-family="font.family"
						:font-weights="getFontFamilyWeights(font.family)"
						:is-open="isOpen && lastHoveredFont === `${font.family}-in-use`"
						@hovering-font-family="lastHoveredFont = `${font.family}-in-use`"
						@update-font="updateFont"
					/>
					<div class="font-select__description">
						{{ $t('builder.usedFontsCountDisclaimer') }}
					</div>
				</div>

				<div
					v-if="!isDemoMode"
					class="font-select__group"
				>
					<div class="font-select__title">
						{{ $t('common.myFonts') }}:
					</div>
					<EditTextFontSelectItem
						v-for="font in customFonts"
						:key="font.family"
						v-qa="`uploaded-${font.family}-font`"
						:font-family="font.family"
						:font-weights="[]"
						:file-type="font.fileType"
						:is-open="isOpen && lastHoveredFont === font.family"
						@hovering-font-family="lastHoveredFont = font.family"
						@update-font="updateFont"
					/>
					<div class="font-select__upload-button-container">
						<button
							v-qa="'fontupload-button'"
							class="font-select__upload-button z-body-small"
							@click="$refs.fileInput.click()"
							@mouseenter="lastHoveredFont = null"
						>
							<ZyroSvgDeprecated
								class="font-select__upload-button-icon"
								name="upload"
							/>
							{{ $t('common.upload') }}
						</button>
						<input
							v-show="false"
							ref="fileInput"
							type="file"
							data-qa="builder-input-image"
							accept=".woff, .woff2, .ttf, .otf"
							name="images"
							multiple
							@change="uploadFiles"
						>
					</div>
				</div>

				<div class="font-select__group">
					<div class="font-select__title">
						{{ $t('common.all') }}:
					</div>
					<EditTextFontSelectItem
						v-for="font in mostPopularGoogleFontsArray"
						:key="font.family"
						:font-family="font.family"
						:font-weights="font.variants"
						:is-open="isOpen && lastHoveredFont === font.family"
						@hovering-font-family="lastHoveredFont=font.family"
						@update-font="updateFont"
					/>
				</div>
			</div>
			<div
				v-if="uploadState"
				v-qa="'fontupload-progress-text'"
				class="upload-state"
				@mouseenter="lastHoveredFont = null"
			>
				<div
					v-if="uploadState.type === UPLOAD_STATE_LOADING"
					class="upload-state__message"
				>
					<ZyroLoader
						class="upload-state__indication"
						size="24px"
						weight="3px"
						color="var(--color-azure)"
					/>
					{{ uploadState.text }}
				</div>
				<div
					v-else-if="uploadState.type === UPLOAD_STATE_SUCCESS"
					class="upload-state__message"
				>
					<ZyroSvgDeprecated
						name="check-round-green-light"
						class="upload-state__indication success-color"
					/>
					{{ uploadState.text }}
				</div>
				<div
					v-else-if="uploadState.type === UPLOAD_STATE_ERROR"
					class="upload-state__message"
				>
					<ZyroSvgDeprecated
						name="alert-round-red"
						class="upload-state__indication error-color"
					/>
					<p class="error-color">
						{{ $t('common.uploadFailed') }}
					</p>
					{{ uploadState.text }}
				</div>
				<ZyroSvgDeprecated
					v-if="uploadState.showClose"
					class="upload-state__close"
					name="x"
					@click="uploadState = null"
				/>
			</div>
		</div>
	</Popup>
</template>

<script>
import Popup from '@/components/global/Popup.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import {
	mapState,
	mapGetters,
	mapActions,
} from 'vuex';

import { useTextEditor } from '@/use/text-editor/useTextEditor';
import { getFontsList } from '@zyro-inc/site-modules/utils/font';
import { uploadFontAsset } from '@/api/AssetsApi';

import mostPopularGoogleFonts from '@/assets/data/mostPopularGoogleFonts.json';

import ZyroLoader from '@zyro-inc/site-modules/components/ZyroLoader.vue';
import EditTextFontSelectItem from '@/components/builder-controls/edit-text/EditTextFontSelectItem.vue';
import {
	DATA_ATTRIBUTE_SELECTOR,
	DATA_ATTRIBUTE_SELECTOR_FONT_SELECT,
} from '@zyro-inc/site-modules/constants';
import { defineComponent } from 'vue';

const UPLOAD_STATE_LOADING = 'loading';
const UPLOAD_STATE_SUCCESS = 'success';
const UPLOAD_STATE_ERROR = 'error';

export default defineComponent({

	components: {
		Popup,
		ZyroSvgDeprecated,
		ZyroLoader,
		EditTextFontSelectItem,
	},

	props: {
		isOpen: {
			type: Boolean,
			required: true,
		},
		targetRef: {
			type: HTMLElement,
			default: null,
		},
		autoUpdate: {
			type: Boolean,
			default: false,
		},
		placement: {
			type: String,
			default: 'bottom-start',
		},
		offset: {
			type: Number,
			default: 4,
		},
	},
	emits: [
		'update',
		'close',
	],

	setup() {
		const { editor } = useTextEditor();
		const mostPopularGoogleFontsArray = mostPopularGoogleFonts.items;

		return {
			UPLOAD_STATE_LOADING,
			UPLOAD_STATE_SUCCESS,
			UPLOAD_STATE_ERROR,
			editor,
			mostPopularGoogleFontsArray,
			DATA_ATTRIBUTE_SELECTOR,
			DATA_ATTRIBUTE_SELECTOR_FONT_SELECT,
		};
	},

	data() {
		return {
			lastHoveredFont: null,
			uploadState: null,
		};
	},

	computed: {
		...mapState([
			'website',
			'websiteId',
			'currentElementId',
			'isDemoMode',
		]),
		...mapState('fonts', ['googleFonts']),
		...mapGetters('assets', ['customFonts']),
		...mapGetters([
			'siteElements',
			'headerBlock',
		]),
		fontsInUse() {
			const currentTextBoxHTML = this.editor?.getHTML();
			const restTextBoxesHTML = Object.keys(this.siteElements) // exclude current text box HTML as it might be outdated
				.filter((elementId) => elementId !== this.currentElementId)
				.map((elementId) => this.siteElements[elementId].content)
				.join();
			const allTextBoxesHTML = [
				currentTextBoxHTML,
				restTextBoxesHTML,
			].join();

			return getFontsList({
				siteData: this.website,
				html: allTextBoxesHTML,
				customFonts: this.customFonts,
				googleFonts: this.googleFonts,
			});
		},
	},

	watch: {
		isOpen(value) {
			if (!value) {
				this.lastHoveredFont = null;
			}
		},
	},

	methods: {
		...mapActions('assets', ['fetchAssets']),
		getFontFamilyWeights(fontFamily) {
			return this.mostPopularGoogleFontsArray.find(({ family }) => family === fontFamily)?.variants ?? [400];
		},
		updateFont({
			fontFamily,
			fontWeight,
			fileType,
		}) {
			this.$emit('update', {
				fontFamily,
				fontWeight,
				fileType,
			});
		},
		async uploadFiles(event) {
			const file = event.target.files[0];

			this.uploadState = {
				type: UPLOAD_STATE_LOADING,
				text: this.$t('builder.editText.uploadingFont', [file.name]),
			};

			try {
				const {
					status,
					data,
				} = await uploadFontAsset(file, this.websiteId);

				if (status === 200) {
					this.fetchAssets();
					this.uploadState = {
						type: UPLOAD_STATE_SUCCESS,
						text: this.$t('builder.editText.fontUploadedSuccessfully', [data.name.split('.')[0]]),
						showClose: true,
					};
				}
			} catch (error) {
				this.uploadState = {
					type: UPLOAD_STATE_ERROR,
					text: error?.response?.data?.message || '',
					showClose: true,
				};
			}
		},
	},
});
</script>

<style lang="scss" scoped>
.font-select-container {
	position: relative;
	overflow: hidden;
	border-radius: 5px;
	box-shadow: 0 6px 14px rgba(0, 0, 0, 10%);
}

.font-select {
	width: 208px;
	max-height: 432px;
	overflow-y: auto;
	background: $color-light;
	box-shadow: $box-shadow;

	&__group {
		padding-bottom: 10px;

		&:not(:last-child) {
			border-bottom: 1px solid $color-gray-light;
		}
	}

	&__title {
		padding: 16px 16px 8px;
		font-size: 11px;
		line-height: 1.27;
		color: $color-gray;
		text-transform: uppercase;
	}

	&__description {
		padding: 8px 16px 6px;
		font-size: 12px;
		line-height: 1.33;
		color: $color-gray;
	}

	&__upload-button-container {
		padding: 6px 16px;
	}

	&__upload-button-icon {
		margin-right: 4px;
		color: $color-azure;
	}

	&__upload-button {
		display: flex;
		align-items: center;
		color: $color-azure;
		border-radius: 3px;

		&:hover {
			cursor: pointer;
		}
	}
}

.upload-state {
	position: absolute;
	bottom: 0;
	left: 0;
	z-index: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	min-height: 134px;
	padding: 16px 24px;
	font-size: 12px;
	line-height: 1.33;
	color: $color-gray;
	background: $color-gray-light;
	border-top: 1px solid $color-gray-light;

	&__message {
		width: 100%;
		overflow: hidden;
		text-align: center;
		text-overflow: ellipsis;
	}

	&__indication {
		display: block;
		width: 24px;
		height: 24px;
		margin-right: auto;
		margin-bottom: 8px;
		margin-left: auto;
	}

	&__close {
		position: absolute;
		top: 12px;
		right: 12px;
		color: $color-gray;
		cursor: pointer;
	}
}

.success-color {
	color: $color-success;
}

.error-color {
	color: $color-primary;
}
</style>
