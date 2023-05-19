<template>
	<div
		:[DATA_ATTRIBUTE_SELECTOR]="DATA_ATTRIBUTE_SELECTOR_QUICK_START_GUIDE"
		class="quick-start-guide"
		data-qa="quick-start-guid"
	>
		<ZyroButton
			data-qa="builder-header-btn-start-guide"
			theme="header"
			color="white"
			@click="toggleQuickStartGuide"
		>
			<template #icon-left>
				<Icon
					name="rocket_launch"
					is-filled
				/>
			</template>
			{{ $t('builder.startGuide') }}
		</ZyroButton>

		<div
			v-if="isQuickStartGuideVisible"
			ref="quickStartGuideRef"
			class="quick-start-guide__modal"
		>
			<QuickStartGuideIntroduction
				v-if="!isQuickStartGuideStarted"
				@button-click="startQuickStartGuide"
			/>
			<QuickStartGuideSteps
				v-else
				@close="toggleQuickStartGuide"
			/>
		</div>
	</div>
</template>
<script>
import Icon from '@/components/global/Icon.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';
import {
	getCookie,
	setCookie,
} from '@zyro-inc/site-modules/utils/cookies';
import {
	COOKIE_QUICK_START_GUIDE_STARTED,
	DATA_SELECTOR_QUICK_START_GUIDE,
} from '@/constants';
import {
	DATA_ATTRIBUTE_SELECTOR,
	DATA_ATTRIBUTE_SELECTOR_QUICK_START_GUIDE,
} from '@zyro-inc/site-modules/constants';
import QuickStartGuideSteps from '@/components/builder-view/components/QuickStartGuideSteps.vue';
import QuickStartGuideIntroduction from '@/components/builder-view/components/QuickStartGuideIntroduction.vue';
import { useQuickStartGuide } from '@/use/useQuickStartGuide';
import { onClickOutside } from '@/utils/onClickOutside';
import {
	defineComponent,
	ref,
} from 'vue';

export default defineComponent({
	components: {
		Icon,
		ZyroButton,
		QuickStartGuideSteps,
		QuickStartGuideIntroduction,
	},

	setup() {
		const {
			toggleQuickStartGuide,
			isQuickStartGuideVisible,
		} = useQuickStartGuide();

		const quickStartGuideRef = ref(null);

		onClickOutside({
			target: quickStartGuideRef,
			preventSelector: DATA_SELECTOR_QUICK_START_GUIDE,
		}, () => {
			toggleQuickStartGuide();
		});

		return {
			toggleQuickStartGuide,
			isQuickStartGuideVisible,
			quickStartGuideRef,
			DATA_ATTRIBUTE_SELECTOR,
			DATA_ATTRIBUTE_SELECTOR_QUICK_START_GUIDE,
		};
	},

	data() {
		return {
			isQuickStartGuideStarted: false,
		};
	},

	mounted() {
		this.isQuickStartGuideStarted = getCookie(COOKIE_QUICK_START_GUIDE_STARTED);
	},

	methods: {
		startQuickStartGuide() {
			this.isQuickStartGuideStarted = true;
			// Show only once per account
			setCookie(COOKIE_QUICK_START_GUIDE_STARTED, true, {
				expires: 365,
			});
		},
	},
});
</script>
<style lang="scss" scoped>
.quick-start-guide {
	$this: &;

	position: relative;
	display: flex;
	justify-content: center;

	&__list-icon {
		margin-right: 8px;
		color: $color-gray;
	}

	&__modal {
		position: absolute;
		top: #{$header-height-editor + 8px};
		left: 16px;
		min-width: 445px;
		padding: 24px;
		color: $color-dark;
		background-color: $color-light;
		border: 1px solid $color-gray-light;
		border-radius: 12px;
		box-shadow: $box-shadow;
	}
}
</style>
