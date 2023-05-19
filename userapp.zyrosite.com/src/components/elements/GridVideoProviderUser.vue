<template>
	<GridVideo
		ref="videoRef"
		v-bind="composedProps"
		:src="composedSrc"
		:render-iframe="renderIframe"
		:render-picture="renderPicture"
		@click.once="renderIframe = true"
	/>
</template>

<script>
import {
	ref,
	computed,
	onMounted,
	defineComponent,
} from 'vue';

import GridVideo from '@zyro-inc/site-modules/components/elements/video/GridVideo.vue';
import {
	URL_PARAMS,
	FALSY_PARAM_VALUE,
	TRUTHY_PARAM_VALUE,
} from '@zyro-inc/site-modules/components/elements/video/constants';
import { useGridVideo } from '@zyro-inc/site-modules/components/elements/video/useGridVideo';
import { MEDIA_MOBILE_BREAKPOINT } from '@zyro-inc/site-modules/constants';

export default defineComponent({
	name: 'GridVideoProviderUser',

	components: {
		GridVideo,
	},

	props: {
		data: {
			type: Object,
			required: true,
		},
	},

	setup(props) {
		const { composedProps } = useGridVideo(props);
		const isMobileScreen = ref(false);

		const videoRef = ref(null);

		const shouldAutoplay = computed(
			() => props.data.settings.src?.includes(`${[URL_PARAMS.AUTOPLAY]}=${TRUTHY_PARAM_VALUE}`) ?? false,
		);

		/**
		 * If .src contains 'autoplay=0' or on mobile, force it to 'autoplay=1' as autoplay is handled
		 * by 'shouldAutoplay' via IntersectionObserver.
		 *
		 * Also, if 'shouldAutoplay', switch mute param to TRUTHY_PARAM_VALUE.
		 */
		const composedSource = computed(() => {
			const muteParameterLabel = URL_PARAMS.MUTE[composedProps.provider];

			const source = isMobileScreen
				? composedProps.src
				: composedProps.src.replace(
					`${[URL_PARAMS.AUTOPLAY]}=${FALSY_PARAM_VALUE}`,
					`${[URL_PARAMS.AUTOPLAY]}=${TRUTHY_PARAM_VALUE}`,
				);

			return shouldAutoplay.value
				? source.replace(
					`${[muteParameterLabel]}=${FALSY_PARAM_VALUE}`,
					`${[muteParameterLabel]}=${TRUTHY_PARAM_VALUE}`,
				)
				: source;
		});

		const renderIframe = ref(false);
		const renderPicture = ref(false);

		const init = () => {
			const observer = new IntersectionObserver(([{ isIntersecting }]) => {
				if (isIntersecting) {
					if (shouldAutoplay.value && !isMobileScreen) {
						renderIframe.value = true;
					} else {
						renderPicture.value = true;
					}

					observer.disconnect();
				}
			}, {
				threshold: 0,
			});

			observer.observe(videoRef.value.$el);

			renderIframe.value = true;
		};

		onMounted(() => {
			isMobileScreen.value = window?.innerWidth < MEDIA_MOBILE_BREAKPOINT;

			init();
		});

		return {
			videoRef,
			composedProps,
			composedSrc: composedSource,
			renderIframe,
			renderPicture,
		};
	},
});
</script>
