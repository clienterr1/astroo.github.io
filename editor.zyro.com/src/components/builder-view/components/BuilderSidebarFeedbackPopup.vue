<template>
	<div>
		<ZyroButton
			ref="triggerButton"
			class="sidebar-popup__trigger-button z-body-small z-body-small--strong"
			data-qa="builder-sidebar-btn-feedback"
			:data-trigger-reference="BUILDER_NPS_TRIGGER_SELECTOR"
			color="white"
			:title="title"
		>
			<template #icon>
				<Icon
					:name="icon"
					is-custom
				/>
			</template>
			<p v-if="isSidebarExpanded">
				{{ title }}
			</p>
		</ZyroButton>
		<Popup
			v-if="isActive"
			:target-ref="$refs.triggerButton?.$el"
			auto-update
			@click-outside="closeHandler"
		>
			<BuilderNps
				class="sidebar-popup__content"
				@close="closeHandler"
			/>
		</Popup>
	</div>
</template>

<script>
import Icon from '@/components/global/Icon.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';
import Popup from '@/components/global/Popup.vue';

import { useStore } from 'vuex';

import { setCookie } from '@zyro-inc/site-modules/utils/cookies';

import BuilderNps from '@/components/builder-nps/BuilderNps.vue';
import { BUILDER_NPS_TRIGGER_SELECTOR } from '@/components/builder-nps/npsSelectors';
import {
	COOKIE_NPS_HIDDEN,
	COOKIE_NPS_HIDDEN_DURATION,
} from '@/constants';
import {
	defineComponent,
	computed,
	watch,
} from 'vue';
import { useI18n } from 'vue-i18n';
import { SET_NPS_VISIBLE } from '@/store/builder/nps';

export default defineComponent({
	components: {
		Icon,
		ZyroButton,
		Popup,
		BuilderNps,
	},
	props: {
		isActive: {
			type: Boolean,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		icon: {
			type: String,
			required: true,
		},
	},
	emits: [
		'toggle',
		'close-popup',
	],
	setup(props, context) {
		const { t } = useI18n();
		const {
			dispatch,
			state,
		} = useStore();

		const isSidebarExpanded = computed(() => state.gui.isSidebarExpanded);

		const closeHandler = () => {
			dispatch('nps/setNpsData', {
				question: t('builder.nps.ratingQuestion'),
				isVisible: false,
			});

			setCookie(COOKIE_NPS_HIDDEN, true, COOKIE_NPS_HIDDEN_DURATION);

			context.emit('close-popup');
		};

		watch(() => props.isActive, (isNpsActive) => {
			if (isNpsActive) {
				dispatch(`nps/${SET_NPS_VISIBLE}`, true);

				return;
			}

			closeHandler();
		});

		return {
			BUILDER_NPS_TRIGGER_SELECTOR,
			isSidebarExpanded,
			closeHandler,
		};
	},
});
</script>

<style lang="scss" scoped>
@import "./BuilderSidebarPopup";
</style>
