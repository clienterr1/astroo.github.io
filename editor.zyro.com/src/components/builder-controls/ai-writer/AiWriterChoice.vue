<template>
	<div class="choice-container">
		<div
			v-if="!currentlyChoosing"
			class="options"
		>
			<h5 class="options__category z-subheading">
				{{ currentChoices.category.translation }}
			</h5>
			<div
				v-if="currentChoices.category"
				class="current-options"
			>
				<i18n-t
					tag="p"
					class="current-options__option z-h5 current-options__option--blank"
					keypath="builder.AIWriter.textFor"
				>
					<span
						v-if="currentChoices.subcategory"
						class="current-options__option z-h5"
					>
						{{ currentChoices.type.translation }}
					</span>
					<span
						v-if="currentChoices.type"
						class="current-options__option z-h5"
					>
						{{ currentChoices.subcategory.translation }}
					</span>
					<span
						v-if="currentChoices.language.value"
						class="current-options__option z-h5"
					>
						{{ currentChoices.language.title }}
					</span>
				</i18n-t>
			</div>
			<ZyroButton
				theme="outline"
				class="options__toggle-button"
				@click.stop="$emit('toggle-choosing')"
			>
				{{ t('common.change') }}
			</ZyroButton>
		</div>
		<form
			v-else
			class="selection-form"
			@submit.prevent="generateText"
		>
			<div class="choice-list">
				<h6 class="choice-list__title choice-list__title--display-block z-subheading">
					<template v-if="isHostingerBrand">
						1. {{ t('builder.aiWriterFirstTopicHostinger') }}
					</template>
					<template v-else>
						1. {{ t('builder.AIWriter.choices.selectWriterTopic') }}
						<a
							target="_blank"
							href="https://zyro.com/ai/content-generator?ref=builder"
						>
							{{ t('builder.AIWriter.goWild') }} 🐎
						</a>
					</template>
					<button
						v-if="initialChoices"
						class="choice-list__back-icon"
						@click.stop="(currentChoices = { ...initialChoices }), $emit('toggle-choosing')"
					>
						<ZyroSvgDeprecated
							name="arrow"
							direction="right"
						/>
					</button>
				</h6>
				<ul
					v-qa="'ai-writer-categories'"
					class="choice-list__buttons"
				>
					<!-- TODO: should be a radio-group (accessibility, html semantics). Component? -->
					<button
						v-for="category in categories"
						:key="category.id"
						v-qa="`aiwriter-category-${category.id}`"
						:class="{ 'choice-list__button--active': category === currentChoices.category }"
						class="choice-list__button"
						type="button"
						@click="chooseCategory(category)"
					>
						{{ category.translation }}
					</button>
				</ul>
			</div>

			<div
				v-if="currentChoices.category"
				class="choice-list"
			>
				<h6 class="choice-list__title z-subheading">
					2. {{ t('builder.AIWriter.choices.selectCategory') }}
				</h6>
				<ul
					v-qa="'ai-writer-subcategories'"
					class="choice-list__buttons"
				>
					<button
						v-for="subcategory in currentChoices.category.subcategories"
						:key="subcategory.id"
						v-qa="`aiwriter-subcategory-${subcategory.id}`"
						:class="{ 'choice-list__button--active': subcategory === currentChoices.subcategory }"
						class="choice-list__button"
						type="button"
						@click="chooseSubcategory(subcategory), $emit('type-selected')"
					>
						{{ subcategory.translation }}
					</button>
				</ul>
			</div>

			<div
				v-if="currentChoices.subcategory"
				ref="typeList"
				class="choice-list"
			>
				<h6 class="choice-list__title z-subheading">
					3. {{ t('builder.AIWriter.choices.selectParagraph') }}
				</h6>
				<ul
					v-qa="'ai-writer-types'"
					class="choice-list__buttons"
				>
					<button
						v-for="type in currentChoices.subcategory.types"
						:key="type.id"
						v-qa="`aiwriter-type-${type.id}`"
						:class="{ 'choice-list__button--active': type === currentChoices.type }"
						class="choice-list__button"
						type="button"
						@click="chooseType(type)"
					>
						{{ type.translation }}
					</button>
				</ul>
			</div>

			<div
				v-if="currentChoices.type"
				ref="languageList"
				class="choice-list"
			>
				<h6 class="choice-list__title z-subheading">
					4. {{ t('builder.AIWriter.choices.selectLanguage') }}
				</h6>
				<div v-qa="'ai-writer-languages'">
					<ZyroDropdown
						v-model="currentChoices.language"
						:options="languages"
					/>
				</div>
			</div>

			<div
				v-if="loading"
				class="loader-wrapper"
			>
				<ZyroLoader />
			</div>

			<div class="selection-form__button-container">
				<ZyroButton
					type="submit"
					class="generate-button"
					data-qa="builder-aiwriter-btn-generatetext"
					theme="primary"
					color="red"
					size="sm"
					:disabled="!currentChoices.type"
				>
					<template #icon-left>
						<Icon
							name="loop"
							dimensions="16px"
						/>
					</template>
					{{ t('builder.AIWriter.btn') }}
				</ZyroButton>
			</div>
		</form>
	</div>
</template>
<script>
import Icon from '@/components/global/Icon.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroDropdown from '@/components/global/ZyroDropdown.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import camelCase from 'lodash.camelcase';

import ZyroLoader from '@zyro-inc/site-modules/components/ZyroLoader.vue';

import { AI_WRITER_ACCEPTED_GOOGLE_TRANSLATION_LANGUAGES } from '@/data';
import { isHostingerBrand } from '@/utils/isHostingerBrand';
import {
	getCategories,
	getSubcategories,
	getTypes,
} from '@/api/AiApi';
import { DEFAULT_LOCALE } from '@/utils/i18n/supportedLocales';
import LOCALES from '@/i18n/locales.json';

