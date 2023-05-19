<template>
	<div
		ref="desktopPreview"
		class="builder-root"
	>
		<div class="builder-root__main">
			<BuilderSafariDisclaimerRibbon v-if="isSafariDisclaimerRibbonVisible" />
			<MobileFrame>
				<BuilderPreview v-if="website" />
				<BuilderHeatmap v-if="isHeatmapOpen" />
			</MobileFrame>
		</div>

		<BuilderDrawers v-if="activeDrawer" />
		<SeoDrawer v-if="$route.name === SEO_SETTINGS_ROUTE" />
		<ContextMenuLayoutElement v-if="isLayoutOnly" />
		<ContextMenuGridElement v-else />
		<DemoDisclaimer v-if="isDemoMode" />
	</div>
</template>

<script setup>
import { useStore } from 'vuex';

import {
	getCode,
	CODE,
} from '@zyro-inc/site-modules/utils/getCode';
import { BROWSER_NAME_SAFARI } from '@zyro-inc/site-modules/constants';
import SeoDrawer from '@/components/builder-drawers/drawers/SeoDrawer.vue';
import BuilderDrawers from '@/components/builder-drawers/BuilderDrawers.vue';
import BuilderHeatmap from '@/components/builder-view/components/BuilderHeatmap.vue';
import BuilderSafariDisclaimerRibbon from '@/components/builder-view/components/BuilderSafariDisclaimerRibbon.vue';
import MobileFrame from '@/components/builder-view/components/MobileFrame.vue';
import DemoDisclaimer from '@/components/builder-view/components/DemoDisclaimer.vue';
import BuilderPreview from '@/components/builder-view/views/BuilderPreview/BuilderPreview.vue';
import ContextMenuGridElement from '@/components/context-menu/ContextMenuGridElement.vue';
import ContextMenuLayoutElement from '@/components/context-menu/ContextMenuLayoutElement.vue';
import { getBrowser } from '@zyro-inc/site-modules/utils/getBrowser';
import {
	onBeforeMount,
	onMounted,
	onBeforeUnmount,
	watch,
	computed,
	ref,
} from 'vue';
import { SEO_SETTINGS_ROUTE } from '@/constants/routes';
import { usePageSettingsSeo } from '@/use/usePageSettingsSeo';
import { useQuickStartGuide } from '@/use/useQuickStartGuide';
import { useGamification } from '@/use/useGamification';
import {
	QUICK_START_GUIDE_SEO_STEP,
	GAMIFICATION_TASK_CHANGE_SEO,
} from '@/constants';

const {
	getters,
	state,
	dispatch,
} = useStore();
const { completeAchievement } = useGamification();
const { completeQuickStartGuideStep } = useQuickStartGuide();
const { isPageSEOSetupCompleted: isHomepageSEOSetupComplete } = usePageSettingsSeo({
	pageId: getters.homePageId,
});

const desktopPreview = ref(null);
const isSafariDisclaimerRibbonVisible = ref(false);

const website = computed(() => state.website);
const isDemoMode = computed(() => state.isDemoMode);
const isHeatmapOpen = computed(() => state.gui.isHeatmapOpen);
const activeDrawer = computed(() => state.gui.activeDrawer);
const isEditingTextBoxElement = computed(() => getters.isEditingTextBoxElement);
const isLayoutOnly = computed(() => getters['flags/isLayoutOnly']);

const executeUndo = () => {
	dispatchEvent('undoRedo/executeUndo');
};

const executeRedo = () => {
	dispatchEvent('undoRedo/executeRedo');
};

const handleUndoRedo = (event) => {
	if (isEditingTextBoxElement.value) {
		return;
	}

	// cmd + shift + z or ctrl + shift + z
	if ((event.ctrlKey || event.metaKey) && event.shiftKey && getCode(event) === CODE.KeyZ) {
		event.preventDefault();
		executeRedo();

		return;
	}

	// for window cmd + Y
	if (event.ctrlKey && getCode(event) === CODE.KeyY) {
		event.preventDefault();
		executeRedo();

		return;
	}

	// cmd + z or ctrl + z
	if ((event.ctrlKey || event.metaKey) && getCode(event) === CODE.KeyZ) {
		event.preventDefault();
		executeUndo();
	}
};

const handleSafariDisclaimer = () => {
	const browser = getBrowser();

	if (browser.name === BROWSER_NAME_SAFARI && Number(browser.version) < 14) {
		isSafariDisclaimerRibbonVisible.value = true;
	}
};

watch(isHomepageSEOSetupComplete, (isComplete) => {
	if (!isComplete) {
		return;
	}

	completeAchievement(GAMIFICATION_TASK_CHANGE_SEO);

	completeQuickStartGuideStep({
		completedStepKey: 'hasCompletedPageSeo',
		eventProperties: {
			stepName: QUICK_START_GUIDE_SEO_STEP,
		},
	});
}, {
	immediate: true,
});

onBeforeMount(() => {
	handleSafariDisclaimer();
});

onMounted(async () => {
	window.addEventListener('keydown', handleUndoRedo);

	dispatch('gui/setRef', {
		element: 'desktopPreviewRef',
		ref: desktopPreview.value,
	});
});

onBeforeUnmount(() => {
	window.removeEventListener('keydown', handleUndoRedo);
});
</script>
<style lang="scss" scoped>
.builder-root {
	display: flex;
	overflow: auto;

	&__main {
		position: relative;
		flex: 1;
		height: fit-content;
		background: $color-gray-light;
	}
}
</style>
