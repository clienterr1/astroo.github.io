<template>
	<div
		v-if="isSearchOpen"
		class="search-backdrop"
		@mousedown.self.prevent="closeSearch"
	>
		<div class="search-container">
			<SpotlightSearchBar />
			<SpotlightSearchListBox />
			<div
				class="search-nps"
				@click="openNps"
			>
				<ZyroSvgDeprecated
					class="search-nps__icon"
					name="smiley-face"
				/>
				<p>
					{{ $t('common.searchRateNps') }}
				</p>
			</div>
		</div>
	</div>
</template>
<script>
import {
	onMounted,
	onBeforeUnmount,
	defineComponent,
} from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';
import SpotlightSearchBar from '@/components/spotlight/SpotlightSearchBar.vue';
import SpotlightSearchListBox from '@/components/spotlight/SpotlightSearchListBox.vue';
import { NPS_TYPE_FEATURE_SEARCH } from '@/constants';
import { useSpotlight } from '@/components/spotlight/useSpotlight';

export default defineComponent({
	name: 'SpotlightSearch',
	components: {
		ZyroSvgDeprecated,
		SpotlightSearchBar,
		SpotlightSearchListBox,
	},
	setup() {
		const {
			closeSearch,
			isSearchOpen,
			onKeyDownPressed,
		} = useSpotlight();

		const { t } = useI18n();
		const { dispatch } = useStore();

		const openNps = () => {
			dispatch('nps/setNpsData', {
				question: `${t('builder.npsRateQuestion')} ${t('common.search')}?`,
				isVisible: true,
				formType: NPS_TYPE_FEATURE_SEARCH,
			});
			closeSearch();
		};

		onMounted(() => {
			window.addEventListener('keydown', onKeyDownPressed);
		});

		onBeforeUnmount(() => {
			window.removeEventListener('keydown', onKeyDownPressed);
		});

		return {
			isSearchOpen,
			closeSearch,
			openNps,
		};
	},
});
</script>
<style lang="scss" scoped>
@keyframes scale {
	0% {
		scale: 0.3;
	}

	80% {
		scale: 1.1;
	}

	100% {
		scale: 1;
	}
}

.search-backdrop {
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	z-index: $z-index-popup;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	cursor: pointer;
	background: none;
	transition: all 0.3s ease;
}

.search-container {
	position: relative;
	border-radius: 8px;
	border-bottom-right-radius: 0;
	box-shadow: 0 16px 70px rgba(0, 0, 0, 20%);
	animation-name: scale;
	animation-duration: 0.15s;
}

.search-nps {
	position: absolute;
	right: 24px;
	bottom: 4px;
	display: flex;
	flex-direction: row;
	align-items: center;
	padding: 4px 8px;
	color: $color-gray;
	cursor: pointer;
	border: 1px solid $color-gray;
	border-radius: 4px;

	&__icon {
		width: 16px;
		height: 16px;
		margin-right: 4px;
	}
}
</style>
