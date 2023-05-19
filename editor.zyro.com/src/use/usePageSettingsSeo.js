import {
    computed
} from 'vue';
import {
    useStore
} from 'vuex';
import {
    parseTagsCountFromHTML
} from '@/utils/rehypeUtils';
import {
    ELEMENT_TYPE_TEXT_BOX,
    PAGE_TYPE_ECOMMERCE_PRODUCT,
} from '@zyro-inc/site-modules/constants';

export const usePageSettingsSeo = ({
    pageId
}) => {
    const {
        getters
    } = useStore();
    const sitePages = computed(() => getters.sitePages);
    const siteElements = computed(() => getters.siteElements);
    const siteBlocks = computed(() => getters.siteBlocks);
    const footerBlock = computed(() => getters.footerBlock);
    const pageData = computed(() => sitePages.value[pageId]);
    const pageMeta = computed(() => pageData.value.meta ? ? {});
    const pageMetaTitle = computed(() => pageMeta.value.title || '');
    const pageMetaDescription = computed(() => pageMeta.value.description || '');
    const pageMetaKeywords = computed(() => pageMeta.value.keywords || []);

    const isGeneralPageSeoSetupCompleted = computed(() => {
        const isMetaTitleFilled = !!pageMetaTitle.value;
        const isMetaDescriptionFilled = !!pageMetaDescription.value;
        const areKeywordsAdded = pageMetaKeywords.value.length > 0;

        return isMetaTitleFilled && isMetaDescriptionFilled && areKeywordsAdded;
    });

    const pageElementsIds = computed(() => {
        const pageElementIds = pageData.value.blocks.flatMap((blockId) => siteBlocks.value[blockId].components || []);
        const footerElementIds = footerBlock.value ? .components || [];

        return [
            ...pageElementIds,
            ...footerElementIds,
        ];
    });
    const pageElements = computed(() => pageElementsIds.value.map((elementId) => siteElements.value[elementId]));
    const pageTextElements = computed(() => pageElements.value.filter(({
        type
    }) => type === ELEMENT_TYPE_TEXT_BOX));
    const pageHtmlTexts = computed(() => pageTextElements.value.map(({
        content
    }) => content));
    // Ecommerce page product block has h1 added. There can be only one product block in the page.
    const ecommerceProductBlockWithH1Count = computed(() => (pageData.value.type === PAGE_TYPE_ECOMMERCE_PRODUCT ? 1 : 0));
    const pageTextElementH1TagsCount = computed(() => pageHtmlTexts.value.reduce(((h1TagsCount, html) => {
        const headingsCount = parseTagsCountFromHTML({
            html,
            tagName: 'h1',
        });

        return h1TagsCount + headingsCount;
    }), 0));
    const pageH1TagsCount = computed(() => pageTextElementH1TagsCount.value + ecommerceProductBlockWithH1Count.value);

    const isHeadingTagsSetupCompleted = computed(() => pageH1TagsCount.value === 1);
    const isPageSEOSetupCompleted = computed(() => isGeneralPageSeoSetupCompleted.value && isHeadingTagsSetupCompleted.value);

    return {
        pageMetaTitle,
        pageMetaDescription,
        pageMetaKeywords,
        isGeneralPageSeoSetupCompleted,
        isHeadingTagsSetupCompleted,
        isPageSEOSetupCompleted,
    };
};