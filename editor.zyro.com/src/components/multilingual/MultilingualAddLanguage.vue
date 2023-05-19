<template>
	<div
		class="add-language"
		:class="{ 'add-language__disabled': !languageList.length }"
	>
		<div class="add-language__container">
			<div
				v-qa="'multilingual-button-select-language'"
				class="add-language__trigger z-body-small"
				tabindex="0"
				@click="isOpen = !isOpen"
			>
				<ZyroSvgDeprecated
					name="plus-circle"
					class="add-language__icon"
				/>
				<span class="add-language__drawer">
					{{ addLabel }}
				</span>
			</div>

			<MultilingualList
				v-if="isOpen"
				ref="multilingualListRef"
				class="add-language__list"
				:languages="languageList"
				@language-click="handleLanguageClick"
			/>

			<Teleport
				v-if="isDuplicateDialogShown"
				to="body"
			>
				<SystemDialogModal
					:title="$t('builder.multilingualDrawerDuplicateModalTitle', [selectedLanguage.name])"
					:primary-button-text="$t('common.cancel')"
					:secondary-button-text="$t('builder.multilingualDrawerAddLanguage')"
					primary-button-theme="outline"
					width="400px"
					@click-primary="handleDuplicateDialogClose"
					@click-secondary="handleDuplicateDialogConfirm"
					@close="handleDuplicateDialogClose"
				>
					<i18n-t
						tag="p"
						class="z-body"
						keypath="builder.multilingualDrawerDuplicateModalText"
					>
						<span class="z-body z-body--strong">
							{{ $t("builder.multilingualDrawerDuplicateModalTextSlot") }}
						</span>
					</i18n-t>
				</SystemDialogModal>
			</Teleport>
		</div>
	</div>
</template>

<script>
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import {
	mapGetters,
	mapActions,
} from 'vuex';

import SystemDialogModal from '@/components/builder-modals/modals/SystemDialogModal.vue';

import MultilingualList from '@/components/multilingual/MultilingualList.vue';
import { MULTILINGUAL_SUPPORTED_LANGUAGES } from '@/data';
import { onClickOutside } from '@vueuse/core';
import {
	defineComponent,
	ref,
} from 'vue';

export default defineComponent({
	components: {
		ZyroSvgDeprecated,
		MultilingualList,
		SystemDialogModal,
	},

	setup() {
		const isOpen = ref(false);
		const isDuplicateDialogShown = ref(false);
		const selectedLanguage = ref({});
		const multilingualListRef = ref(null);

		onClickOutside(multilingualListRef, () => {
			isOpen.value = false;
		});

		return {
			isOpen,
			isDuplicateDialogShown,
			selectedLanguage,
			multilingualListRef,
		};
	},

	computed: {
		...mapGetters([
			'siteLanguagesArray',
			'hasLanguages',
		]),
		addLabel() {
			return this.hasLanguages
				? this.$t('builder.multilingualDrawerAddLanguage')
				: this.$t('builder.multilingualDrawerSetStartingLang');
		},
		languageList() {
			const currentLocales = this.siteLanguagesArray.map(({ locale }) => locale);

			return MULTILINGUAL_SUPPORTED_LANGUAGES
				.filter(({ locale }) => !currentLocales.includes(locale))
				.map((language) => ({
					...language,
					country: null,
				}));
		},
	},

	methods: {
		...mapActions(['addLanguage']),
		handleLanguageClick(language) {
			this.selectedLanguage = language;

			if (this.hasLanguages) {
				if (this.siteLanguagesArray.length === 1) {
					this.isDuplicateDialogShown = true;
				} else {
					this.addLanguage(language);
				}
			} else {
				this.addLanguage(language);
			}

			this.isOpen = false;
		},
		handleDuplicateDialogClose() {
			this.isDuplicateDialogShown = false;
		},
		handleDuplicateDialogConfirm() {
			this.addLanguage(this.selectedLanguage);
			this.isDuplicateDialogShown = false;
		},
	},
});
</script>
<style lang="scss" scoped>
.add-language {
	$this: &;

	&__container {
		position: relative;
	}

	&__trigger {
		display: flex;
		align-items: center;
		padding: 16px 24px;
		cursor: pointer;
		border-bottom: 1px solid $color-gray-light;
		transition: opacity 150ms ease-in-out;
	}

	&__icon {
		margin-right: 10px;
	}

	&__list {
		position: absolute;
		top: 100%;
		left: 0;
		width: 100%;
		background-color: $color-light;
		box-shadow: 0 6px 14px rgb(0 0 0 / 10%);
	}

	&__disabled {
		color: $color-gray;
		pointer-events: none;
	}

	&:hover {
		#{$this}__trigger {
			opacity: 0.8;
		}
	}
}
</style>
