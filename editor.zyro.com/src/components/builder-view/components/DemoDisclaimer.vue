<template>
	<div
		v-if="isDemoDisclaimerOpen"
		class="demo-notify"
	>
		<div class="demo-notify__title-container">
			<div class="demo-notify__title">
				<ZyroSvgDeprecated
					name="alert-circle-filled"
					class="demo-notify__alert-icon"
				/>
				<p class="z-body z-font-weight-bold">
					{{ $t('builder.saveButtonPopup.notSaved') }}
				</p>
			</div>
			<ZyroSvgDeprecated
				name="x"
				dimensions="20px"
				class="demo-notify__close-icon"
				@click="isDemoDisclaimerOpen = false"
			/>
		</div>
		<div class="demo-notify__text z-body-small">
			<i18n-t
				tag="p"
				keypath="builder.demoBuilderDisclaimer1"
				class="demo-notify__disclaimer1"
			>
				<span class="z-font-weight-bold">
					{{ $t("builder.demoBuilderDisclaimer1Changes") }}
				</span>
				<span class="z-font-weight-bold">
					{{ $t("builder.demoBuilderDisclaimer1Features") }}
				</span>
			</i18n-t>
			<i18n-t
				tag="p"
				keypath="builder.demoBuilderDisclaimer2"
			>
				<span
					class="z-link"
					@click="handleDemoRedirect"
				>
					{{ $t("common.chooseBuilder") }}
				</span>
			</i18n-t>
		</div>
	</div>
</template>

<script>
import {
	defineComponent,
	ref,
} from 'vue';

import { useRedirects } from '@/use/useRedirects';

import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

export default defineComponent({
	components: {
		ZyroSvgDeprecated,
	},
	setup() {
		const { handleDemoRedirect } = useRedirects();

		const isDemoDisclaimerOpen = ref(true);

		return {
			isDemoDisclaimerOpen,
			handleDemoRedirect,
		};
	},
});
</script>

<style lang="scss" scoped>
.demo-notify {
	position: fixed;
	right: 16px;
	bottom: 16px;
	z-index: $z-index-modal;
	display: flex;
	flex-direction: column;
	width: 100%;
	max-width: 320px;
	padding: 16px;
	background-color: $color-light;
	border-radius: 12px;

	&__title-container {
		display: flex;
		justify-content: space-between;
	}

	&__title {
		display: flex;
		align-items: center;
		margin-bottom: 8px;
	}

	&__alert-icon {
		flex-shrink: 0;
		margin-right: 16px;
		color: $color-warning-dark;
	}

	&__close-icon {
		color: $color-gray;
		cursor: pointer;
	}

	&__text {
		color: $color-gray;
	}

	&__disclaimer1 {
		margin-bottom: 4px;
	}
}
</style>
