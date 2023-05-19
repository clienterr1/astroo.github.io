<template>
	<BaseEditControls :button-title="$t('builder.editSocialIcons.title')">
		<ZyroPopupCard
			type="editor"
			:title="$t('builder.editSocialIcons.popupTitle')"
			:tabs="tabs"
			:current-tab="currentTab"
			@update:current-tab="currentTab = $event"
			@close="handlePopupCardClose"
		>
			<Component :is="currentTab.component" />
			<NpsRateFeature
				:feature-name="$t('builder.npsRateSocIcons')"
				:type="NPS_TYPE_FEATURE_SOCIAL_ICONS"
			/>
		</ZyroPopupCard>
	</BaseEditControls>
</template>

<script>
import ZyroPopup from '@/components/global/ZyroPopup.vue';
import ZyroPopupCard from '@/components/global/ZyroPopupCard.vue';

import {
	mapState,
	mapGetters,
	mapActions,
} from 'vuex';

import EditSocialIconsTabLayout from '@/components/builder-controls/edit-social-icons/EditSocialIconsTabLayout.vue';
import EditSocialIconsTabLinks from '@/components/builder-controls/edit-social-icons/EditSocialIconsTabLinks.vue';
import EditSocialIconsTabStyle from '@/components/builder-controls/edit-social-icons/EditSocialIconsTabStyle.vue';
import EditTabAnimation from '@/components/builder-controls/reusable-controls/element/EditTabAnimation.vue';

import BaseEditControls from '@/components/builder-controls/BaseEditControls.vue';
import NpsRateFeature from '@/components/ui/NpsRateFeature.vue';
import { NPS_TYPE_FEATURE_SOCIAL_ICONS } from '@/constants';

import {
	defineComponent,
	ref,
} from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({

	components: {
		ZyroPopup,
		ZyroPopupCard,
		BaseEditControls,
		EditSocialIconsTabStyle,
		EditSocialIconsTabLayout,
		EditSocialIconsTabLinks,
		NpsRateFeature,
		EditTabAnimation,
	},
	emits: ['close'],

	setup() {
		const { t } = useI18n();
		const tabs = [
			{
				title: t('common.links'),
				component: 'EditSocialIconsTabLinks',
			},
			{
				title: t('common.style'),
				component: 'EditSocialIconsTabStyle',
			},
			{
				title: t('common.layout'),
				component: 'EditSocialIconsTabLayout',
			},
			{
				title: t('common.animation'),
				component: 'EditTabAnimation',
			},
		];

		const currentTab = ref(tabs[0]);

		return {
			tabs,
			currentTab,
			NPS_TYPE_FEATURE_SOCIAL_ICONS,
		};
	},

	computed: {
		...mapState(['currentElementId']),
		...mapGetters(['currentElement']),
	},

	methods: {
		...mapActions(['removeCurrentElement']),
		handlePopupCardClose() {
			if (this.currentElement.links.length === 0) {
				this.removeCurrentElement();
			}

			this.$emit('close');
		},
	},
});
</script>
