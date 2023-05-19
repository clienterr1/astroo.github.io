<template>
	<div class="integration">
		<ZyroCollapsible
			v-qa="`sitesettings-integrations-${integrationKey}`"
			:icon="icon"
			:is-open="isOpen"
			@toggle="isOpen = !isOpen"
		>
			<template #heading>
				{{ name }}
			</template>
			<template #tag>
				<ZyroStatus
					:text="$t('common.connect')"
					:status-done="!!status"
					:text-done="status"
				/>
			</template>
			<template #content>
				<ZyroFieldInput
					v-if="inputTag === 'input'"
					v-model="value"
					:input-data-qa="`integrations-input-${integrationKey}`"
					class="integration__input"
					:class="{ 'integration__input--monospaced': isInputTextMonospaced }"
					:input-tag="inputTag"
					:placeholder="inputPlaceholder"
					:label="inputLabel"
					label-theme="secondary"
					input-theme="secondary"
					:error="isError ? inputErrorMessage || $t('validate.integrationIdInvalid') : ''"
					@update:model-value="v$.value.$touch()"
				>
					<template #suffix>
						<slot name="input-suffix" />
					</template>
				</ZyroFieldInput>
				<ZyroFieldTextArea
					v-else
					v-model="value"
					:input-data-qa="`integrations-textarea-${integrationKey}`"
					class="integration__input"
					:class="{ 'integration__input--monospaced': isInputTextMonospaced }"
					:placeholder="inputPlaceholder"
					:label="inputLabel"
					theme="secondary"
					:is-resizable="integrationKey === INTEGRATION_KEY_CUSTOM_META"
					:min-height="integrationKey === INTEGRATION_KEY_CUSTOM_META ? 160 : 0"
					@update:model-value="v$.value.$touch()"
				>
					<template #suffix>
						<slot name="input-suffix" />
					</template>
					<template #message>
						<div
							v-if="isError"
							class="integration__input-message"
						>
							{{ inputErrorMessage || $t('validate.integrationIdInvalid') }}
						</div>
					</template>
				</ZyroFieldTextArea>
				<slot />
			</template>

			<template
				v-if="isFooterVisible || v$.value.$dirty"
				#footer
			>
				<ZyroButton
					theme="plain"
					class="integration__meta-footer"
					data-qa="integrations-btn-cancel"
					@click="handleCancelClick"
				>
					{{ $t('common.cancel') }}
				</ZyroButton>

				<ZyroButton
					theme="primary"
					data-qa="integrations-btn-savechanges"
					@click="handleSaveClick"
				>
					{{ $t('common.saveChanges') }}
				</ZyroButton>
			</template>
		</ZyroCollapsible>

		<SiteSettingsModal
			v-if="isConfirmModalOpen"
			:title="$t('siteSettings.common.unsavedChanges')"
			:right-button-text="$t('common.discard')"
			:left-button-text="$t('common.continueEditing')"
			@close="isConfirmModalOpen = false"
			@left-button-click="isConfirmModalOpen = false"
			@right-button-click="handleDiscardModalClick"
		>
			{{ $t('siteSettings.common.unsavedChangesText') }}
		</SiteSettingsModal>
	</div>
</template>

<script>
import {
	mapGetters,
	mapActions,
	mapMutations,
} from 'vuex';
import { defineComponent } from 'vue';
import { useVuelidate } from '@vuelidate/core';

import EventLogApi from '@/api/EventLogApi';
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroFieldTextArea from '@/components/global/ZyroFieldTextArea.vue';
import ZyroFieldInput from '@/components/global/ZyroFieldInput.vue';
import SiteSettingsModal from '@/components/site-settings/components/SiteSettingsModal.vue';
import ZyroCollapsible from '@/components/site-settings/components/ZyroCollapsible.vue';
import ZyroStatus from '@/components/site-settings/components/ZyroStatus.vue';
import {
	INTEGRATION_KEY_CUSTOM_META,
	INTEGRATION_KEY_CUSTOM_HEAD_ELEMENTS,
	INTEGRATION_KEY_CUSTOM_BODY_ELEMENTS,
} from '@/constants';
import { validateIntegrationInput } from '@/components/site-settings/pages/integrations/integrationValidations';
import { eventNames } from '@/data/analyticEventList';
import {
	processHtml,
	getHeadElements,
	getBodyElements,
} from '@zyro-inc/site-modules/utils/customElements';

