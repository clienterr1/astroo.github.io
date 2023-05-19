<template>
	<div class="popup__list">
		<ZyroButton
			v-if="!isDefaultLanguage"
			v-qa="'multilingual-button-make-default'"
			class="popup__button z-body-small"
			icon-left="star-icon"
			@click="updateDefaultLocale(item.locale)"
		>
			{{ $t('builder.multilingualDrawerMakeDefault') }}
		</ZyroButton>
		<ZyroButton
			v-if="!isDefaultLanguage"
			v-qa="isLanguageHidden ? 'multilingual-button-show':'multilingual-button-hide'"
			class="popup__button z-body-small"
			@click="updateLanguageVisibility({
				locale: item.locale,
				isHidden: !isLanguageHidden
			})"
		>
			<template #icon-left>
				<Icon
					:name="isLanguageHidden ? 'visibility' : 'visibility_off'"
					dimensions="16px"
				/>
			</template>
			{{ isLanguageHidden ? $t('common.show') : $t('common.hide') }}
		</ZyroButton>
		<ZyroButton
			v-if="isDeleteButtonVisible"
			v-qa="'multilingual-button-remove'"
			class="popup__button z-body-small popup__button--remove"
			@click="isDeleteDialogShown = true"
		>
			<template #icon-left>
				<Icon
					name="delete"
					dimensions="16px"
				/>
			</template>
			{{ $t('common.remove') }}
		</ZyroButton>
		<Teleport
			v-if="isDeleteDialogShown"
			to="body"
		>
			<SystemDialogModal
				:title="$t('builder.multilingualDrawerRemoveLanguageModalTitle')"
				:primary-button-text="$t('common.cancel')"
				:secondary-button-text="$t('common.remove')"
				primary-button-theme="outline"
				:is-loading="isDeleting"
				width="400px"
				@click-primary="handleDeleteDialogRejectClick"
				@click-secondary="handleDeleteDialogConfirmClick"
				@close="handleDeleteDialogClose"
			>
				<i18n-t
					tag="p"
					class="z-body"
					keypath="builder.multilingualDrawerRemoveLanguageModalText"
				>
					<span class="z-body z-body--strong">
						{{ item.language }}
					</span>
				</i18n-t>
			</SystemDialogModal>
		</Teleport>
	</div>
</template>

<script>
import Icon from '@/components/global/Icon.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';

import {
	mapGetters,
	mapActions,
} from 'vuex';

import SystemDialogModal from '@/components/builder-modals/modals/SystemDialogModal.vue';

import { defineComponent } from 'vue';

export default defineComponent({
	name: 'MultilingualPopupButtons',

	components: {
		Icon,
		ZyroButton,
		SystemDialogModal,
	},

	props: {
		item: {
			type: Object,
			required: true,
		},
	},
	emits: ['toggle-language-settings'],

	data() {
		return {
			isDeleteDialogShown: false,
			isDeleting: false,
		};
	},

	computed: {
		...mapGetters([
			'defaultLocale',
			'siteLanguagesArray',
		]),
		isDefaultLanguage() {
			return this.defaultLocale === this.item.locale;
		},
		isLanguageHidden() {
			return !!this.item.isHidden;
		},
		isDeleteButtonVisible() {
			return !this.isDefaultLanguage || this.siteLanguagesArray.length === 1;
		},
	},

	methods: {
		handleDeleteDialogRejectClick() {
			this.isDeleteDialogShown = false;
			this.$emit('toggle-language-settings');
		},
		handleDeleteDialogConfirmClick() {
			this.isDeleting = true;
			this.isDeleteDialogShown = false;
			this.$emit('toggle-language-settings');
			this.removeLanguage(this.item.locale);
		},
		handleDeleteDialogClose() {
			this.isDeleteDialogShown = false;
			this.$emit('toggle-language-settings');
		},
		...mapActions([
			'removeLanguage',
			'updateDefaultLocale',
			'updateLanguageVisibility',
		]),
	},
});
</script>

<style lang="scss" scoped>
.popup {
	&__list {
		display: flex;
		flex-direction: column;
		padding: 8px 12px;
	}

	&__button {
		white-space: nowrap;

		&--remove {
			color: var(--color-primary);
		}
	}
}
</style>
