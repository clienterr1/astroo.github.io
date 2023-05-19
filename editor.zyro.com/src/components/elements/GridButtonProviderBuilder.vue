<template>
	<GridButton
		:tag-name="tagName"
		:href="href"
		:target="target"
		:rel="rel"
		:type="type"
		:content="content"
		data-qa="builder-gridelement-gridbutton"
		:font-size-mobile="fontSizeMobile"
		:font-size-desktop="fontSizeDesktop"
		:font-family="fontFamily"
		:font-weight="fontWeight"
		:border-width="borderWidth"
		:border-radius="borderRadius"
		:background-color="backgroundColor"
		:font-color="fontColor"
		:border-color="borderColor"
		:background-color-hover="backgroundColorHover"
		:font-color-hover="fontColorHover"
		:border-color-hover="borderColorHover"
		is-in-builder
		@click.prevent
		@drag.prevent
		@dragstart.prevent
	/>
</template>

<script>
import {
	defineComponent,
	computed,
} from 'vue';
import GridButton from '@zyro-inc/site-modules/components/elements/button/GridButton.vue';
import { useGridButton } from '@zyro-inc/site-modules/components/elements/button/useGridButton';

export default defineComponent({
	name: 'GridButtonProviderBuilder',

	components: {
		GridButton,
	},

	props: {
		data: {
			type: Object,
			required: true,
		},
	},

	setup(props, context) {
		const {
			tagName,
			href,
			target,
			rel,
			type,
			content,
			fontSizeMobile,
			fontSizeDesktop,
			fontFamily,
			fontWeight,
			borderWidth,
			borderRadius,
			backgroundColor,
			fontColor,
			borderColor,
			backgroundColorHover,
			fontColorHover,
			borderColorHover,
		} = useGridButton(props, context, {
			href: computed(() => props.data.href),
		});

		return {
			tagName,
			href,
			target,
			rel,
			type,
			content,
			fontSizeMobile,
			fontSizeDesktop,
			fontFamily,
			fontWeight,
			borderWidth,
			borderRadius,
			backgroundColor,
			fontColor,
			borderColor,
			backgroundColorHover,
			fontColorHover,
			borderColorHover,
		};
	},
});
</script>
