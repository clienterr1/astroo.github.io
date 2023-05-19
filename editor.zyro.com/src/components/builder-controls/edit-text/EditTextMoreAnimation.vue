<template>
	<EditTextMoreItem
		:title="$t('common.animation')"
		direction="row"
	>
		<button
			ref="animationButtonRef"
			class="select-button"
			@click="isAnimationSelectOpen = !isAnimationSelectOpen"
		>
			<p>
				{{ selectedAnimationName }}
			</p>
			<ZyroSvgDeprecated
				class="select-button__icon"
				name="chevron"
				direction="down"
			/>
		</button>
		<Popup
			v-if="isAnimationSelectOpen"
			:target-ref="animationButtonRef"
			placement="bottom-start"
			auto-update
			:offset="4"
			portal-selector="[data-portal='builder-preview']"
			@click-outside="isAnimationSelectOpen = false"
		>
			<div class="select">
				<button
					v-for="(animation, key) in ANIMATION_TYPES"
					:key="key"
					class="select__button"
					:class="{ 'select__button--active': animationType === key }"
					@click="handleAnimationClick(key)"
				>
					{{ animation.name }}
				</button>
			</div>
		</Popup>
	</EditTextMoreItem>
</template>

<script>
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import { useStore } from 'vuex';
import EditTextMoreItem from '@/components/builder-controls/edit-text/EditTextMoreItem.vue';
import { useSiteEngineAnimations } from '@zyro-inc/site-modules/use/useSiteEngineAnimations';
import { ANIMATION_TYPE_ELEMENT } from '@zyro-inc/site-modules/constants';
import {
	defineComponent,
	computed,
	ref,
} from 'vue';
import { useI18n } from 'vue-i18n';
import Popup from '@/components/global/Popup.vue';
import EventLogApi from '@/api/EventLogApi';

export default defineComponent({
	components: {
		EditTextMoreItem,
		Popup,
		ZyroSvgDeprecated,
	},
	setup() {
		const {
			getters,
			state,
			dispatch,
		} = useStore();
		const { displayAnimationInEditor } = useSiteEngineAnimations();
		const { t } = useI18n();
		const { siteLanguages } = getters;
		const isAnimationSelectOpen = ref(false);
		const animationButtonRef = ref(null);
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
		const currentElementId = computed(() => getters.currentElementId);
		const elementData = computed(() => siteLanguages[currentLocale.value].elements[currentElementId.value]);
		const animationType = computed(() => elementData.value.animation?.name);
		const selectedAnimationName = computed(() => (
			animationType.value ? ANIMATION_TYPES[animationType.value].name : ANIMATION_TYPES.none.name
		));

		const handleAnimationClick = (animationName) => {
			const modifiedAnimationName = animationName === 'none' ? null : animationName;

			isAnimationSelectOpen.value = false;

			displayAnimationInEditor({
				animation: animationName,
				id: currentElementId.value,
			});

			dispatch('mergeElementData', {
				elementId: currentElementId.value,
				elementData: {
					animation: modifiedAnimationName ? {
						name: modifiedAnimationName,
						type: ANIMATION_TYPE_ELEMENT,
					} : null,
				},
				pushToHistory: true,
				locale: state.currentLocale,
			});

			EventLogApi.logEvent({
				eventName: 'website_builder.styles_animation_style.selected',
				eventProperties: {
					animation: animationName,
					type: ANIMATION_TYPE_ELEMENT,
					location: currentElementId.value,
				},
				isHostingerEvent: true,
			});
		};

		return {
			ANIMATION_TYPES,
			handleAnimationClick,
			isAnimationSelectOpen,
			animationButtonRef,
			animationType,
			selectedAnimationName,
		};
	},
});
</script>

<style lang="scss" scoped>
.select-button {
	display: flex;
	align-items: center;
	justify-content: center;
	justify-content: space-between;
	width: 120px;
	height: 30px;
	padding: 8px;
	font-size: 12px;
	cursor: pointer;
	border: 1px solid $color-gray-border;
	border-radius: 6px;

	&__icon {
		color: $color-gray;
	}
}

.select {
	display: flex;
	flex-direction: column;
	width: 120px;
	padding: 8px 0;
	overflow: hidden;
	font-size: 12px;
	background: $color-light;
	border-radius: $border-radius-small;
	box-shadow: $box-shadow;

	&__button {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: 6px 16px;
		text-align: start;
		cursor: pointer;

		&:hover {
			cursor: pointer;
			background-color: $color-gray-light;
		}

		&--active {
			background-color: $color-gray-light;
		}
	}
}
</style>
