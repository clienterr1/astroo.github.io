<template>
	<div
		v-qa="`builder-header-text-publishsite`"
		class="publish-button-content"
	>
		<ZyroLoader
			v-if="isSiteBeingPublished"
			class="publish-button-content__loader"
			size="20px"
			color="var(--color-azure-light)"
		/>

		<span class="z-font-weight-bold">{{ buttonText }}</span>
	</div>
</template>

<script>
import {
	defineComponent,
	computed,
} from 'vue';
import { useStore } from 'vuex';

import { useI18n } from 'vue-i18n';

import ZyroLoader from '@zyro-inc/site-modules/components/ZyroLoader.vue';

export default defineComponent({
	components: {
		ZyroLoader,
	},
	setup() {
		const {
			state,
			getters,
		} = useStore();
		const { t } = useI18n();

		const zyroDomain = computed(() => state.zyroDomain);
		const isDemoMode = computed(() => state.isDemoMode);
		const isSiteBeingPublished = computed(() => state.gui.isSiteBeingPublished);
		const websiteStatus = computed(() => getters.websiteStatus);

		const buttonText = computed(() => {
			if (isDemoMode.value) {
				return t('common.chooseBuilder');
			}

			if (isSiteBeingPublished.value) {
				return t('builder.header.publishing');
			}

			if (websiteStatus.value === 'SUSPENDED') {
				return t('builder.header.websiteSuspended');
			}

			return zyroDomain.value ? t('builder.header.updateWebsite') : t('builder.header.goLive');
		});

		return {
			isSiteBeingPublished,
			buttonText,
		};
	},
});
</script>

<style lang="scss" scoped>
.publish-button-content {
	display: flex;
	align-items: center;
	white-space: nowrap;

	&__loader {
		&#{&} {
			margin-right: 8px;
		}
	}
}

</style>