import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({

	components: {
		Icon,
		ZyroButton,
		ZyroDropdown,
		ZyroSvgDeprecated,
		ZyroLoader,
	},

	props: {
		currentlyChoosing: {
			type: Boolean,
			default: true,
		},
	},
	emits: [
		'generate-text',
		'on-content-update',
		'type-selected',
	],

	setup() {
		const { t } = useI18n();

		return {
			t,
			isHostingerBrand,
		};
	},

	data() {
		return {
			loading: false,
			initialChoices: null,
			currentChoices: {
				category: null,
				subcategory: null,
				type: null,
				language: null,
			},
			categories: null,
			lastContentOffsetBottom: null,
		};
	},

	computed: {
		languages() {
			const supportedLanguages = LOCALES
				.filter((locale) => AI_WRITER_ACCEPTED_GOOGLE_TRANSLATION_LANGUAGES.includes(locale.iso6391))
				.map(({
					language,
					iso6391,
				}) => ({
					title: language,
					value: iso6391,
				}));

			const uniqueLanguages = [
				...new Map(supportedLanguages.map((lang) => [
					lang.value,
					lang,
				])).values(),
			];

			return uniqueLanguages;
		},
	},

	mounted() {
		this.loadCategories();
		this.currentChoices.language = this.languages.find((language) => language.value === DEFAULT_LOCALE.code);
	},

	methods: {
		generateText() {
			this.initialChoices = {
				...this.currentChoices,
			};
			this.$emit('generate-text', {
				category: this.currentChoices.category.id,
				subcategory: this.currentChoices.subcategory.id,
				type: this.currentChoices.type.id,
				language: this.currentChoices.language.value,
			});
		},
		getCategoriesWithTranslations(categoriesData, translationBaseSlug) {
			return categoriesData
				.filter((category) => this.t(`${translationBaseSlug}${camelCase(category.id)}`))
				.map((category) => ({
					id: category.id,
					translation: this.t(`${translationBaseSlug}${camelCase(category.id)}`),
				}));
		},
		async loadCategories() {
			this.loading = true;
			const { data } = await getCategories();

			this.categories = this.getCategoriesWithTranslations(data, 'builder.AIWriter.categories.');
			this.loading = false;
		},
		async loadSubcategories() {
			this.loading = true;
			this.$emit('on-content-update');

			const { data } = await getSubcategories(this.currentChoices.category.id);

			this.currentChoices.category.subcategories = this.getCategoriesWithTranslations(data, 'builder.AIWriter.subcategories.');
			await this.$forceUpdate();
			this.$emit('on-content-update');
			this.loading = false;
		},
		async loadTypes() {
			this.loading = true;
			this.$emit('on-content-update');

			const { data } = await getTypes({
				category: this.currentChoices.category.id,
				subcategory: this.currentChoices.subcategory.id,
			});

			this.currentChoices.subcategory.types = this.getCategoriesWithTranslations(data, 'builder.AIWriter.types.');
			await this.$forceUpdate();
			this.$emit('on-content-update');
			this.loading = false;
		},
		async chooseCategory(category) {
			this.currentChoices.category = category;
			this.currentChoices.subcategory = null;
			this.currentChoices.type = null;
			if (!this.currentChoices.category.subcategories) {
				await this.loadSubcategories();
			} else {
				this.$emit('on-content-update');
			}
		},
		async chooseSubcategory(subcategory) {
			this.currentChoices.subcategory = subcategory;
			this.currentChoices.type = null;
			if (!this.currentChoices.subcategory.types) {
				await this.loadTypes();
			} else {
				this.$emit('on-content-update');
			}
		},
		async chooseType(type) {
			this.currentChoices.type = type;
			this.$emit('on-content-update');
		},
	},
});
</script>
<style lang="scss" scoped>
.choice-container {
	padding: 0 24px;
}

.options {
	display: flex;
	flex-wrap: wrap;

	&__toggle-button {
		margin-bottom: 24px;
		cursor: pointer;
	}

	&__category {
		margin-bottom: 24px;
		color: $color-gray;
	}
}

.selection-form {
	display: flex;
	flex-direction: column;
	height: 100%;

	&__button-container {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 24px 0;
		overflow: hidden;
		background-color: $color-light;
	}
}

.current-options {
	margin-bottom: 24px;

	&__option {
		font-weight: 300;
		color: $color-primary;

		&--blank {
			color: $color-gray;
		}
	}
}

.choice-list {
	&:not(:first-child) {
		margin-top: 30px;
	}

	&__title {
		display: flex;
		justify-content: space-between;
		padding-bottom: 8px;
		margin-bottom: 15px;
		border-bottom: 1px solid $color-gray-light;

		&--display-block {
			display: block;
		}
	}

	&__buttons {
		display: flex;
		flex-wrap: wrap;
	}

	&__button {
		padding: 7px 14px;
		margin: 0 10px 10px 0;
		color: $color-gray;
		text-transform: capitalize;
		background-color: $color-light;
		border: 1px solid $color-gray-border;
		border-radius: 16px;
		transition: all 0.2s;

		&:hover,
		&:focus {
			color: $color-primary-light;
			cursor: pointer;
			border: 1px solid $color-primary-light;
		}

		&--active {
			color: $color-primary;
			border-color: $color-primary;
		}
	}

	&__back-icon {
		cursor: pointer;
	}
}

.loader-wrapper {
	display: flex;
	justify-content: center;
}

.generate-button {
	&#{&} {
		&:disabled {
			color: $color-primary;
			background-color: $color-light;
			border-color: $color-primary;
			border-width: 1px;
		}
	}
}
</style>
