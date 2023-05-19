<template>
	<div class="legal-policy-form">
		<p
			v-qa="`legalcontentform-form-title`"
			class="legal-policy-form__title"
		>
			{{ generatorConfig.title }}
		</p>
		<p
			v-qa="`legalcontentform-form-subtitle`"
			class="legal-policy-form__subtitle"
		>
			{{ generatorConfig.subtitle }}
		</p>

		<form>
			<ZyroFieldInput
				v-if="generatorConfig.isCompanyNameInputVisible"
				v-model="companyName"
				:error="isCompanyNameTouched && !isValidCompanyName"
				:label="$t('common.companyName')"
				input-data-qa="legalcontentform-company-name"
				:placeholder="$t('common.companyNameInputPlaceholder')"
				@input-blur="isCompanyNameTouched = true"
			>
				<template #error>
					{{ $t('common.companyNameInputError') }}
				</template>
			</ZyroFieldInput>
			<ZyroFieldInput
				v-if="generatorConfig.isWebsiteNameInputVisible"
				v-model="websiteName"
				:error="isWebsiteNameTouched && !isValidWebsiteName"
				:label="$t('common.websiteName')"
				input-data-qa="legalcontentform-website-name"
				:placeholder="$t('common.websiteNameInputPlaceholder')"
				@input-blur="isWebsiteNameTouched = true"
			>
				<template #error>
					{{ $t('common.websiteNameInputError') }}
				</template>
			</ZyroFieldInput>
			<ZyroFieldInput
				v-if="generatorConfig.isAddressInputVisible"
				v-model="companyAddress"
				:error="isCompanyAddressTouched && !isValidCompanyAddress"
				:label="$t('builder.legalContentGenerator.addressInputLabel')"
				input-data-qa="legalcontentform-company-address"
				:placeholder="$t('builder.legalContentGenerator.addressInputPlaceholder')"
				@input-blur="isCompanyAddressTouched = true"
			>
				<template #error>
					{{ $t('builder.legalContentGenerator.addressInputError') }}
				</template>
			</ZyroFieldInput>
			<ZyroFieldInput
				v-if="generatorConfig.isWebsiteAddressInputVisible"
				v-model="websiteAddress"
				:error="isWebsiteAddressTouched && !isValidWebsiteAddress"
				:label="$t('common.websiteAddress')"
				input-data-qa="legalcontentform-website-address"
				:placeholder="$t('common.websiteAddressInputPlaceholder')"
				@input-blur="isWebsiteAddressTouched = true"
			>
				<template #error>
					{{ $t('common.websiteAddressInputError') }}
				</template>
			</ZyroFieldInput>
			<ZyroFieldInput
				v-model="emailAddress"
				:error="isEmailAddressTouched && !isValidEmailAddress"
				:label="$t('common.emailAddress')"
				input-data-qa="legalcontentform-email-address"
				:placeholder="$t('common.emailAddressInputPlaceholder')"
				@input-blur="isEmailAddressTouched = true"
			>
				<template #error>
					{{ $t('common.emailAddressInputError') }}
				</template>
			</ZyroFieldInput>
		</form>
	</div>
</template>

<script>
import ZyroFieldInput from '@/components/global/ZyroFieldInput.vue';

import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';

import {
	onMounted,
	defineComponent,
	computed,
	ref,
} from 'vue';

import {
	BLOCK_CATEGORY_PRIVACY_POLICY,
	BLOCK_CATEGORY_REFUND_POLICY,
	BLOCK_CATEGORY_TERMS_AND_CONDITIONS,
} from '@/constants';

import { useLegalContentGenerator } from '@/components/legal-content-generator/useLegalContentGenerator';

export default defineComponent({
	name: 'LegalContentGeneratorForm',

	components: {
		ZyroFieldInput,
	},

	setup() {
		const { t } = useI18n();
		const {
			state,
			getters,
		} = useStore();
		const isDisclaimerVisible = ref(false);

		const userEmail = computed(() => getters['user/getUserEmail']);
		const currentMetaTitle = computed(() => (getters.currentLanguageData.metaTitle
			? getters.currentLanguageData.metaTitle
			: getters.siteMeta.metaTitle
		));
		const siteCustomDomainUrl = computed(() => getters.siteCustomDomainUrl);
		const customDomain = computed(() => state.customDomain);

		const {
			companyName,
			websiteName,
			companyAddress,
			websiteAddress,
			emailAddress,
			isValidCompanyName,
			isValidWebsiteName,
			isValidCompanyAddress,
			isValidWebsiteAddress,
			isValidEmailAddress,
			isCompanyNameTouched,
			isWebsiteNameTouched,
			isCompanyAddressTouched,
			isWebsiteAddressTouched,
			isEmailAddressTouched,
			formSubmitHandler,
		} = useLegalContentGenerator();

		const FORM_CONFIG = {
			[BLOCK_CATEGORY_PRIVACY_POLICY]: {
				title: t('common.privacyPolicy'),
				subtitle: t('builder.legalContentGenerator.privacyPolicySubtitle'),
				isCompanyNameInputVisible: true,
				isWebsiteNameInputVisible: true,
			},

			[BLOCK_CATEGORY_REFUND_POLICY]: {
				title: t('common.refundPolicy'),
				subtitle: t('builder.legalContentGenerator.refundPolicySubtitle'),
				isAddressInputVisible: true,
			},

			[BLOCK_CATEGORY_TERMS_AND_CONDITIONS]: {
				title: t('common.termsAndConditions'),
				subtitle: t('builder.legalContentGenerator.termsAndConditionsSubtitle'),
				isCompanyNameInputVisible: true,
				isWebsiteNameInputVisible: true,
				isWebsiteAddressInputVisible: true,
			},
		};

		const activeModalSettings = computed(() => state.gui.activeModalSettings);
		const legalContentType = computed(() => activeModalSettings.value.legalContentType);
		const generatorConfig = computed(() => FORM_CONFIG[legalContentType.value]);

		onMounted(() => {
			emailAddress.value = userEmail.value;
			websiteName.value = currentMetaTitle.value || '';
			websiteAddress.value = customDomain.value ? siteCustomDomainUrl.value : '';
		});

		return {
			activeModalSettings,
			formSubmitHandler,
			generatorConfig,
			isDisclaimerVisible,
			companyName,
			websiteName,
			companyAddress,
			websiteAddress,
			emailAddress,
			isValidCompanyName,
			isValidWebsiteName,
			isValidCompanyAddress,
			isValidWebsiteAddress,
			isValidEmailAddress,
			isCompanyNameTouched,
			isWebsiteNameTouched,
			isCompanyAddressTouched,
			isWebsiteAddressTouched,
			isEmailAddressTouched,
		};
	},
});
</script>
<style lang="scss" scoped>
.legal-policy-form {
	&__title {
		margin-bottom: 8px;
		font-size: 24px;
		font-weight: 500;
		line-height: 1.33;
	}

	&__subtitle {
		margin-bottom: 24px;
		font-size: 14px;
		font-weight: 400;
		line-height: 1.42;
		color: $color-gray;
		letter-spacing: 0.25px;
	}

	:deep() {
		.zyro-field-text__message--error {
			color: $color-danger;
		}

		.zyro-input--error .zyro-input__input {
			border-color: $color-danger;
		}
	}
}
</style>
