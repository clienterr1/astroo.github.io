<template>
	<div>
		<Fonts
			v-for="fontType in FONT_TYPES"
			:key="fontType"
			:font-type="fontType"
		/>
		<ZyroCollapse
			v-for="level in TEXT_EDITOR_LEVELS_HEADING"
			:key="level"
			class="element"
			size="large"
		>
			<template #trigger>
				<h2 class="element__name z-body-small z-body-small--strong">
					{{ $t('common.heading') }} {{ level }}
				</h2>
			</template>
			<div>
				<TextBoxPreview :element="`h${level}`" />
				<TextControl :element="`h${level}`" />
			</div>
		</ZyroCollapse>
		<ZyroCollapse
			v-for="element in TEXT_ELEMENTS"
			:key="element"
			class="element"
			size="large"
		>
			<template #trigger>
				<h2 class="element__name z-body-small z-body-small--strong">
					{{ element }}
				</h2>
			</template>
			<div>
				<TextBoxPreview
					element="p"
					:preview-class="element"
				/>
				<TextControl :element="element" />
			</div>
		</ZyroCollapse>
	</div>
</template>
<script>
import ZyroCollapse from '@/components/global/ZyroCollapse.vue';

import {
	PROPERTY_FONT_PRIMARY,
	PROPERTY_FONT_SECONDARY,
} from '@zyro-inc/site-modules/constants/globalStyles';

import TextControl
	from '@/components/builder-drawers/drawers/partials/globalStylesDrawer/controls/sections/TextControl.vue';
import Fonts from '@/components/builder-drawers/drawers/partials/globalStylesDrawer/typography/Fonts.vue';
import TextBoxPreview from '@/components/builder-drawers/drawers/partials/stylesMisc/TextBoxPreview.vue';
import {
	TEXT_EDITOR_LEVELS_HEADING,
	TEXT_EDITOR_TEXT_TYPES_PARAGRAPH,
} from '@/constants';

import { defineComponent } from 'vue';

const TEXT_ELEMENTS = [
	...TEXT_EDITOR_TEXT_TYPES_PARAGRAPH.map(({ type }) => type),
	'nav-link',
];

const FONT_TYPES = [
	PROPERTY_FONT_PRIMARY,
	PROPERTY_FONT_SECONDARY,
];

export default defineComponent({
	components: {
		ZyroCollapse,
		TextBoxPreview,
		Fonts,
		TextControl,
	},

	setup() {
		return {
			TEXT_EDITOR_LEVELS_HEADING,
			TEXT_ELEMENTS,
			FONT_TYPES,
		};
	},
});
</script>

<style lang="scss" scoped>
@import "@/components/builder-drawers/drawers/partials/forms";

.preview {
	padding: 0;
}

:deep(.text-box) {
	padding: 24px;
}

.element {
	border-top: 1px solid $color-gray-light;

	&__name {
		margin-right: 10px;
		text-transform: capitalize;
	}
}

</style>
