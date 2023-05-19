<template>
	<button
		v-qa="`builder-header-btn-switchview${isMobileView ? '-mobile' : ''}`"
		:data-popper-reference="MOBILE_SWITCH_BUTTON_SELECTOR"
		class="screen-toggle"
		theme="header"
		color="white"
		:title="$t('common.toggleMobile')"
		@click="handleViewToggle"
	>
		<Icon
			class="screen-toggle__icon"
			:class="{ 'screen-toggle__icon--highlighted': !isMobileView }"
			name="computer"
		/>
		<Icon
			class="screen-toggle__icon"
			:class="{ 'screen-toggle__icon--highlighted': isMobileView }"
			is-filled
			name="smartphone"
		/>
	</button>
</template>

<script>
import Icon from '@/components/global/Icon.vue';
import { GAMIFICATION_TASK_CHECK_MOBILE_VIEW } from '@/constants';
import { useStore } from 'vuex';
import { MOBILE_SWITCH_BUTTON_SELECTOR } from '@/components/onboarding/onboardingSelectors';
import { useGamification } from '@/use/useGamification';
import {
	defineComponent,
	computed,
} from 'vue';

export default defineComponent({
	components: {
		Icon,
	},

	setup() {
		const {
			state,
			dispatch,
		} = useStore();
		const { completeAchievement } = useGamification();

		const isMobileView = computed(() => state.gui.isMobileView);

		const handleViewToggle = () => {
			dispatch('gui/toggleMobileView');

			if (isMobileView) {
				completeAchievement(GAMIFICATION_TASK_CHECK_MOBILE_VIEW);
			}
		};

		return {
			MOBILE_SWITCH_BUTTON_SELECTOR,
			handleViewToggle,
			isMobileView,
		};
	},
});
</script>

<style lang="scss" scoped>
.screen-toggle {
	display: flex;
	gap: 8px;
	margin: 0 16px;
	cursor: pointer;

	&__icon {
		color: $color-gray;
		transition: color 0.3s ease;

		&:hover,
		&:focus,
		&--highlighted {
			color: var(--color-dark);
		}
	}
}
</style>
