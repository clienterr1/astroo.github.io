<template>
	<div class="button-settings">
		<ZyroLabel for="button-text">
			{{ $t('builder.editButton.tabActionLabel') }}
		</ZyroLabel>
		<ZyroInput
			id="button-text"
			:model-value="buttonText"
			color="light"
			class="button-settings__input"
			:placeholder="$t('builder.editButton.tabActionLabel')"
			@update:model-value="updateButtonText"
		/>
		<ButtonStyleHeader />
		<ButtonStyleSettings
			ref="buttonSettings"
			:current-button-styles="currentButtonStyles"
			v-bind="{
				siteStyles,
				buttonSize,
				currentButtonType,
				styleDefault,
				styleActive,
				styleHover
			}"
			@set-button-type="setButtonType"
			@set-button-size="setButtonSize"
			@set-button-style="setButtonStyle"
			@set-button-style-hover="setButtonStyleHover"
			@set-button-style-active="setButtonStyleActive"
		/>
	</div>
</template>

<script>
import ZyroInput from '@/components/global/ZyroInput.vue';
import ZyroLabel from '@/components/global/ZyroLabel.vue';

import cloneDeep from 'lodash.clonedeep';
import {
	mapState,
	mapGetters,
	mapActions,
} from 'vuex';

import ButtonStyleHeader from '@/components/builder-controls/edit-button/-partials/button-style-tab/ButtonStyleHeader.vue';
import ButtonStyleSettings from '@/components/builder-controls/edit-button/-partials/button-style-tab/ButtonStyleSettings.vue';
import {
	getButtonSizes,
	finalButtonSizesObject,
} from '@/components/builder-controls/edit-button/-partials/button-style-tab/buttonSizeConfig';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroInput,
		ZyroLabel,
		ButtonStyleHeader,
		ButtonStyleSettings,
	},

	data() {
		return {
			blockId: '',
			initialCurrentBlockData: null,
			buttonSettingsRef: null,
		};
	},

	computed: {
		...mapState(['currentBlockId']),
		...mapGetters([
			'currentBlock',
			'currentBlockSettings',
			'siteStyles',
			'ecommerceShoppingCart',
		]),
		currentProperty() {
			return this.buttonSettingsRef?.currentTab?.property;
		},
		currentButtonStyles() {
			return this.currentBlock.buttonStyle || {};
		},
		buttonText() {
			return this.currentBlock.buttonText ?? this.ecommerceShoppingCart.translations?.addToBag;
		},
		currentButtonType() {
			return this.currentBlock.buttonType || 'primary';
		},
		buttonSize() {
			return getButtonSizes(this.currentButtonStyles, this.currentButtonType);
		},
		styleDefault() {
			const styleProperty = this.currentButtonStyles[`grid-button-${this.currentButtonType}-${this.currentProperty}`];

			if (styleProperty) {
				return styleProperty;
			}

			return this.siteStyles[`grid-button-${this.currentButtonType}`][this.currentProperty];
		},
		styleHover() {
			const hoverProperty = this.currentButtonStyles[`grid-button-${this.currentButtonType}-${this.currentProperty}-hover`];

			if (hoverProperty) {
				return hoverProperty;
			}

			return this.siteStyles[`grid-button-${this.currentButtonType}`][`${this.currentProperty}-hover`];
		},
		styleActive() {
			return this.siteStyles[`grid-button-${this.currentButtonType}`][`${this.currentProperty}-active`];
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

		updateButtonText(newValue) {
			this.updateBlockData({
				blockId: this.blockId,
				blockData: {
					buttonText: newValue,
				},
				merge: true,
			});
		},
		setButtonType(type) {
			this.updateBlockData({
				blockId: this.blockId,
				blockData: {
					buttonType: type,
				},
				merge: true,
			});
		},
		setButtonSize(size) {
			this.updateBlockData({
				blockId: this.blockId,
				blockData: {
					buttonStyle: finalButtonSizesObject(size, this.currentButtonType),
				},
				merge: true,
			});
		},
		setButtonStyle(style) {
			this.updateBlockData({
				blockId: this.blockId,
				blockData: {
					buttonStyle: {
						[`grid-button-${this.currentButtonType}-${this.currentProperty}`]: style,
					},
				},
				merge: true,
			});
		},
		setButtonStyleHover(style) {
			this.addHotjar = true;
			this.updateBlockData({
				blockId: this.blockId,
				blockData: {
					buttonStyle: {
						[`grid-button-${this.currentButtonType}-${this.currentProperty}-hover`]: style,
					},
				},
				merge: true,
			});
		},
		setButtonStyleActive(style) {
			this.updateBlockData({
				blockId: this.blockId,
				blockData: {
					buttonStyle: {
						[`grid-button-${this.currentButtonType}-${this.currentProperty}-active`]: style,
					},
				},
				merge: true,
			});
		},
	},
});
</script>

<style lang="scss" scoped>
.button-settings {
	&__input {
		margin: 6px 0 25px;
	}
}
</style>
