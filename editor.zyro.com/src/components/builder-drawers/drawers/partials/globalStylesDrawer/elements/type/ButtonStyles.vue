<template>
	<div>
		<div
			class="preview"
			:class="`preview--${previewBackgroundColor}`"
		>
			<GridButton
				:class="{ [`${element}-mobile`]: isMobileMode }"
				:content="buttonPreview.content"
				:type="buttonPreview.type"
				@click.prevent
			/>
		</div>

		<ZyroTabs
			:tabs="$options.TABS"
			:current-tab="currentTab"
			class="drawer__tabs"
			@update:current-tab="currentTab = $event"
		/>

		<div v-if="currentTab.id === 'style'">
			<ZyroCollapse
				size="x-large"
				has-separator
			>
				<template #trigger>
					<h3 class="z-body-small z-body-small--strong">
						Desktop
					</h3>
				</template>
				<div>
					<PaddingControl :element="element" />
					<BorderControl :element="element" />
					<ShadowControl :element="element" />
					<TextControl
						:is-mobile-font-size="false"
						:element="element"
						title="Button"
					/>
				</div>
			</ZyroCollapse>
			<ZyroCollapse
				size="x-large"
				has-separator
			>
				<template #trigger>
					<h3 class="z-body-small z-body-small--strong">
						Mobile
					</h3>
				</template>
				<div>
					<PaddingControl
						:element="element"
						mobile
					/>
					<div class="form-group form-group--no-border">
						<h3
							class="
							form-group__header
							form-group__header--padding
							z-subheading
							z-subheading--spaced"
						>
							Button text
						</h3>
						<div class="form-group__item form-grid form-grid--3">
							<StylePropertyControl
								:element="element"
								:property="PROPERTY_M_FONT_SIZE"
								label="Size"
							/>
						</div>
					</div>
				</div>
			</ZyroCollapse>
		</div>

		<div v-if="currentTab.id === 'interaction'">
			<StateGroupControl
				:element="element"
				:state="STATE_HOVER"
			/>
			<TransitionControl :element="element" />
		</div>
	</div>
</template>

<script>
import ZyroCollapse from '@/components/global/ZyroCollapse.vue';
import ZyroTabs from '@/components/global/ZyroTabs.vue';

import { mapGetters } from 'vuex';

import GridButton from '@zyro-inc/site-modules/components/elements/button/GridButton.vue';
import {
	PROPERTY_BACKGROUND_COLOR,
	PROPERTY_M_FONT_SIZE,
	STATE_HOVER,
} from '@zyro-inc/site-modules/constants/globalStyles';
import { capitalizeFirstLetter } from '@zyro-inc/site-modules/utils/modifyString';

import StylePropertyControl
	from '@/components/builder-drawers/drawers/partials/globalStylesDrawer/controls/StylePropertyControl.vue';
import BorderControl from '@/components/builder-drawers/drawers/partials/globalStylesDrawer/controls/sections/BorderControl.vue';
import PaddingControl
	from '@/components/builder-drawers/drawers/partials/globalStylesDrawer/controls/sections/PaddingControl.vue';
import ShadowControl from '@/components/builder-drawers/drawers/partials/globalStylesDrawer/controls/sections/ShadowControl.vue';
import StateGroupControl
	from '@/components/builder-drawers/drawers/partials/globalStylesDrawer/controls/sections/StateGroupControl.vue';
import TextControl from '@/components/builder-drawers/drawers/partials/globalStylesDrawer/controls/sections/TextControl.vue';
import TransitionControl
	from '@/components/builder-drawers/drawers/partials/globalStylesDrawer/controls/sections/TransitionControl.vue';
import { useElementContrast } from '@/use/useElementContrast';

import { defineComponent } from 'vue';

const TABS = [
	{
		id: 'style',
		title: 'Style',
	},
	{
		id: 'interaction',
		title: 'Interaction',
	},
];
const BUTTON_TYPES = {
	'grid-button-primary': 'primary',
	'grid-button-secondary': 'secondary',
};

export default defineComponent({
	TABS,

	components: {
		ZyroCollapse,
		ZyroTabs,
		StylePropertyControl,
		TransitionControl,
		StateGroupControl,
		TextControl,
		PaddingControl,
		ShadowControl,
		BorderControl,
		GridButton,
	},

	props: {
		element: {
			type: String,
			required: true,
		},
	},

	setup() {
		const { getElementContrast } = useElementContrast();

		return {
			getElementContrast,
			STATE_HOVER,
			PROPERTY_M_FONT_SIZE,
		};
	},

	data() {
		return {
			currentTab: TABS[0],
		};
	},

	computed: {
		...mapGetters('gui', ['isMobileMode']),
		buttonPreview() {
			return {
				content: capitalizeFirstLetter(BUTTON_TYPES[this.element]),
				type: BUTTON_TYPES[this.element],
			};
		},
		previewBackgroundColor() {
			return this.getElementContrast(this.element, PROPERTY_BACKGROUND_COLOR);
		},
	},
});
</script>

<style lang="scss" scoped>
@import "@/components/builder-drawers/drawers/partials/forms";
@import "@/components/builder-drawers/drawers/StylesDrawer";
</style>