export default defineComponent({

	components: {
		ZyroButton,
		ZyroFieldInput,
		ZyroFieldTextArea,
		ZyroCollapsible,
		SiteSettingsModal,
		ZyroStatus,
	},

	props: {
		isInitiallyOpen: {
			type: Boolean,
			default: false,
		},
		isInputTextMonospaced: {
			type: Boolean,
			default: false,
		},
		inputTag: {
			type: String,
			default: 'input',
		},
		inputLabel: {
			type: String,
			default: null,
		},
		inputPlaceholder: {
			type: String,
			default: null,
		},
		inputErrorMessage: {
			type: String,
			default: null,
		},
		integrationKey: {
			type: String,
			required: true,
		},
		icon: {
			type: String,
			default: null,
		},
		name: {
			type: String,
			default: null,
		},
		isFooterVisible: {
			type: Boolean,
			default: false,
		},
	},

	emits: [
		'submit',
		'reset',
	],

	setup: () => ({
		v$: useVuelidate(),
		INTEGRATION_KEY_CUSTOM_META,
	}),

	validations() {
		return {
			value: {},
		};
	},
	data() {
		return {
			isOpen: this.isInitiallyOpen,
			isConfirmModalOpen: false,
			isError: false,
			resetKey: null,
			value: null,
			status: null,
		};
	},
	computed: {
		...mapGetters(['siteMeta']),
	},

	beforeMount() {
		const initialValue = this.siteMeta[this.integrationKey];

		this.value = initialValue;
		this.status = initialValue ? this.$t('common.completed') : null;
	},

	methods: {
		...mapActions('saving', ['saveWebsite']),
		...mapMutations(['setWebsiteMeta']),
		updateIntegration() {
			const output = validateIntegrationInput({
				integrationId: this.integrationKey,
				inputValue: this.value || '',
			});

			this.isError = !output.isValid;

			return output.value;
		},
		async handleSaveClick() {
			if (this.integrationKey !== INTEGRATION_KEY_CUSTOM_META) {
				const output = validateIntegrationInput({
					integrationId: this.integrationKey,
					inputValue: this.value || '',
				});

				if (!output.isValid) {
					this.isError = true;

					return;
				}

				this.value = output.value;
			} else {
				const htmlString = processHtml(this.value);
				const customHeadElements = getHeadElements(htmlString);
				const customBodyElements = getBodyElements(htmlString);

				this.setWebsiteMeta({
					key: INTEGRATION_KEY_CUSTOM_HEAD_ELEMENTS,
					value: customHeadElements,
				});
				this.setWebsiteMeta({
					key: INTEGRATION_KEY_CUSTOM_BODY_ELEMENTS,
					value: customBodyElements,
				});
			}

			this.setWebsiteMeta({
				key: this.integrationKey,
				value: this.value,
			});

			this.$emit('submit');
			this.status = this.value ? this.$t('common.saved') : null;
			await this.saveWebsite();
			this.isError = false;
			this.v$.$reset();
			EventLogApi.logEvent({
				eventName: eventNames.builder.save_integration,
				eventProperties: {
					integration: this.integrationKey,
				},
			});
		},
		handleCancelClick() {
			this.resetKey = this.integrationKey;
			this.isConfirmModalOpen = true;
		},
		handleDiscardModalClick() {
			this.isConfirmModalOpen = false;
			this.value = this.siteMeta[this.resetKey];
			this.v$.$reset();
			this.$emit('reset');
			this.resetKey = null;
		},
	},
});
</script>
<style lang="scss" scoped>
.integration {
	&__input-message {
		margin-top: 8px;
		overflow: hidden;
		font-size: 13px;
		color: $color-gray;
		color: $color-primary;
		text-align: left;
		text-overflow: ellipsis;
		user-select: text;
	}

	&__input {
		&--monospaced {
			font-family: monospace;
		}
	}

	&__meta-footer {
		margin-right: 32px;

		@media screen and (max-width: $media-mobile) {
			margin-right: 24px;
		}
	}
}
</style>
