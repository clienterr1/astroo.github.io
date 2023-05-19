import {
    ref,
    computed,
} from 'vue';
import {
    useStore
} from 'vuex';

import {
    isEmailValid
} from '@/utils/urlValidators';
import {
    isStringEmpty
} from '@/utils/string';
import {
    cloneBlock
} from '@/utils/siteDataUtils';

import addBlockTemplate from '@/data/AddLayoutBlockModalTemplate.json';

import {
    useAddBlock
} from '@/use/useAddBlock';
import {
    useAddPage
} from '@/use/useAddPage';

import defaultPolicyContent from '@/components/legal-content-generator/legal-content/default.json';

import {
    CLOSE_MODAL
} from '@/store/builder/gui';

import {
    LEGAL_GENERATOR_COMPANY_NAME_KEY,
    LEGAL_GENERATOR_WEBSITE_NAME_KEY,
    LEGAL_GENERATOR_COMPANY_ADDRESS_KEY,
    LEGAL_GENERATOR_WEBSITE_ADDRESS_KEY,
    LEGAL_GENERATOR_EMAIL_ADDRESS_KEY,
    BLOCK_CATEGORY_PRIVACY_POLICY,
    BLOCK_CATEGORY_REFUND_POLICY,
    BLOCK_CATEGORY_TERMS_AND_CONDITIONS,
} from '@/constants';
import {
    SYSTEM_LOCALE
} from '@zyro-inc/site-modules/constants';
import EventLogApi from '@/api/EventLogApi';

const companyName = ref('');
const websiteName = ref('');
const companyAddress = ref('');
const websiteAddress = ref('');
const emailAddress = ref('');

const isCompanyNameTouched = ref(false);
const isWebsiteNameTouched = ref(false);
const isCompanyAddressTouched = ref(false);
const isWebsiteAddressTouched = ref(false);
const isEmailAddressTouched = ref(false);

export const getUpdateDocumentContent = ({
    document,
    replacements,
}) => Object.entries(replacements).reduce((updatedDocument, [key, value]) => {
    const regExp = new RegExp(key, 'g');

    return updatedDocument.replace(regExp, value);
}, document);

export const getTemplateWithUpdatedDocumentElement = ({
    template,
    elementId,
    legalHtmlContent,
}) => ({
    ...template,
    languages: {
        [SYSTEM_LOCALE]: {
            ...template.languages.system,
            elements: {
                ...template.languages.system.elements,
                [elementId]: {
                    ...template.languages.system.elements[elementId],
                    content: legalHtmlContent,
                },
            },
        },
    },
});

