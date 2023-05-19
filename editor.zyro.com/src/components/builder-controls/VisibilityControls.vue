<template>
	<div class="visibility">
		<ZyroButton
			ref="visibilityControls"
			theme="editor"
			data-qa="visibility-controls-open-settings"
			:title="$t('common.visibility')"
			@click="showVisibilitySettings = !showVisibilitySettings"
		>
			<template #icon>
				<Icon
					name="visibility"
					dimensions="16px"
				/>
			</template>
		</ZyroButton>
		<Popup
			v-if="showVisibilitySettings"
			:target-ref="$refs.visibilityControls && $refs.visibilityControls.$el"
			placement="bottom"
			auto-update
			@click-outside="showVisibilitySettings = false"
		>
			<div class="visibility__controls">
				<p class="visibility__title">
					{{ $t('common.visibility') }}:
				</p>
				<div class="visibility__control">
					<div class="visibility__control-text-wrapper">
						<p class="visibility__control-title z-body-small z-font-weight-bold">
							{{ $t('common.mobile') }}
						</p>
						<p class="visibility__control-status z-body-small">
							{{ isHiddenMobile ? $t('common.hidden') : $t('common.visible') }}
						</p>
					</div>
					<ZyroToggle
						id="visibility-settings-mobile"
						data-qa="visibility-controls-setmobilevisibility"
						:model-value="!isHiddenMobile"
						@update:model-value="$emit('set-mobile-visibility', !isHiddenMobile)"
					/>
				</div>
				<div class="visibility__control">
					<div class="visibility__control-text-wrapper">
						<p class="visibility__control-title z-body-small z-font-weight-bold">
							{{ $t('common.desktop') }}
						</p>
						<p class="visibility__control-status z-body-small">
							{{ isHiddenDesktop ? $t('common.hidden') : $t('common.visible') }}
						</p>
					</div>
					<ZyroToggle
						id="visibility-settings-desktop"
						data-qa="visibility-controls-setdesktopvisibility"
						:model-value="!isHiddenDesktop"
						@update:model-value="$emit('set-desktop-visibility', !isHiddenDesktop)"
					/>
				</div>
			</div>
		</Popup>
	</div>
</template>

<script>
import {
	defineComponent,
	ref,
} from 'vue';

import Icon from '@/components/global/Icon.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroToggle from '@/components/global/ZyroToggle.vue';
import Popup from '@/components/global/Popup.vue';

export default defineComponent({
	components: {
		Icon,
		ZyroButton,
		ZyroToggle,
		Popup,
	},
	props: {
		isHiddenDesktop: {
			type: Boolean,
			required: true,
		},
		isHiddenMobile: {
			type: Boolean,
			required: true,
		},
	},
	emits: [
		'set-desktop-visibility',
		'set-mobile-visibility',
	],
	setup() {
		const visibilityControls = ref(null);
		const showVisibilitySettings = ref(false);

		return {
			visibilityControls,
			showVisibilitySettings,
		};
	},
});
</script>

<style lang="scss" scoped>
.visibility {
	&__controls {
		width: 220px;
		padding: 16px;
		background-color: $color-light;
		border-radius: $border-radius-small;
		box-shadow: 0 6px 14px rgba(0, 0, 0, 10%);
	}

	&__title {
		margin-bottom: 16px;
		font-size: 11px;
		line-height: 1.27;
		color: $color-gray;
		text-transform: uppercase;
	}

	&__control {
		display: flex;
		justify-content: space-between;
		margin-bottom: 16px;
	}

	&__control-text-wrapper {
		display: flex;
	}

	&__control-title {
		margin-right: 4px;
	}

	&__control-status {
		color: $color-gray;
	}
}
</style>
