<template>
	<div>
		<ZyroButton
			ref="triggerButton"
			v-qa="'builder-sidebar-btn-aitools'"
			class="sidebar-popup__trigger-button z-body-small z-body-small--strong"
			color="white"
			:title="title"
		>
			<template #icon-left>
				<Icon
					name="auto_awesome"
					is-filled
				/>
			</template>
			<p v-if="isSidebarExpanded">
				{{ title }}
			</p>
		</ZyroButton>
		<Popup
			v-if="isActive"
			class="sidebar-popup"
			:target-ref="$refs.triggerButton?.$el"
			auto-update
			@click-outside="$emit('close-popup')"
		>
			<ul class="sidebar-popup__content">
				<li
					v-for="aiTool in aiTools"
					:key="aiTool.title"
					class="sidebar-popup__list-item"
					:class="{ 'sidebar-popup__list-item--disabled': aiTool.isDisabled }"
				>
					<ZyroButton
						v-qa="`builder-sidebar-btn-aitool${aiTool.title}`"
						class="sidebar-popup__button z-body-small"
						:title="aiTool.title"
						:disabled="aiTool.isDisabled"
						@click.stop="aiTool.clickHandler(), $emit('close-popup')"
					>
						<template #icon-left>
							<Icon
								:name="aiTool.icon"
								dimensions="32px"
								is-custom
							/>
						</template>
						{{ aiTool.title }}
					</ZyroButton>
				</li>
			</ul>
		</Popup>
	</div>
</template>

<script>
import Icon from '@/components/global/Icon.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';
import Popup from '@/components/global/Popup.vue';

import { mapState } from 'vuex';

import { DRAWER_AI_WRITER } from '@/constants';
import {
	mapActionsGui,
	TOGGLE_DRAWER,
	TOGGLE_HEATMAP,
} from '@/store/builder/gui';
import { getLogoMakerUrl } from '@zyro-inc/site-modules/utils/getLogoMakerUrl';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		Icon,
		ZyroButton,
		Popup,
	},

	props: {
		isActive: {
			type: Boolean,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
	},

	emits: [
		'toggle',
		'close-popup',
	],

	computed: {
		...mapState(['isDemoMode']),
		...mapState('gui', ['isSidebarExpanded']),
		aiTools() {
			return [
				{
					id: 'logo',
					isDisabled: false,
					title: this.$t('builder.logoMaker'),
					icon: 'logo-maker',
					iconDimensions: '40px',
					clickHandler: () => window.open(getLogoMakerUrl({
						ref: 'sidebar-ai-features',
					}), '_blank'),
				},
				{
					id: 'writer',
					isDisabled: this.isDemoMode,
					title: this.$t('builder.AIWriter.title'),
					icon: 'app-ai-text-generator-hostinger',
					clickHandler: () => this.toggleDrawer(DRAWER_AI_WRITER),
				},
				{
					id: 'heatmap',
					isDisabled: this.isDemoMode,
					title: this.$t('builder.AIHeatmapLabel'),
					icon: 'app-ai-heatmap-hostinger',
					clickHandler: this.toggleHeatmap,
				},
			];
		},
	},

	methods: {
		...mapActionsGui({
			toggleDrawer: TOGGLE_DRAWER,
			toggleHeatmap: TOGGLE_HEATMAP,
		}),
	},
});
</script>

<style lang="scss" scoped>
@import "./BuilderSidebarPopup";
</style>
