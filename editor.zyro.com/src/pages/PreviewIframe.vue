<template>
	<MobileFrame
		class="preview-iframe"
		:is-builder-preview="$route.name === PREVIEW_ROUTE"
	>
		<div class="preview-iframe__controls-area">
			<div class="preview-iframe__controls">
				<slot name="controls" />
			</div>
		</div>
		<iframe
			ref="previewIframeRef"
			class="preview-iframe__iframe"
			:src="previewUrl"
			@load="handleLoad"
		/>
	</MobileFrame>
</template>

<script setup>
import {
	UPDATE_SITE_DATA,
	ADD_DOCUMENT_ELEMENTS,
	UPDATE_ELEMENT_POSITIONS,
	UPDATE_SCROLL_POSITION,
	UPDATE_PREVIEW_PAGE_ID,
} from '@zyro-inc/site-modules/constants/messageEvents';
import MobileFrame from '@/components/builder-view/components/MobileFrame.vue';
import { PREVIEW_ROUTE } from '@/constants/routes';
import {
	ref,
	watch,
} from 'vue';

const props = defineProps({
	siteData: {
		type: Object,
		required: true,
	},
	siteId: {
		type: String,
		required: true,
	},
	path: {
		type: String,
		default: null,
	},
	// By setting this prop to false, you can control "Preview iframe" updates from parent
	// by calling exposed function - updatePreviewIframe.
	updatePreviewOnSiteDataChange: {
		type: Boolean,
		default: true,
	},
});
const emit = defineEmits([
	'load',
	'update-element-positions',
	'update-preview-page-id',
]);
const previewUrl = import.meta.env.VITE_PREVIEW_URL;
const previewIframeRef = ref(null);
const controlsOffset = ref(0);

const postMessage = ({
	type,
	payload,
}) => {
	previewIframeRef.value.contentWindow.postMessage({
		type,
		payload,
	}, previewUrl);
};

const updatePreviewIframe = () => {
	if (!previewIframeRef.value || !props.siteData) {
		return;
	}

	const previewSiteData = JSON.parse(JSON.stringify({
		...props.siteData,
		siteId: props.siteId,
	}));

	postMessage({
		type: UPDATE_SITE_DATA,
		payload: {
			siteData: previewSiteData,
			path: props.path,
		},
	});

	postMessage({
		type: ADD_DOCUMENT_ELEMENTS,
		payload: {
			siteData: previewSiteData,
		},
	});
};

const handleLoad = () => {
	updatePreviewIframe();
	emit('load');
};

defineExpose({
	updatePreviewIframe,
	postMessage,
});

watch(() => props.siteData, (newValue) => {
	if (!newValue || !props.updatePreviewOnSiteDataChange) {
		return;
	}

	updatePreviewIframe();
});

const listenForIframeEvents = () => {
	window.addEventListener('message', ({ data }) => {
		if (typeof data !== 'object') {
			return;
		}

		if (data.type === UPDATE_ELEMENT_POSITIONS) {
			emit('update-element-positions', data.payload);
		}

		if (data.type === UPDATE_PREVIEW_PAGE_ID) {
			emit('update-preview-page-id', data.payload);
		}

		if (data.type === UPDATE_SCROLL_POSITION) {
			controlsOffset.value = data.payload.scrollY;
		}
	});
};

listenForIframeEvents();
</script>

<style lang="scss" scoped>
.preview-iframe {
	&__iframe {
		width: 100%;
		height: 100%;
		border: none;
	}

	&__controls-area {
		position: absolute;
		height: 100%;
		width: 100%;
		overflow: hidden;
		pointer-events: none;
	}

	&__controls {
		position: absolute;
		top: calc(-1px * v-bind(controlsOffset));
	}
}
</style>
