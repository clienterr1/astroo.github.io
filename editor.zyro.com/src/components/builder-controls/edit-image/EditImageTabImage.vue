<template>
	<div>
		<ZyroImageSelector
			:origin="currentElementSettings.origin"
			:path="currentElementSettings.path"
			:object-fit="objectFit"
			@update="setImage"
		/>
		<AiRecommendation v-if="!isDemoMode && !isHostingerBrand">
			<i18n-t
				tag="p"
				keypath="builder.editImage.tabSeo.AIRecommendationImageTools"
			>
				<a
					target="_blank"
					class="z-link z-link--dark"
					href="https://zyro.com/tools/image-background-remover?ref=builder"
				>
					{{ $t('builder.editImage.tabSeo.AIRecommendationSlotBackgroundRemoval') }}
				</a>
				<a
					target="_blank"
					class="z-link z-link--dark"
					href="https://zyro.com/tools/image-upscaler?ref=builder"
				>
					{{ $t('builder.editImage.tabSeo.AIRecommendationSlotUpscale') }}
				</a>
				<a
					target="_blank"
					class="z-link z-link--dark"
					href="https://zyro.com/tools/image-resizer?ref=builder"
				>
					{{ $t('builder.editImage.tabSeo.AIRecommendationSlotResize') }}
				</a>
			</i18n-t>
		</AiRecommendation>
		<div class="edit-image-tab-seo">
			<ZyroFieldInput
				:id="`${currentElementId}alt`"
				:model-value="altText"
				maxlength="100"
				:label="$t('builder.editImage.tabSeo.textFieldLabel')"
				@update:model-value="updateAltText({ altValue: $event })"
			>
				<template #sublabel>
					<p class="z-body-small edit-image-tab-seo__text">
						{{ $t('builder.editImage.tabSeo.label') }}
					</p>
				</template>
				<template
					v-if="isAiGeneratingEnabled"
					#message
				>
					<button
						class="edit-image-tab-seo__suggestion-button"
						:disabled="isAltTagSuggestionGenerating"
						:title="$t('builder.suggestUsingAi')"
						@click="handleAltGenerateClick"
					>
						<Transition
							name="fade"
							mode="out-in"
						>
							<div
								v-if="isAltTagSuggestionGenerating"
								class="edit-image-tab-seo__suggestion-button-content"
							>
								<ZyroLoader
									color="var(--color-primary)"
									size="16px"
									weight="3px"
									class="edit-image-tab-seo__suggestion-icon"
								/>
								{{ $t('builder.pageSettingsSeoDrawerHeadingsButtonGenerating') }}
							</div>
							<div
								v-else
								class="edit-image-tab-seo__suggestion-button-content"
							>
								<ZyroSvgDeprecated
									name="wand"
									class="edit-image-tab-seo__suggestion-icon"
								/>
								{{ $t('builder.suggestUsingAi') }}
							</div>
						</Transition>
					</button>
				</template>
			</ZyroFieldInput>
		</div>
	</div>
</template>

<script>
import ZyroLoader from '@zyro-inc/site-modules/components/ZyroLoader.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';
import ZyroFieldInput from '@/components/global/ZyroFieldInput.vue';
import ZyroImageSelector from '@/components/global/ZyroImageSelector.vue';
import { useI18n } from 'vue-i18n';
import { GAMIFICATION_TASK_UPDATE_IMAGE } from '@/constants';
import { useGamification } from '@/use/useGamification';

import {
	mapActions,
	useStore,
} from 'vuex';

import AiRecommendation from '@/components/ui/AiRecommendation.vue';
import { isHostingerBrand } from '@/utils/isHostingerBrand';
import { createImageAltTag } from '@/api/AiApi';
import {
	defineComponent,
	ref,
	computed,
} from 'vue';
import { getImageSrc } from '@zyro-inc/site-modules/utils/getImageSrc';
import { useNotifications } from '@/use/useNotifications';
import { captureException } from '@sentry/browser';

const ORIGIN_UNSPLASH = 'unsplash';
const ORIGIN_OTHER = 'other';

export default defineComponent({
	components: {
		ZyroFieldInput,
		ZyroImageSelector,
		AiRecommendation,
		ZyroLoader,
		ZyroSvgDeprecated,
	},

	setup() {
		const {
			state,
			getters,
			dispatch,
		} = useStore();
		const { notify } = useNotifications();
		const { completeAchievement } = useGamification();
		const { t } = useI18n();

		const isAltTagSuggestionGenerating = ref(false);
		const currentElementSettings = computed(() => getters.currentElementSettings);
		const currentElementStyles = computed(() => getters.currentElementStyles);
		const isMobileMode = computed(() => getters['gui/isMobileMode']);
		const websiteId = computed(() => state.websiteId);
		const currentElementId = computed(() => state.currentElementId);
		const isDemoMode = computed(() => state.isDemoMode);
		const isAiGeneratingEnabled = computed(() => ![
			ORIGIN_UNSPLASH,
			ORIGIN_OTHER,
		].includes(currentElementSettings.value.origin));

		const updateAltText = ({ altValue }) => {
			dispatch('mergeCurrentElementData', {
				elementData: {
					settings: {
						alt: altValue,
					},
				},
			});
		};

		const handleAltGenerateClick = async () => {
			const imageUrl = getImageSrc(currentElementSettings.value.origin, currentElementSettings.value.path, websiteId.value);

			isAltTagSuggestionGenerating.value = true;

			try {
				const { data } = await createImageAltTag({
					imageUrl,
				});

				updateAltText({
					altValue: data.caption,
				});
			} catch (error) {
				captureException(error);
				notify({
					message: t('builder.altGenerationFailed'),
					origin: 'EditImageTabImage.vue',
				});
			} finally {
				isAltTagSuggestionGenerating.value = false;
			}
		};

		return {
			isAiGeneratingEnabled,
			isHostingerBrand,
			isAltTagSuggestionGenerating,
			handleAltGenerateClick,
			currentElementSettings,
			currentElementStyles,
			currentElementId,
			isDemoMode,
			isMobileMode,
			updateAltText,
			completeAchievement,
		};
	},

	computed: {
		objectFit: {
			get() {
				return this.currentElementStyles['object-fit'] || 'cover';
			},
			set(newValue) {
				this.mergeCurrentElementData({
					elementData: {
						settings: {
							styles: {
								'object-fit': newValue,
							},
						},
					},
				});
			},
		},
		altText() {
			return this.currentElementSettings.alt;
		},
	},

	methods: {
		...mapActions(['mergeCurrentElementData']),
		setImage({
			origin,
			path,
			alt,
			fullResolutionWidth,
			fullResolutionHeight,
		}) {
			this.mergeCurrentElementData({
				elementData: {
					fullResolutionWidth,
					fullResolutionHeight,
					settings: {
						path,
						origin,
						alt,
					},
				},
			});

			this.completeAchievement(GAMIFICATION_TASK_UPDATE_IMAGE);
		},
	},
});
</script>
<style scoped lang="scss">
.edit-image-tab-seo {
	&__text {
		margin-bottom: 4px;
	}

	&__suggestion-button {
		color: $color-primary;
		margin-top: 6px;
		cursor: pointer;
	}

	&__suggestion-button-content {
		display: flex;
		align-items: center;
	}

	&__suggestion-icon {
		margin-right: 8px;
	}
}
</style>
