<template>
	<div class="ecommerce-tab-buy-button">
		<ZyroFieldToggle
			id="buyButton"
			v-qa="`editproductlist-tabbuybutton-enable-${isButtonEnabled}`"
			class="ecommerce-tab-buy-button__controls"
			:label="$t('builder.enableAddToBag')"
			:model-value="isButtonEnabled"
			@update:model-value="updateIsButtonEnabled"
		/>
		<template v-if="isButtonEnabled">
			<ZyroSeparator class="ecommerce-tab-buy-button__separator" />
			<ZyroRadioList
				v-qa="`editproductlist-tabbuybutton-controls`"
				:model-value="buttonDisplay"
				:options="buttonDisplayOptions"
				class="ecommerce-tab-buy-button__controls"
				@update:model-value="updateButtonDisplay"
			/>
			<EditBlockTabButton />
		</template>
	</div>
</template>

<script>
import ZyroFieldToggle from '@/components/global/ZyroFieldToggle.vue';
import ZyroRadioList from '@/components/global/ZyroRadioList.vue';
import cloneDeep from 'lodash.clonedeep';
import ZyroSeparator from '@/components/global/ZyroSeparator.vue';

import {
	mapState,
	mapGetters,
	mapActions,
} from 'vuex';
import EditBlockTabButton from '@/components/builder-controls/edit-block-ecommerce-product/EditBlockTabButton.vue';

export default {
	components: {
		ZyroFieldToggle,
		ZyroRadioList,
		EditBlockTabButton,
		ZyroSeparator,
	},

	data() {
		return {
			initialCurrentBlockData: null,
			buttonSettingsRef: null,
		};
	},

	computed: {
		...mapState(['currentBlockId']),
		...mapGetters([
			'currentBlock',
			'currentBlockStyles',
		]),
		buttonDisplayOptions() {
			return {
				always: {
					name: this.$t('common.always'),
				},
				hover: {
					name: this.$t('builder.onlyOnHover'),
				},
			};
		},
		buttonDisplay() {
			return this.currentBlock.buttonDisplay || 'always';
		},
		isButtonEnabled() {
			return this.currentBlock.isButtonEnabled;
		},
	},

	mounted() {
		this.buttonSettingsRef = this.$refs.buttonSettings;
		this.blockId = this.currentBlockId;
		this.initialCurrentBlockData = cloneDeep(this.currentBlock);
	},

	beforeUnmount() {
		this.createSnapshot();
	},

	methods: {
		...mapActions(['updateBlockData']),
		...mapActions('undoRedo', ['createSnapshot']),

		updateIsButtonEnabled(isEnabled) {
			this.updateBlockData({
				blockId: this.blockId,
				blockData: {
					isButtonEnabled: isEnabled,
				},
				merge: true,
			});
		},
		updateButtonDisplay(newValue) {
			this.updateBlockData({
				blockId: this.blockId,
				blockData: {
					buttonDisplay: newValue,
				},
				merge: true,
			});
		},
	},
};
</script>

<style lang="scss" scoped>
.ecommerce-tab-buy-button {
	&__controls {
		padding: 0;
		margin: 24px 0;

		&:first-child {
			margin: 0;
		}
	}

	&__separator {
		margin: 24px 0;
	}

	&__input {
		margin: 6px 0 25px;
	}
}
</style>
