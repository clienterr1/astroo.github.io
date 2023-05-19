<template>
	<ZyroDrawer class="drawer">
		<div class="style-list">
			<div class="drawer__title z-h5">
				<ZyroButton
					v-if="currentPageId !== $options.DEFAULT_PAGE_ID"
					@click="currentPageId = $options.DEFAULT_PAGE_ID"
				>
					<template #icon>
						<ZyroSvgDeprecated
							dimensions="16px"
							name="arrow"
							direction="left"
						/>
					</template>
				</ZyroButton>
				{{ currentPage.title }}
			</div>
			<Component
				:is="currentPage.component"
				:element="currentPageId"
				@change-page="currentPageId = $event"
			/>
		</div>
	</ZyroDrawer>
</template>

<script>
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroDrawer from '@/components/global/ZyroDrawer.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import GlobalStyles from '@/components/builder-drawers/drawers/partials/globalStylesDrawer/GlobalStyles.vue';
import ButtonStyles from '@/components/builder-drawers/drawers/partials/globalStylesDrawer/elements/type/ButtonStyles.vue';
import {
	UPDATE_CURRENT_FONT_STYLES,
	mapActionsFonts,
} from '@/store/builder/fonts';

import { defineComponent } from 'vue';

const PAGES = {
	'global-styles': {
		title: 'Styles',
		component: 'GlobalStyles',
	},
	'grid-button-primary': {
		title: 'Primary button',
		component: 'ButtonStyles',
	},
	'grid-button-secondary': {
		title: 'Secondary button',
		component: 'ButtonStyles',
	},
};
const DEFAULT_PAGE_ID = 'global-styles';

export default defineComponent({
	PAGES,
	DEFAULT_PAGE_ID,

	components: {
		ZyroButton,
		ZyroDrawer,
		ZyroSvgDeprecated,
		GlobalStyles,
		ButtonStyles,
	},

	data() {
		return {
			currentPageId: DEFAULT_PAGE_ID,
		};
	},

	computed: {
		currentPage() {
			return PAGES[this.currentPageId];
		},
	},

	mounted() {
		this.updateCurrentFontStyles();
	},

	methods: {
		...mapActionsFonts({
			updateCurrentFontStyles: UPDATE_CURRENT_FONT_STYLES,
		}),
	},
});
</script>

<style lang="scss" scoped>
@import "@/components/builder-drawers/drawers/StylesDrawer";
</style>
