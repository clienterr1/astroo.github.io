<template>
	<ZyroPopupCard
		type="editor"
		:title="$t('builder.editBlockNavigation.title')"
		:tabs="tabs"
		:current-tab="currentTab"
		@update:current-tab="currentTab = $event"
		@close="$emit('close')"
	>
		<Component
			:is="currentTab.component"
			@vue:mounted="saveBlockDataBeforeEdit"
			@vue:beforeUnmount="saveBlockDataToHistory"
		/>
	</ZyroPopupCard>
</template>

<script>
import ZyroPopup from '@/components/global/ZyroPopup.vue';
import ZyroPopupCard from '@/components/global/ZyroPopupCard.vue';

import cloneDeep from 'lodash.clonedeep';
import {
	mapGetters,
	mapActions,
	mapState,
} from 'vuex';

import EditBlockNavigationTabCart from '@/components/builder-controls/edit-block-navigation/EditBlockNavigationTabCart.vue';
import EditBlockNavigationTabLayout from '@/components/builder-controls/edit-block-navigation/EditBlockNavigationTabLayout.vue';
import EditBlockNavigationTabLogo from '@/components/builder-controls/edit-block-navigation/EditBlockNavigationTabLogo.vue';
import EditBlockNavigationTabStyle from '@/components/builder-controls/edit-block-navigation/EditBlockNavigationTabStyle.vue';

import { useI18n } from 'vue-i18n';

import {
	defineComponent,
	ref,
} from 'vue';

export default defineComponent({
	components: {
		ZyroPopup,
		ZyroPopupCard,
		EditBlockNavigationTabCart,
		EditBlockNavigationTabLayout,
		EditBlockNavigationTabLogo,
		EditBlockNavigationTabStyle,
	},

	props: {
		startTabId: {
			type: String,
			default: '',
		},
	},

	setup(props) {
		const { t } = useI18n();

		const TAB_ID_CART = 'cart';

		const TABS = [
			{
				id: 'layout',
				title: t('common.layout'),
				component: 'EditBlockNavigationTabLayout',
			},
			{
				id: 'logo',
				title: t('common.logo'),
				component: 'EditBlockNavigationTabLogo',
			},
			{
				id: TAB_ID_CART,
				title: t('common.shoppingBag'),
				component: 'EditBlockNavigationTabCart',
			},
			{
				id: 'style',
				title: t('common.style'),
				component: 'EditBlockNavigationTabStyle',
			},
		];

		const initialTab = TABS.find((tab) => tab.id === props.startTabId) ?? TABS[0];
		const currentTab = ref(initialTab);
		const initialCurrentBlockData = ref(null);
		const blockId = ref(null);

		return {
			TAB_ID_CART,
			TABS,
			currentTab,
			initialCurrentBlockData,
			blockId,
		};
	},
	computed: {
		...mapGetters('ecwid', ['isLocaleWithEcwid']),
		...mapGetters('ecommerce', ['isLocaleWithEcommerceItems']),
		...mapState(['currentBlockId']),
		...mapGetters(['currentBlock']),
		tabs() {
			if (this.isLocaleWithEcwid || this.isLocaleWithEcommerceItems) {
				return this.TABS;
			}

			return this.TABS.filter((tab) => tab.id !== this.TAB_ID_CART);
		},
	},

	methods: {
		...mapActions('undoRedo', ['createSnapshot']),
		saveBlockDataToHistory() {
			this.createSnapshot();
		},
		saveBlockDataBeforeEdit() {
			this.id = this.currentBlockId;
			this.initialCurrentBlockData = cloneDeep(this.currentBlock);
		},
	},
});
</script>
