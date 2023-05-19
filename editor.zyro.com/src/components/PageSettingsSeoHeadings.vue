<template>
	<div class="page-settings-seo-headings">
		<h4 class="page-settings-seo-headings__heading">
			{{ $t('builder.pageSettingsSeoDrawerHeadingsTitleWhyItsImportant') }}
		</h4>
		<p class="page-settings-seo-headings__subheading">
			{{ $t('builder.pageSettingsSeoDrawerHeadingsTitleWhyItsImportantSubtitle') }}
		</p>

		<h4 class="page-settings-seo-headings__heading">
			{{ $t('builder.pageSettingsSeoDrawerHeadingsTitleWhatShouldYouDo') }}
		</h4>
		<ul class="page-settings-seo-headings__list">
			<li class="page-settings-seo-headings__subheading page-settings-seo-headings__list-item">
				{{ $t('builder.pageSettingsSeoDrawerHeadingsTitleWhatShouldYouDoFirstItem') }}
			</li>
			<li class="page-settings-seo-headings__subheading page-settings-seo-headings__list-item">
				{{ $t('builder.pageSettingsSeoDrawerHeadingsTitleWhatShouldYouDoSecondItem') }}
			</li>
			<li class="page-settings-seo-headings__subheading page-settings-seo-headings__list-item">
				{{ $t('builder.pageSettingsSeoDrawerHeadingsTitleWhatShouldYouDoThirdItem') }}
			</li>
		</ul>
		<a
			href="https://support.hostinger.com/en/articles/6466509-website-builder-how-to-use-header-tags-for-seo"
			target="_blank"
			class="page-settings-seo-headings__link"
		>
			{{ $t('builder.pageSettingsSeoDrawerHeadingsLink') }}
		</a>

		<ZyroButton
			v-if="pageMetaKeywords.length > 0 && !suggestions.length"
			class="page-settings-seo-headings__suggestions-button"
			theme="primary"
			:disabled="areHeadingSuggestionsBeingGenerated"
			:title="$t('builder.pageSettingsSeoDrawerHeadingsButtonGenerate')"
			@click="generateHeadingSuggestions"
		>
			<template v-if="areHeadingSuggestionsBeingGenerated">
				{{ $t('builder.pageSettingsSeoDrawerHeadingsButtonGenerating') }}
				<ZyroLoader
					class="page-settings-seo-headings__button-icon"
					color="var(--color-primary)"
					size="16px"
					weight="3px"
				/>
			</template>
			<template v-else>
				{{ $t('builder.pageSettingsSeoDrawerHeadingsButtonGenerate') }}
				<Icon
					name="auto_fix_high"
					dimensions="20px"
					class="page-settings-seo-headings__button-icon"
				/>
			</template>
		</ZyroButton>

		<div
			v-if="suggestions.length"
			class="ai-suggestions-table"
		>
			<div class="ai-suggestions-table__header">
				<Icon
					name="auto_fix_high"
					dimensions="20px"
					class="ai-suggestions-table__header-wand-icon"
				/>
				<h3 class="ai-suggestions-table__header-title">
					{{ $t('builder.pageSettingsSeoDrawerHeadingsSuggestionsTableTitle') }}
				</h3>
				<ZyroLoader
					v-if="areHeadingSuggestionsBeingGenerated"
					color="var(--color-primary)"
					size="16px"
					weight="3px"
				/>
				<ZyroSvgDeprecated
					v-else
					name="rotate"
					class="ai-suggestions-table__action-icon"
					@click="generateHeadingSuggestions"
				/>
			</div>
			<div class="ai-suggestions-table__rows">
				<div
					v-for="suggestion in suggestions"
					:key="suggestion.title"
					class="ai-suggestions-table__row"
				>
					<div class="ai-suggestions-table__row-content">
						<div class="ai-suggestions-table__suggestion">
							<p class="ai-suggestions-table__suggestion-title">
								{{ suggestion.suggestion }}
							</p>
							<p class="ai-suggestions-table__suggestion-subtitle">
								{{ $t('builder.pageSettingsSeoDrawerHeadingsSuggestionsTableKeywordUsed') }} {{ suggestion.keyword }}
							</p>
						</div>
						<ZyroTooltip
							position="right"
							size="small"
							toggle-event="hover"
							content-position="absolute"
							use-portal
							mode="dark"
						>
							<template #trigger>
								<div class="ai-suggestions-table__copy-icon-wrapper">
									<ZyroSvgDeprecated
										class="ai-suggestions-table__action-icon  ai-suggestions-table__action-icon--copy"
										name="copy"
										@click="copyToClipboard({ text: suggestion.suggestion })"
									/>
								</div>
							</template>
							<slot name="tooltip-content">
								{{ $t('common.copy') }}
							</slot>
						</ZyroTooltip>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import ZyroButton from '@/components/global/ZyroButton.vue';
