<template>
	<GamificationTaskItem
		v-for="(item, index) in sortedAchievements"
		:key="item.id"
		tabindex="0"
		:is-last-item="sortedAchievements.length === index + 1"
		:item="item"
		:data-qa="`gamification-tasks-task-${item.id}`"
	>
		{{ item.name }}
	</GamificationTaskItem>
</template>

<script>
import GamificationTaskItem from '@/components/onboarding/GamificationTaskItem.vue';
import {
	defineComponent,
	computed,
} from 'vue';
import { useGamification } from '@/use/useGamification';

export default defineComponent({
	components: {
		GamificationTaskItem,
	},
	setup() {
		const { achievements } = useGamification();

		const sortedAchievements = computed(() => [...achievements.value].sort((a, b) => b.isCompleted - a.isCompleted));

		return {
			achievements,
			sortedAchievements,
		};
	},
});
</script>
