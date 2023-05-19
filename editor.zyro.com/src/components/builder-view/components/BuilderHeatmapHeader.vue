<template>
	<div
		v-if="isHeatmapOpen"
		ref="header"
		class="heatmap-header"
		:[DATA_ATTRIBUTE_SELECTOR]="DATA_ATTRIBUTE_SELECTOR_HEATMAP"
		:style="headerStyle"
	>
		<div class="heatmap-header__controls">
			<ZyroButton
				v-qa="'builder-heatmap-close'"
				theme="primary"
				size="xs"
				color="blue"
				class="heatmap-header__close"
				@click="closeHeatmap"
			>
				<template #icon>
					<Icon
						name="close"
						dimensions="16px"
					/>
				</template>
			</ZyroButton>
			<div class="heatmap-header__label z-subheading">
				{{ $t('builder.AIHeatmapLabel') }}
			</div>
		</div>
		<div class="heatmap-header__text z-body-small">
			<ZyroSvgDeprecated
				class="heatmap-header__more-icon"
				name="info-circle"
			/>
			{{ $t('builder.AIHeatmapText') }}
			<a
				v-if="!isHostingerBrand"
				:href="moreHref"
				target="_blank"
			>
				{{ $t('builder.AIHeatmapMore') }}
			</a>
		</div>
	</div>
</template>

<script>
import Icon from '@/components/global/Icon.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';
import { WWW_REDIRECT_PATHS } from '@/constants';
import {
	DATA_ATTRIBUTE_SELECTOR,
	DATA_ATTRIBUTE_SELECTOR_HEATMAP,
} from '@zyro-inc/site-modules/constants';
import {
	mapStateGui,
	mapActionsGui,
	CLOSE_HEATMAP,
} from '@/store/builder/gui';
import { getRedirectUrlToWWW } from '@/use/useRedirects';
import { isHostingerBrand } from '@/utils/isHostingerBrand';
import { defineComponent } from 'vue';

const { AI_HEATMAP } = WWW_REDIRECT_PATHS;

export default defineComponent({
	components: {
		Icon,
		ZyroButton,
		ZyroSvgDeprecated,
	},

	setup() {
		const moreHref = getRedirectUrlToWWW({
			path: AI_HEATMAP,
		});

		return {
			isHostingerBrand,
			moreHref,
			DATA_ATTRIBUTE_SELECTOR,
			DATA_ATTRIBUTE_SELECTOR_HEATMAP,
		};
	},

	computed: {
		...mapStateGui(['isHeatmapOpen']),
		headerStyle() {
			if (this.isHeatmapOpen) {
				return {};
			}

			const { top } = this.$refs.header.getBoundingClientRect();

			return {
				top: `${top}px`,
			};
		},
	},
	methods: mapActionsGui({
		closeHeatmap: CLOSE_HEATMAP,
	}),
});
</script>

<style lang="scss" scoped>
.heatmap-header {
	display: flex;
	justify-content: space-between;
	min-height: 48px;
	padding: 0 6px 0 ($sidebar-width-editor + 6px);
	color: $color-light;
	background-color: $color-azure;
	transition: height 200ms $transition-timing-easing-standard;

	&__controls {
		display: flex;
		align-items: center;
	}

	&__close {
		margin-right: 8px;
	}

	&__label {
		margin-right: 8px;
	}

	&__text {
		display: flex;
		gap: 8px;
		align-items: center;
		padding-right: 32px;
		text-align: center;
	}

	&__more-icon {
		width: 16px;
		height: 16px;
		vertical-align: middle;
	}
}
</style>
