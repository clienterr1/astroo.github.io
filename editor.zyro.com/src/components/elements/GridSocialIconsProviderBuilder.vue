<template>
	<div>
		<GridSocialIcons
			v-bind="composedProps"
			prevent-links
		/>
		<WarningTooltip v-if="showWarning && !isBlockPreviewMode">
			{{ $t('builder.socialIconsNoLinks') }}
		</WarningTooltip>
	</div>
</template>

<script>
import WarningTooltip from '@zyro-inc/site-modules/components/WarningTooltip.vue';
import GridSocialIcons from '@zyro-inc/site-modules/components/elements/social-icons/GridSocialIcons.vue';
import { useGridSocialIcons } from '@zyro-inc/site-modules/components/elements/social-icons/useGridSocialIcons';
import { DEFAULT_SOCIAL_LINKS } from '@zyro-inc/site-modules/constants/defaultSocialLinks';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		GridSocialIcons,
		WarningTooltip,
	},

	props: {
		data: {
			type: Object,
			required: true,
		},
		isBlockPreviewMode: {
			type: Boolean,
			default: false,
		},
	},

	setup(props, context) {
		return {
			composedProps: useGridSocialIcons(props, context),
		};
	},

	computed: {
		showWarning() {
			return this.data.links.some((link) => {
				const defaultSocialLink = DEFAULT_SOCIAL_LINKS[link.icon];

				return defaultSocialLink ? link.link === defaultSocialLink.link : false;
			});
		},
	},
});
</script>
