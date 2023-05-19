<template>
	<div>
		<div
			ref="fontItemButton"
			v-qa="`edittext-textfont-option-${fontFamily}-in-use`"
			class="font-select__item z-body-small"
			:class="{ 'font-select__item--active': isOpen }"
			:style="{ fontFamily }"
			:[DATA_ATTRIBUTE_SELECTOR]="DATA_ATTRIBUTE_SELECTOR_FONT_SELECT"
			@mousemove="$emit('hovering-font-family', fontFamily)"
			@click="$emit('update-font', {
				fontFamily,
				fontWeight: 400,
				...(fileType ? { fileType } : {})
			})"
		>
			<p class="font-select__item-text">
				{{ fontFamily }}
			</p>
			<ZyroSvgDeprecated
				name="chevron-right-small"
				:class="{ hidden: !showFontWeightVariants }"
			/>
		</div>
		<Popup
			v-if="showFontWeightVariants && isOpen"
			:target-ref="$refs.fontItemButton"
			auto-update
			placement="right-start"
			:offset="-4"
			portal-selector="[data-portal='builder-preview']"
		>
			<div
				:[DATA_ATTRIBUTE_SELECTOR]="DATA_ATTRIBUTE_SELECTOR_FONT_SELECT"
				class="font-select__item-options"
			>
				<div
					v-for="{ title, value } in validFontWeights"
					:key="value"
					v-qa="`edittext-textfont-option-${fontFamily}`"
					class="font-select__item-option z-body-small"
					:style="{
						fontFamily,
						fontWeight: value
					}"
					@click="$emit('update-font', {
						fontFamily,
						fontWeight: value,
					})"
				>
					{{ title }}
				</div>
			</div>
		</Popup>
	</div>
</template>

<script>
import Popup from '@/components/global/Popup.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import { defineComponent } from 'vue';
import {
	DATA_ATTRIBUTE_SELECTOR,
	DATA_ATTRIBUTE_SELECTOR_FONT_SELECT,
} from '@zyro-inc/site-modules/constants';

export default defineComponent({
	components: {
		Popup,
		ZyroSvgDeprecated,
	},

	props: {
		fontFamily: {
			type: String,
			required: true,
		},
		fontWeights: {
			type: Array,
			required: true,
		},
		fileType: {
			type: String,
			default: null,
		},
		validFontWeightsMap: {
			type: Object,
			default: () => ({
				300: {
					title: 'Light',
					value: '300',
				},
				regular: {
					title: 'Regular',
					value: '400',
				},
				400: {
					title: 'Regular',
					value: '400',
				},
				500: {
					title: 'Medium',
					value: '500',
				},
				700: {
					title: 'Bold',
					value: '700',
				},
			}),
		},
		isOpen: {
			type: Boolean,
			default: false,
		},
	},
	setup() {
		return {
			DATA_ATTRIBUTE_SELECTOR,
			DATA_ATTRIBUTE_SELECTOR_FONT_SELECT,
		};
	},
	computed: {
		validFontWeights() {
			return this.fontWeights
				.flatMap((weight) => this.validFontWeightsMap[weight] || []);
		},
		showFontWeightVariants() {
			return this.validFontWeights.length > 1;
		},
	},
});
</script>

<style lang="scss" scoped>
.font-select {
	&__item {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 6px 16px;

		&:hover {
			cursor: pointer;
			background: $color-gray-light;
		}

		&--active {
			background: $color-gray-light;
		}
	}

	&__item-text {
		margin-right: 8px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	&__item-options {
		width: 108px;
		padding: 8px 0;
		background: $color-light;
		border-radius: 5px;
		box-shadow: 0 6px 14px rgb(0 0 0 / 10%);
	}

	&__item-option {
		padding: 6px 16px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;

		&:hover {
			cursor: pointer;
			background: $color-gray-light;
		}
	}
}

.hidden {
	opacity: 0;
}
</style>
