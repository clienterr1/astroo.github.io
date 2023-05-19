<template>
	<GridButton
		:tag-name="tagName"
		:href="href"
		:target="target"
		:rel="rel"
		:type="type"
		:button-type="buttonType"
		:content="content"
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
		:mobile-element-width="mobileElementWidth"
		:mobile-element-height="mobileElementHeight"
	/>
</template>

<script>
import {
	defineComponent,
	computed,
} from 'vue';
import { useStore } from 'vuex';

import GridButton from '@zyro-inc/site-modules/components/elements/button/GridButton.vue';
import { useGridButton } from '@zyro-inc/site-modules/components/elements/button/useGridButton';

export default defineComponent({
	name: 'GridButtonProviderUser',

	components: {
		GridButton,
	},

	props: {
		data: {
			type: Object,
			required: true,
		},
		currentLocale: {
			type: String,
			required: true,
		},
		mobileElementWidth: {
			type: Number,
			default: null,
		},
		mobileElementHeight: {
			type: Number,
			default: null,
		},
	},

	setup(props, context) {
		const { getters } = useStore();
		const {
			tagName,
			href,
			target,
			rel,
			type,
			buttonType,
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
			href: computed(() => getters.getButtonHref({
				isFormButton: props.data.settings.isFormButton,
				linkedPageId: props.data.linkedPageId,
				linkType: props.data.linkType,
				href: props.data.href,
			})),
		});

		return {
			tagName,
			href,
			target,
			rel,
			type,
			buttonType,
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
