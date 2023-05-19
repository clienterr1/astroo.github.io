<template>
	<div>
		<ZyroFieldInput
			:id="`${currentElementId}-text`"
			:label="$t('builder.editVideo.tabAction.label')"
			:error="!isUrlValid && $t('validate.url')"
			:model-value="srcInput"
			input-data-qa="edit-video-popup-action-input-url"
			@update:model-value="srcInput = $event.trim()"
		/>
		<div class="preview">
			<GridVideo
				data-qa="edit-video-popup-action-video"
				v-bind="composedProps"
			/>
		</div>
		<div class="toggle-container">
			<ZyroFieldToggle
				v-for="toggle in optionsToggles"
				:id="`${toggle.paramKey}-toggle`"
				:key="toggle.paramKey"
				:model-value="toggle.paramValue === TRUTHY_PARAM_VALUE"
				:label="toggle.paramLabel"
				:message="toggle.message"
				:disabled="!isUrlValid"
				:data-qa="toggle.qaAttribute"
				@update:model-value="handleToggleChange(toggle.paramKey, toggle.paramValue)"
			/>
		</div>
	</div>
</template>

<script>

import cloneDeep from 'lodash.clonedeep';
import {
	ref,
	reactive,
	watchEffect, // onBeforeUnmount,
	defineComponent,
} from 'vue';
import { useStore } from 'vuex';

import GridVideo from '@zyro-inc/site-modules/components/elements/video/GridVideo.vue';
import {
	URL_PARAMS,
	FALSY_PARAM_VALUE,
	TRUTHY_PARAM_VALUE,
	DEFAULT_WIDTH,
	DEFAULT_HEIGHT,
	DEFAULT_URL,
	DEFAULT_PROVIDER,
	DEFAULT_AUTOPLAY_VALUE,
	DEFAULT_LOOP_VALUE,
	DEFAULT_CONTROLS_VALUE,
} from '@zyro-inc/site-modules/components/elements/video/constants';
import {
	extractVideoProps,
	extractVideoParams,
} from '@zyro-inc/site-modules/components/elements/video/extractVideoProps';

import { useI18n } from 'vue-i18n';
import {
	NOTIFICATIONS_NAMESPACE,
	NOTIFY,
} from '@/store/builder/notifications';
import ZyroFieldInput from '@/components/global/ZyroFieldInput.vue';
import ZyroFieldToggle from '@/components/global/ZyroFieldToggle.vue';

export default defineComponent({
	components: {
		ZyroFieldInput,
		ZyroFieldToggle,
		GridVideo,
	},

	setup() {
		const {
			state,
			getters,
			dispatch,
		} = useStore();
		const { currentElementId } = state;
		const initialCurrentElement = cloneDeep(getters.currentElement);
		const initialSettings = initialCurrentElement.settings;

		const sourceInput = ref(initialSettings.initialSrc ?? initialSettings.src ?? DEFAULT_URL);
		const extractedParameters = extractVideoParams(initialSettings.src) ?? {};

		const isUrlValid = ref(true);

		const composedProperties = reactive({
			initialSrc: initialSettings.initialSrc ?? DEFAULT_URL,
			src: initialSettings.src ?? DEFAULT_URL,
			provider: initialSettings.provider ?? DEFAULT_PROVIDER,
			webp: initialSettings.webp,
			jpg: initialSettings.jpg,
			width: initialSettings.width ?? DEFAULT_WIDTH,
			height: initialSettings.height ?? DEFAULT_HEIGHT,
		});

		const { t } = useI18n();

		// get option toggle values from initial url
		const optionsToggles = reactive({
			[URL_PARAMS.AUTOPLAY]: {
				paramKey: URL_PARAMS.AUTOPLAY,
				paramLabel: t('builder.editVideo.tabAction.modifiers.autoplay'),
				paramValue: extractedParameters[URL_PARAMS.AUTOPLAY] ?? DEFAULT_AUTOPLAY_VALUE,
				qaAttribute: 'edit-video-popup-action-toggle-autoplay',
				message: t('builder.editVideo.tabAction.autoplayMessage'),
			},
			[URL_PARAMS.LOOP]: {
				paramKey: URL_PARAMS.LOOP,
				paramLabel: t('builder.editVideo.tabAction.modifiers.loop'),
				paramValue: extractedParameters[URL_PARAMS.LOOP] ?? DEFAULT_LOOP_VALUE,
				qaAttribute: 'edit-video-popup-action-toggle-loop',
			},
			[URL_PARAMS.CONTROLS]: {
				paramKey: URL_PARAMS.CONTROLS,
				paramLabel: t('builder.editVideo.tabAction.modifiers.controls'),
				paramValue: extractedParameters[URL_PARAMS.CONTROLS] ?? DEFAULT_CONTROLS_VALUE,
				qaAttribute: 'edit-video-popup-action-toggle-controls',
				message: t('builder.editVideo.tabAction.controlsMessage'),
			},
		});

		const handleToggleChange = async (parameterKey, parameterValue) => {
			optionsToggles[parameterKey].paramValue = parameterValue === TRUTHY_PARAM_VALUE
				? FALSY_PARAM_VALUE
				: TRUTHY_PARAM_VALUE;
		};

		// watch for changes both inside toggles and inputs and recalculate `composedProps`
		watchEffect(async () => {
			const extractedProperties = await extractVideoProps(sourceInput.value, {
				autoplay: optionsToggles[URL_PARAMS.AUTOPLAY].paramValue,
				loop: optionsToggles[URL_PARAMS.LOOP].paramValue,
				controls: optionsToggles[URL_PARAMS.CONTROLS].paramValue,
			}).catch((error) => {
				const message = `A video with provided URL was not found. ${error.message}`;

				dispatch(`${NOTIFICATIONS_NAMESPACE}/${NOTIFY}`, {
					message,
					origin: 'EditVideoTabAction.vue',
				});
			});

			isUrlValid.value = extractedProperties.isUrlValid;

			if (!isUrlValid.value) {
				return;
			}

			Object.entries(extractedProperties).forEach(([key, value]) => {
				composedProperties[key] = value;
			});

			dispatch('mergeCurrentElementData', {
				elementData: {
					settings: {
						initialSrc: sourceInput.value,
						src: composedProperties.src,
						jpg: composedProperties.jpg,
						webp: composedProperties.webp,
						provider: composedProperties.provider,
					},
				},
			});
		});

		return {
			currentElementId,
			optionsToggles,
			handleToggleChange,
			srcInput: sourceInput,
			isUrlValid,
			composedProps: composedProperties,
			TRUTHY_PARAM_VALUE,
		};
	},
});
</script>

<style lang="scss" scoped>
.zyro-field-toggle {
	&__group {
		display: flex;
		justify-content: space-between;
		padding: 16px 0;
	}
}

.toggle-container > .zyro-field-toggle {
	$color-gray-border: 0.5px solid $color-gray-border;

	&:first-child {
		margin-top: 16px;
		border-top: $color-gray-border;
	}

	border-bottom: $color-gray-border;

	&:last-child {
		border-bottom: none;
	}
}

.preview {
	position: relative;
	width: 100%;
	height: 176px;
	object-fit: fill;
}
</style>
