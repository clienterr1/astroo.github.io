<template>
	<div>
		<ZyroFieldToggle
			id="toggleShowCart"
			v-qa="`editblocknavigation-tabcart-iscartvisible-${isCartVisible}`"
			:label="cartVisibilitySettingsLabel"
			:model-value="isCartVisible"
			@update:model-value="updateIsCartVisible"
		/>
		<template v-if="isCartVisible">
			<ZyroSeparator />
			<ZyroFieldInput
				v-qa="`editblocknavigation-tabcart-carticontext-${cartIconText}`"
				:model-value="cartIconText"
				:label="$t('builder.editBlockNavigation.tabCart.cartIconText')"
				@update:model-value="updateCartIconText"
			/>
			<ZyroSeparator />
			<ZyroIconSelect
				v-qa="`editblocknavigation-tabcart-carticonsize-${cartIconSize}`"
				:model-value="cartIconSize"
				:options="ICON_SIZE_OPTIONS"
				:label="$t('builder.editBlockNavigation.tabCart.iconSize')"
				label-padding="20px 0 16px 0"
				:items-per-row="3"
				group-name="icon-size"
				@update:model-value="updateCartIconSize"
			/>
		</template>
	</div>
</template>

<script>
import ZyroFieldInput from '@/components/global/ZyroFieldInput.vue';
import ZyroFieldToggle from '@/components/global/ZyroFieldToggle.vue';
import ZyroIconSelect from '@/components/global/ZyroIconSelect.vue';
import ZyroSeparator from '@/components/global/ZyroSeparator.vue';

import {
	mapState,
	mapGetters,
	mapActions,
} from 'vuex';

import { useI18n } from 'vue-i18n';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroFieldInput,
		ZyroFieldToggle,
		ZyroIconSelect,
		ZyroSeparator,
	},

	setup() {
		const { t } = useI18n();

		const ICON_SIZE_OPTIONS = {
			'24px': {
				name: t('common.small'),
				icon: 'shopping-bag',
				iconDimensions: '24px',
			},
			'32px': {
				name: t('common.medium'),
				icon: 'shopping-bag',
				iconDimensions: '32px',
			},
			'40px': {
				name: t('common.large'),
				icon: 'shopping-bag',
				iconDimensions: '40px',
			},
		};

		return {
			ICON_SIZE_OPTIONS,
		};
	},

	computed: {
		...mapState(['currentBlockId']),
		...mapGetters([
			'currentBlockStyles',
			'currentBlockSettings',
		]),
		...mapGetters('ecommerce', ['isLocaleWithEcommerceItems']),
		cartVisibilitySettingsLabel() {
			return this.isLocaleWithEcommerceItems ? this.$t('builder.ecommerceEnableCart') : this.$t('builder.editBlockNavigation.tabCart.showCart');
		},
		isCartVisible() {
			return this.currentBlockSettings.isCartVisible;
		},
		cartIconText() {
			return this.currentBlockSettings.cartText;
		},
		cartIconSize() {
			return this.currentBlockStyles?.cartIconSize;
		},
	},

	methods: {
		...mapActions(['updateBlockData']),

		updateCartIconText(newValue) {
			this.updateBlockData({
				blockId: this.currentBlockId,
				blockData: {
					settings: {
						cartText: newValue,
					},
				},
				merge: true,
			});
		},
		updateCartIconSize(newValue) {
			this.updateBlockData({
				blockId: this.currentBlockId,
				blockData: {
					settings: {
						styles: {
							cartIconSize: newValue,
						},
					},
				},
				merge: true,
			});
		},
		updateIsCartVisible(newValue) {
			this.updateBlockData({
				blockId: this.currentBlockId,
				blockData: {
					settings: {
						isCartVisible: newValue,
					},
				},
				merge: true,
			});
		},
	},
});
</script>
