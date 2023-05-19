<template>
	<div class="animations-library">
		<p
			v-if="!elementId"
			class="animations-library__text z-body-small"
		>
			{{ $t('builder.animationsSettingsExplanation') }}
		</p>
		<ZyroIconSelect
			:model-value="animationType"
			:options="ANIMATION_TYPES"
			:items-per-row="2"
			icon-container-padding="0"
			group-name="animations"
			active-background-color="var(--color-azure-lighter)"
			class="animations-library__select z-body-small"
			@update:model-value="setAnimation"
			@option-click="displayAnimationInEditor({
				animation: $event,
				id: elementId
			})"
		/>
		<i18n-t
			v-if="!elementId"
			tag="p"
			keypath="builder.animationsSettingsText"
			class="animations-library__text z-body-small"
		>
			<a
				class="animations-library__link"
				@click="openPreview"
			>
				{{ $t('builder.animationsPreviewMode') }}
			</a>
		</i18n-t>
	</div>
	<NpsRateFeature
		v-if="!elementId"
		:feature-name="$t('builder.npsRateGlobalStyles')"
		:type="NPS_TYPE_FEATURE_GLOBAL_STYLES_ANIMATION"
	/>
</template>

<script>
import NpsRateFeature from '@/components/ui/NpsRateFeature.vue';
import EventLogApi from '@/api/EventLogApi';
import { useI18n } from 'vue-i18n';
import { isHostingerBrand } from '@/utils/isHostingerBrand';
import { PREVIEW_ROUTE } from '@/constants/routes';
import { useStore } from 'vuex';

import {
	defineComponent,
	computed,
} from 'vue';
import ZyroIconSelect from '@/components/global/ZyroIconSelect.vue';
import { useSiteEngineAnimations } from '@zyro-inc/site-modules/use/useSiteEngineAnimations';
import {
	getAnimatableBlocks,
	getAnimatableElements,
} from '@/utils/siteEngineAnimations';
import {
	ANIMATION_TYPE_GLOBAL,
	ANIMATION_TYPE_ELEMENT,
} from '@zyro-inc/site-modules/constants';
import { useRouter } from 'vue-router';
import { NPS_TYPE_FEATURE_GLOBAL_STYLES_ANIMATION } from '@/constants';
import { removeNullishEntries } from '@zyro-inc/site-modules/utils/object';

