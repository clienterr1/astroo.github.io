<template>
	<ZyroDrawer class="multilingual-drawer">
		<div
			v-qa="'builder-sidemenu-websitemenu'"
			class="multilingual-drawer__wrapper"
		>
			<div class="multilingual-drawer__header">
				<h2 class="multilingual-drawer__title z-h5">
					{{ $t('builder.multilingualDrawerTitle') }}
				</h2>
				<p class="multilingual-drawer__intro z-body-small">
					{{ $t('builder.multilingualDrawerDescription') }}
					<!-- This link will be used later, when learn more text will be prepared. Do not delete
					<a
						href="#"
						class="multilingual-drawer__link"
					>
						{{ $t('common.learnMore') }}
					</a> -->
				</p>
			</div>
			<MultilingualAddLanguage class="multilingual-drawer__add-language" />
			<div class="multilingual-drawer__content">
				<EditableItemsList
					v-if="currentLanguageList.length > 0"
					v-qa="'buildersidebar-multilingual-visiblepages'"
					class="multilingual-drawer__language-list"
					:items="currentLanguageList"
					:is-editable-by-double-click="false"
					@item-click="handleLanguageClick"
					@draggable-end="reorderLanguages"
				>
					<template #item-button="{ item }">
						<MultilingualListItemPopup :item="item" />
					</template>
				</EditableItemsList>
				<div
					v-if="currentLanguageList.length > 0"
					class="multilingual-drawer__description z-body-small"
				>
					<p>
						{{ $t('builder.multilingualDrawerDefaultLangDescription') }}
					</p>
					<p>
						{{ $t('builder.multilingualDrawerDefaultLangNote') }}
					</p>
				</div>
				<ol
					v-if="currentLanguageList.length < 2"
					class="multilingual-drawer__tutorial"
				>
					<ZyroSvgDeprecated
						name="question-circle"
						direction="up"
						class="multilingual-drawer__help-icon"
					/>
					<li class="multilingual-drawer__tutorial-step">
						{{ $t('builder.multilingualDrawerHelpSteps.selectStartingLanguage') }}
					</li>
					<li class="multilingual-drawer__tutorial-step">
						{{ $t('builder.multilingualDrawerHelpSteps.setupOriginal') }}
					</li>
					<li class="multilingual-drawer__tutorial-step">
						{{ $t('builder.multilingualDrawerHelpSteps.fullControl') }}
					</li>
				</ol>
				<ZyroFieldToggle
					v-if="hasLanguages"
					id="hideLanguageSwitcherToggle"
					class="multilingual-drawer__languages-toggle"
					toggle-data-qa="toggle-hide-language"
					:label="$t('builder.multilingualDrawerHideSwitcher')"
					:model-value="isLanguageSwitcherHidden"
					:bold="false"
					@update:model-value="handleLanguageSwitcherClick"
				/>
				<NpsRateFeature
					:feature-name="$t('builder.npsRateMultilingual')"
					:type="NPS_TYPE_FEATURE_MULTILINGUAL"
				/>
			</div>
		</div>
	</ZyroDrawer>
</template>

<script>
import ZyroDrawer from '@/components/global/ZyroDrawer.vue';
import ZyroFieldToggle from '@/components/global/ZyroFieldToggle.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import {
	mapGetters,
	mapActions,
} from 'vuex';

import MultilingualAddLanguage from '@/components/multilingual/MultilingualAddLanguage.vue';
import MultilingualListItemPopup from '@/components/multilingual/MultilingualListItemPopup.vue';
import EditableItemsList from '@/components/reusable-components/editable-items-list/EditableItemsList.vue';
import NpsRateFeature from '@/components/ui/NpsRateFeature.vue';
import { NPS_TYPE_FEATURE_MULTILINGUAL } from '@/constants';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroDrawer,
		ZyroFieldToggle,
		ZyroSvgDeprecated,
		EditableItemsList,
		MultilingualListItemPopup,
		MultilingualAddLanguage,
		NpsRateFeature,
	},

	data() {
		return {
			NPS_TYPE_FEATURE_MULTILINGUAL,
		};
	},

	computed: {
		...mapGetters([
			'siteLanguagesArray',
			'siteLanguages',
			'hasLanguages',
			'defaultLocale',
			'isLanguageSwitcherHidden',
		]),
		currentLanguageList() {
			return this.siteLanguagesArray.map((language) => ({
				...language,
				image: {
					src: `i18n/${language.locale}.png`,
					alt: `${language.locale} Flag`,
				},
				pill: language.locale === this.defaultLocale ? this.$t('builder.multilingualDrawerDefault') : false,
				type: 'Multilingual',
				isDisabled: language.isHidden,
			}));
		},
	},

	methods: {
		...mapActions([
			'updateDefaultLocale',
			'updateLanguages',
			'updateBlockData',
			'updateCurrentLocale',
		]),
		reorderLanguages({
			newIndex,
			oldIndex,
		}) {
			const {
				system,
				...restLanguages
			} = this.siteLanguages;
			const LanguageEntries = Object.entries(restLanguages);

			const language = LanguageEntries[oldIndex];

			LanguageEntries.splice(oldIndex, 1);
			LanguageEntries.splice(newIndex, 0, language);

			const reorderedLanguages = Object.fromEntries(LanguageEntries);

			this.updateLanguages({
				system,
				...reorderedLanguages,
			});
		},
		handleLanguageClick(language) {
			this.updateCurrentLocale(language.locale);
		},
		handleLanguageSwitcherClick(isHidden) {
			this.updateBlockData({
				blockId: 'header',
				blockData: {
					settings: {
						isLanguageSwitcherHidden: isHidden,
					},
				},
				merge: true,
			});
		},
	},
});
</script>

<style lang="scss" scoped>
.multilingual-drawer {
	display: flex;
	flex-direction: column;
	align-items: center;
	height: 100%;
	overflow: auto;

	&__header {
		padding: 24px 24px 0;
	}

	&__title {
		margin-bottom: 8px;
	}

	&__language-list {
		margin-top: 0;
	}

	&__description {
		margin: 16px 0 24px;
		color: $color-gray;

		& p:nth-child(2) {
			margin-top: 8px;
			font-weight: bold;
		}
	}

	&__intro {
		color: $color-gray;
	}

	&__tutorial {
		position: relative;
		margin: 0 32px 0 72px;
		color: $color-gray;
	}

	&__tutorial-step {
		margin-bottom: 16px;
		font-size: 14px;
		line-height: 1.2857;
	}

	&__help-icon {
		position: absolute;
		top: 0;
		left: -45px;
		color: $color-gray;
	}

	&__dropdown {
		width: 88%;
		margin-top: 29px;
		margin-bottom: 0;
		border-bottom: 1px solid $color-gray-light;
	}

	&__content {
		flex: 1;
		padding: 0 16px;
	}

	&__add-language {
		position: relative;
		z-index: 2;
		padding: 16px 16px 0;
	}

	&__languages-toggle {
		padding-bottom: 0;
		margin-bottom: 32px;
		border-top: 1px solid $color-gray-border;
	}

	:deep() {
		.item {
			&--disabled {
				.tooltip,
				.flag-container,
				.trigger,
				.item {
					&__content {
						opacity: 0.4;
					}
				}
			}
		}
	}
}

</style>
