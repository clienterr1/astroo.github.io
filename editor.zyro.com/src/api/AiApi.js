import axios from 'axios';

export const AI_API = `${import.meta.env.VITE_BACKEND_API_URL}/v1/ai`;

export const getCategories = () => axios.get(`${AI_API}/categories`);

export const getSubcategories = (category) => axios.get(`${AI_API}/subcategories/${category}`);

export const getTypes = ({
    category,
    subcategory,
}) => axios.get(`${AI_API}/types/${category}/${subcategory}`);

export const getTexts = ({
    category,
    subcategory,
    type,
    language,
}) => axios.get(
    `${AI_API}/texts?
		category=${encodeURIComponent(category)}&
		subcategory=${encodeURIComponent(subcategory)}&
		type=${encodeURIComponent(type)}&
		targetLanguageCode=${encodeURIComponent(language)}`,
);

export const createTemplate = ({
    brandName,
    brandDescription,
    sections,
    websiteType,
}) => axios.post(`${AI_API}/template-create`, {
    brandName,
    description: brandDescription,
    sections,
    websiteType,
});

export const createTemplateFree = ({
    brandName,
    brandDescription,
    sections,
    websiteType,
}) => axios.post(`${AI_API}/template-create-free`, {
    brandName,
    description: brandDescription,
    sections,
    websiteType,
});

export const createSite = ({
    templateData,
    templateId,
    siteName,
}) => axios.post(`${AI_API}/site-create`, {
    data: templateData,
    templateId,
    siteName,
});

export const createSeo = ({
    brandDescription,
    keywords,
}) => axios.post(`${AI_API}/seo`, {
    text: brandDescription,
    keywords,
});

export const createImageAltTag = ({
    imageUrl
}) => axios.post(`${AI_API}/seo/alt-tag`, {
    assetUrl: imageUrl,
});

export const checkHasHostingPlan = () => axios.get(`${AI_API}/has-hosting-plan`);

export const generateText = ({
    prompt
}) => axios.post(`${AI_API}/generate-text`, {
    prompt,
});

export const getRephrasedText = async ({
    text
}) => {
    const {
        data
    } = await axios.post(`${AI_API}/rephrase-text`, {
        text,
    });

    return data.text;
};

export const getSiteMatchingColorPaletteName = ({
    description
}) => axios.post(`${AI_API}/color-palette`, {
    description,
});