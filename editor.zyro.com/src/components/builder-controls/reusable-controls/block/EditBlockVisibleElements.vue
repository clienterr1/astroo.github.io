<template>
	<div class="visible-elements">
		<!-- TODO: https://github.com/zyro-inc/zyro/issues/1992 make this improvement and then update this -->
		<ZyroLabel class="visible-elements__text-colors">
			{{ $t('common.textColors') }}
		</ZyroLabel>
		<ZyroRadioList
			:model-value="textColor"
			class="visible-elements__radio-list"
			:options="textColorsOptions"
			@update:model-value="updateTextColor"
		/>
		<ZyroLabel class="visible-elements__visibility">
			{{ $t('common.visibility') }}
		</ZyroLabel>
		<div class="visible-elements__list">
			<template
				v-for="(value, key, index) in valueMap"
				:key="key"
			>
				<div
					class="visible-elements__list-item"
					:class="{ 'visible-elements__list-item--disabled': !currentBlockSettings.shownItems[key] }"
					:data-qa="`visibility-${key.toLowerCase()}-button`"
					@click="handleToggle(key)"
				>
					<ZyroLabel
						:bold="false"
						class="visible-elements__list-item-label"
					>
						{{ value }}
					</ZyroLabel>
					<ZyroSvgDeprecated :name="currentBlockSettings.shownItems[key] ? 'eye-open' : 'eye-closed'" />
				</div>
				<ZyroSeparator v-if="index !== valueMapLength - 1" />
			</template>
		</div>
	</div>
</template>

<script>

import { defineComponent } from 'vue';
import {
	mapState,
	mapGetters,
	mapActions,
} from 'vuex';
import { useI18n } from 'vue-i18n';

import ZyroLabel from '@/components/global/ZyroLabel.vue';
import ZyroRadioList from '@/components/global/ZyroRadioList.vue';
import ZyroSeparator from '@/components/global/ZyroSeparator.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

const TEXT_COLOR_OPTION_DARK = 'dark';
const TEXT_COLOR_OPTION_LIGHT = 'light';

const LIGHT_COLOR = 'rgb(255, 255, 255)';
const DARK_COLOR = 'rgb(0, 0, 0)';

export default defineComponent({
	components: {
		ZyroLabel,
		ZyroRadioList,
		ZyroSeparator,
		ZyroSvgDeprecated,
	},

	props: {
		valueMap: {
			type: Object,
			required: true,
		},
	},

	setup() {
		const { t } = useI18n();

		const textColorsOptions = {
			[TEXT_COLOR_OPTION_DARK]: {
				name: t('common.dark'),
			},
			[TEXT_COLOR_OPTION_LIGHT]: {
				name: t('common.light'),
			},
		};

		return {
			textColorsOptions,
		};
	},

	computed: {
		...mapState(['currentBlockId']),
		...mapGetters(['currentBlockSettings']),
		valueMapLength() {
			return Object.keys(this.valueMap).length;
		},
		textColor() {
			const { styles } = this.currentBlockSettings;
			const isCurrentColorLight = styles['blog-post-header-text-color'] === LIGHT_COLOR;

			return isCurrentColorLight ? TEXT_COLOR_OPTION_LIGHT : TEXT_COLOR_OPTION_DARK;
		},
	},

	methods: {
		...mapActions(['updateBlockData']),
		updateTextColor(newValue) {
			this.updateBlockData({
				blockId: this.currentBlockId,
				blockData: {
					settings: {
						styles: {
							'blog-post-header-text-color': newValue === TEXT_COLOR_OPTION_DARK
								? DARK_COLOR
								: LIGHT_COLOR,
						},
					},
				},
				merge: true,
			});
		},
		handleToggle(key) {
			const toggledValue = !this.currentBlockSettings.shownItems[key];

			this.updateBlockData({
				blockId: this.currentBlockId,
				blockData: {
					settings: {
						shownItems: {
							[key]: toggledValue,
						},
					},
				},
				merge: true,
			});
		},
	},
});
</script>

<style lang="scss" scoped>
.visible-elements {
	&__text-colors {
		margin-bottom: 12px;
	}

	&__radio-list {
		margin-bottom: 32px;
	}

	&__visibility {
		margin-bottom: 16px;
	}

	&__list {
		display: flex;
		flex-direction: column;
		max-height: 200px;
		overflow-y: auto;
	}

	&__list-item {
		display: flex;
		padding: 10px 16px 10px 0;
		cursor: pointer;
		border-radius: 16px;
		transition: color 0.2s ease-in-out, background 0.3s ease-in-out;

		&--disabled {
			color: $color-gray;
		}

		&:hover,
		&:focus {
			background-color: $color-gray-border;
		}
	}

	&__list-item-label {
		padding-left: 16px;
		line-height: 16px;
	}
}
</style>
