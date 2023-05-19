<template>
	<PublishedModalRoot>
		<template #title>
			{{ isUpdate ? $t('builder.publishedChangesModalTitle') : $t('builder.publishedModalTitle') }}
		</template>
		<template #subtitle>
			{{ $t('builder.publishedModal.subtitle') }}
		</template>
	</PublishedModalRoot>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import PublishedModalRoot from '@/components/builder-modals/modals/PublishedModalRoot.vue';
import { GAMIFICATION_TASK_GO_LIVE } from '@/constants';
import { useGamification } from '@/use/useGamification';

const { state } = useStore();
const { completeAchievement } = useGamification();

const activeModalSettings = computed(() => state.gui.activeModalSettings);
const isUpdate = computed(() => activeModalSettings.value?.isUpdate);
const goLiveStep = computed(() => state.gamification.achievements
	.find(({ id }) => id === GAMIFICATION_TASK_GO_LIVE));

if (!goLiveStep.value?.isCompleted) {
	completeAchievement(GAMIFICATION_TASK_GO_LIVE);
}

</script>