export const useLegalContentGenerator = () => {
    const {
        dispatch,
        state,
    } = useStore();

    const {
        addBlock
    } = useAddBlock();
    const {
        addPageWithContent
    } = useAddPage();

    const currentLocale = computed(() => state.currentLocale);
    const activeModalSettings = computed(() => state.gui.activeModalSettings);
    const legalContentType = computed(() => activeModalSettings.value.legalContentType);
    const blockId = computed(() => activeModalSettings.value.blockId);
    const shouldAddPage = computed(() => activeModalSettings.value.shouldAddPage);
    const newPageId = computed(() => activeModalSettings.value.newPageId);
    const newPageName = computed(() => activeModalSettings.value.newPageName);

    const isValidCompanyName = computed(() => !isStringEmpty(companyName.value));
    const isValidWebsiteName = computed(() => !isStringEmpty(websiteName.value));
    const isValidCompanyAddress = computed(() => !isStringEmpty(companyAddress.value));
    const isValidWebsiteAddress = computed(() => !isStringEmpty(websiteAddress.value));
    const isValidEmailAddress = computed(() => isEmailValid(emailAddress.value));

    const isPrivacyFormValid = computed(() => isValidCompanyName.value && isValidWebsiteName.value && isValidEmailAddress.value);
    const isRefundFormValid = computed(() => isValidCompanyAddress.value && isValidEmailAddress.value);
    const isTermsAndConditionsFormValid = computed(() => isValidCompanyName.value &&
        isValidWebsiteName.value &&
        isValidWebsiteAddress.value &&
        isValidEmailAddress.value);

    const privacyPolicyVariablesReplacements = computed(() => ({
        [LEGAL_GENERATOR_COMPANY_NAME_KEY]: companyName.value,
        [LEGAL_GENERATOR_WEBSITE_NAME_KEY]: websiteName.value,
        [LEGAL_GENERATOR_EMAIL_ADDRESS_KEY]: emailAddress.value,
    }));

    const refundPolicyVariablesReplacements = computed(() => ({
        [LEGAL_GENERATOR_COMPANY_ADDRESS_KEY]: companyAddress.value,
        [LEGAL_GENERATOR_EMAIL_ADDRESS_KEY]: emailAddress.value,
    }));

    const termsAndConditionsVariablesReplacements = computed(() => ({
        [LEGAL_GENERATOR_COMPANY_NAME_KEY]: companyName.value,
        [LEGAL_GENERATOR_WEBSITE_NAME_KEY]: websiteName.value,
        [LEGAL_GENERATOR_WEBSITE_ADDRESS_KEY]: websiteAddress.value,
        [LEGAL_GENERATOR_EMAIL_ADDRESS_KEY]: emailAddress.value,
    }));

    const resetForm = () => {
        companyName.value = '';
        websiteName.value = '';
        companyAddress.value = '';
        websiteAddress.value = '';
        emailAddress.value = '';
        isCompanyNameTouched.value = false;
        isCompanyAddressTouched.value = false;
        isWebsiteNameTouched.value = false;
        isWebsiteAddressTouched.value = false;
        isEmailAddressTouched.value = false;
    };

    const closeModal = () => {
        resetForm();

        dispatch(`gui/${CLOSE_MODAL}`);
    };

    const addLegalContentBlock = ({
        legalHtmlContent
    }) => {
        const updatedTemplate = getTemplateWithUpdatedDocumentElement({
            template: addBlockTemplate,
            elementId: legalContentType.value,
            legalHtmlContent,
        });

        addBlock({
            blockId: blockId.value,
            slot: null,
            template: updatedTemplate,
        });

        closeModal();
    };

    const addLegalContentPage = async ({
        legalHtmlContent
    }) => {
        const updatedTemplate = getTemplateWithUpdatedDocumentElement({
            template: addBlockTemplate,
            elementId: legalContentType.value,
            legalHtmlContent,
        });

        const {
            newBlockId,
            newBlock,
            newElements,
        } = cloneBlock({
            siteData: updatedTemplate,
            blockId: `${legalContentType.value}-block`,
            slot: '',
            fromLocale: 'system',
            toLocale: currentLocale.value,
        });

        await addPageWithContent({
            newPageId: newPageId.value,
            newPageName: newPageName.value,
            newPageSlug: `${legalContentType.value}-${newPageId.value}`,
            newPageBlocks: {
                [newBlockId]: newBlock,
            },
            newPageElements: newElements,
            shouldUpdateCurrentPage: true,
            shouldOpenPageSettingsPopup: true,
        });

        EventLogApi.logEvent({
            eventName: 'website_builder.add_page.added',
            isHostingerEvent: true,
        });

        closeModal();
    };

    const privacyFormHandler = () => {
        if (isPrivacyFormValid.value) {
            const privacyPolicyHtmlContent = getUpdateDocumentContent({
                document: defaultPolicyContent[BLOCK_CATEGORY_PRIVACY_POLICY],
                replacements: privacyPolicyVariablesReplacements.value,
            });

            if (shouldAddPage.value) {
                addLegalContentPage({
                    legalHtmlContent: privacyPolicyHtmlContent,
                });

                return;
            }

            addLegalContentBlock({
                legalHtmlContent: privacyPolicyHtmlContent,
            });

            return;
        }

        isCompanyNameTouched.value = true;
        isWebsiteNameTouched.value = true;
        isEmailAddressTouched.value = true;
    };

    const refundPolicyFormHandler = () => {
        if (isRefundFormValid.value) {
            const refundPolicyHtmlContent = getUpdateDocumentContent({
                document: defaultPolicyContent[BLOCK_CATEGORY_REFUND_POLICY],
                replacements: refundPolicyVariablesReplacements.value,
            });

            if (shouldAddPage.value) {
                addLegalContentPage({
                    legalHtmlContent: refundPolicyHtmlContent,
                });

                return;
            }

            addLegalContentBlock({
                legalHtmlContent: refundPolicyHtmlContent,
            });

            return;
        }

        isCompanyAddressTouched.value = true;
        isEmailAddressTouched.value = true;
    };

    const termsAndConditionsFormHandler = () => {
        if (isTermsAndConditionsFormValid.value) {
            const termsAndConditionsHtmlContent = getUpdateDocumentContent({
                document: defaultPolicyContent[BLOCK_CATEGORY_TERMS_AND_CONDITIONS],
                replacements: termsAndConditionsVariablesReplacements.value,
            });

            if (shouldAddPage.value) {
                addLegalContentPage({
                    legalHtmlContent: termsAndConditionsHtmlContent,
                });

                return;
            }

            addLegalContentBlock({
                legalHtmlContent: termsAndConditionsHtmlContent,
            });

            return;
        }

        isCompanyNameTouched.value = true;
        isWebsiteNameTouched.value = true;
        isWebsiteAddressTouched.value = true;
        isEmailAddressTouched.value = true;
    };

    const formSubmitHandler = () => {
        switch (legalContentType.value) {
            case BLOCK_CATEGORY_PRIVACY_POLICY:
                privacyFormHandler();

                return;
            case BLOCK_CATEGORY_REFUND_POLICY:
                refundPolicyFormHandler();

                return;
            case BLOCK_CATEGORY_TERMS_AND_CONDITIONS:
                termsAndConditionsFormHandler();
                break;
            default:
        }
    };

    return {
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
        closeModal,
        formSubmitHandler,
        privacyFormHandler,
        refundPolicyFormHandler,
        termsAndConditionsFormHandler,
        resetForm,
        shouldAddPage,
    };
};