export default defineComponent({
	components: {
		NpsRateFeature,
		ZyroIconSelect,
	},
	props: {
		elementId: {
			type: String,
			default: '',
		},
	},
	setup(props) {
		const {
			state,
			getters,
			dispatch,
		} = useStore();
		const router = useRouter();
		const { t } = useI18n();
		const { displayAnimationInEditor } = useSiteEngineAnimations();
		const { siteLanguages } = getters;

		const ANIMATION_TYPES = {
			none: {
				name: t('builder.animationsSettingsNoAnimation'),
				icon: 'crossed-circle',
				iconDimensions: '48px',
			},
			fade: {
				name: t('builder.animationsSettingsFade'),
				icon: 'rectangle-grey',
				iconDimensions: '84px',
			},
			slide: {
				name: t('builder.animationsSettingsSlide'),
				icon: 'slide-animation',
				iconDimensions: '84px',
			},
			scale: {
				name: t('builder.animationsSettingsScale'),
				icon: 'scale-animation',
				iconDimensions: '84px',
			},
		};

		const currentLocale = computed(() => state.currentLocale);
		const allSiteBlocks = computed(() => {
			const langBlocks = Object.keys(siteLanguages).map((lang) => siteLanguages[lang].blocks);

			return Object.fromEntries(langBlocks.flatMap((blocks) => Object.entries(blocks)));
		});
		const allSiteElements = computed(() => {
			const langElements = Object.keys(siteLanguages).map((lang) => siteLanguages[lang].elements);

			return Object.fromEntries(langElements.flatMap((elements) => Object.entries(elements)));
		});
		const animatableBlocks = computed(() => getAnimatableBlocks({
			blocks: allSiteBlocks.value,
		}));
		const animatableBlocksByLocale = computed(() => Object.fromEntries(Object.entries(siteLanguages).map(([lang, value]) => [
			lang,
			getAnimatableBlocks({
				blocks: value.blocks,
			}),
		])));
		const animatableElements = computed(() => getAnimatableElements({
			elements: allSiteElements.value,
		}));
		const animatableElementsByLocale = computed(() => Object.fromEntries(Object.entries(siteLanguages).map(([lang, value]) => [
			lang,
			getAnimatableElements({
				elements: value.elements,
			}),
		])));
		const animationType = computed(() => {
			const itemWithGlobalAnimation = [
				...Object.values(animatableBlocks.value),
				...Object.values(animatableElements.value),
			].find((item) => item.animation?.type === ANIMATION_TYPE_GLOBAL);
			const elementAnimation = siteLanguages[currentLocale.value].elements[props.elementId]?.animation;

			if (elementAnimation) {
				return elementAnimation.name;
			}

			if ((props.elementId && !elementAnimation) || !itemWithGlobalAnimation) {
				return 'none';
			}

			return itemWithGlobalAnimation.animation.name;
		});

		const openPreview = () => {
			router.push({
				name: PREVIEW_ROUTE,
			});

			EventLogApi.logEvent({
				eventName: 'website_builder.builder.previewed',
				isHostingerEvent: true,
			});
		};

		const getAnimationName = (animation) => (animation === 'none' ? null : animation);

		const setAnimationForElement = ({
			animationName,
			elementId,
			type,
			locale,
		}) => {
			dispatch('mergeElementData', {
				elementId,
				elementData: {
					animation: animationName ? {
						name: animationName,
						type,
					} : null,
				},
				pushToHistory: true,
				locale,
			});
		};

		const setAnimationForBlock = ({
			animationName,
			block,
			blockId,
			type,
			locale,
		}) => {
			const blockCopy = {
				...block,
				animation: animationName ? {
					name: animationName,
					type,
				} : null,
			};

			const cleanedBlockData = removeNullishEntries(blockCopy);

			dispatch('updateBlockData', {
				blockId,
				blockData: cleanedBlockData,
				pushToHistory: true,
				locale,
			});
		};

		const setAnimation = (animation) => {
			if (animationType.value === animation) {
				return;
			}

			const animationName = getAnimationName(animation);

			// Set element-based animation or global animations
			if (props.elementId) {
				setAnimationForElement({
					animationName,
					elementId: props.elementId,
					type: ANIMATION_TYPE_ELEMENT,
					locale: currentLocale.value,
				});
			} else {
				// Handle blocks
				Object.entries(animatableBlocksByLocale.value).forEach(([locale, blocks]) => {
					Object.keys(blocks).forEach((key) => {
						setAnimationForBlock({
							animationName,
							blockId: key,
							type: ANIMATION_TYPE_GLOBAL,
							locale,
							block: blocks[key],
						});
					});
				});

				// Handle elements
				Object.entries(animatableElementsByLocale.value).forEach(([locale, elements]) => {
					Object.keys(elements).forEach((key) => {
						setAnimationForElement({
							animationName,
							elementId: key,
							type: ANIMATION_TYPE_GLOBAL,
							locale,
						});
					});
				});
			}

			dispatch('undoRedo/createSnapshot');

			if (isHostingerBrand) {
				EventLogApi.logEvent({
					eventName: 'website_builder.styles_animation_style.selected',
					eventProperties: {
						animation,
						type: props.elementId ? ANIMATION_TYPE_ELEMENT : ANIMATION_TYPE_GLOBAL,
						location: props.elementId || 'drawer',
					},
					isHostingerEvent: true,
				});
			}
		};

		return {
			ANIMATION_TYPES,
			NPS_TYPE_FEATURE_GLOBAL_STYLES_ANIMATION,
			displayAnimationInEditor,
			animationType,
			openPreview,
			setAnimation,
		};
	},
});
</script>

<style lang="scss" scoped>
.animations-library {
	&__text,
	&__select {
		margin-bottom: 24px;
		color: $color-gray;
	}

	&__link {
		color: $color-primary;
		text-decoration: underline;
		cursor: pointer;
	}

	&__select {
		:deep(.icon) {
			color: $color-gray;
		}
	}
}
</style>