import Icon from '@/components/global/Icon.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';
import ZyroLoader from '@zyro-inc/site-modules/components/ZyroLoader.vue';
import ZyroTooltip from '@/components/global/ZyroTooltip.vue';
import {
	defineComponent,
	ref,
} from 'vue';
import {
	useApi,
	AI_SEO_HEADINGS,
} from '@/use/useApi';
import { usePageSettingsSeo } from '@/use/usePageSettingsSeo';

export default defineComponent({
	components: {
		ZyroTooltip,
		ZyroButton,
		ZyroSvgDeprecated,
		ZyroLoader,
		Icon,
	},
	props: {
		pageId: {
			type: String,
			required: true,
		},
	},
	setup(props) {
		const {
			callApi,
			result,
			hasFailed,
		} = useApi();
		const { pageMetaKeywords } = usePageSettingsSeo({
			pageId: props.pageId,
		});
		const areHeadingSuggestionsBeingGenerated = ref(false);
		const suggestions = ref([]);

		const generateHeadingSuggestions = async () => {
			areHeadingSuggestionsBeingGenerated.value = true;

			await callApi(AI_SEO_HEADINGS, {
				method: 'post',
				data: {
					keywords: pageMetaKeywords.value,
				},
			});

			if (hasFailed.value) {
				areHeadingSuggestionsBeingGenerated.value = false;

				return;
			}

			suggestions.value = result.value.map((suggestion, index) => ({
				suggestion,
				keyword: pageMetaKeywords.value[index],
			}));

			areHeadingSuggestionsBeingGenerated.value = false;
		};

		const copyToClipboard = ({ text }) => {
			navigator.clipboard.writeText(text);
		};

		return {
			pageMetaKeywords,
			areHeadingSuggestionsBeingGenerated,
			generateHeadingSuggestions,
			suggestions,
			copyToClipboard,
		};
	},
});
</script>
<style lang="scss" scoped>
.page-settings-seo-headings {
	&__heading {
		margin-bottom: 8px;
		font-size: 14px;
		font-weight: 700;
		line-height: 1.71;
	}

	&__subheading {
		margin-bottom: 16px;
		font-size: 14px;
		font-weight: 400;
		line-height: 1.71;
		color: $color-gray;
	}

	&__list {
		margin-left: 14px;
	}

	&__list-item {
		margin-bottom: 8px;
	}

	&__link {
		display: block;
		font-size: 14px;
		font-weight: 400;
		line-height: 1.71;
		color: $color-primary;
		margin-bottom: 24px;
	}

	&__button-icon {
		margin-left: 8px;
	}
}

.ai-suggestions-table {
	border: 1px solid $color-gray-border;
	border-radius: 4px;

	$this: &;

	&__header {
		padding: 8px 16px;
		display: flex;
		align-items: center;
		background-color: $color-gray-light;
		border-bottom: 1px solid $color-gray-border;
	}

	&__header-wand-icon {
		color: $color-primary;
		margin-right: 8px;
	}

	&__header-title {
		font-weight: 700;
		font-size: 14px;
		line-height: 1.71;
		margin-right: auto;
	}

	&__row {
		padding: 8px 16px 0;

		&:not(:last-child) {
			#{$this}__row-content {
				border-bottom: 1px solid $color-gray-border;
			}
		}
	}

	&__row-content {
		padding-bottom: 8px;
		display: flex;
		gap: 8px;
		align-items: center;
	}

	&__suggestion {
		display: flex;
		flex-direction: column;
	}

	&__suggestion-title {
		font-weight: 400;
		font-size: 14px;
		line-height: 1.71;
	}

	&__suggestion-subtitle {
		font-weight: 400;
		font-size: 12px;
		line-height: 1.67;
		color: $color-gray;
	}

	&__action-icon {
		cursor: pointer;

		&:hover,
		&:focus {
			color: $color-primary;
		}

		&--copy {
			cursor: copy;
		}
	}
}
</style>
