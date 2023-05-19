<template>
	<GridEmbed
		v-if="data.content"
		:id="id"
		class="grid-embed-builder"
		:srcdoc="srcdoc"
		should-render
		:height="data.settings.styles.height"
		@iframe-height-updated="setEmbedHeight($event)"
	/>
	<div
		v-else
		class="empty-state"
	>
		<p class="empty-state__title z-body z-body--strong">
			{{ $t('builder.embed.thisElementIsEmpty') }}
		</p>
		<p class="empty-state__subtext z-body">
			{{ $t('builder.embed.contentWillAppear') }}
		</p>
		<ZyroButton
			v-qa="`gridembedbuilder-entercode-btn`"
			theme="primary"
			@click="enterElementEditMode()"
		>
			{{ $t('common.enterCode') }}
		</ZyroButton>
	</div>
</template>
<script>
import ZyroButton from '@/components/global/ZyroButton.vue';

import { mapActions } from 'vuex';

import GridEmbed from '@zyro-inc/site-modules/components/elements/embed/GridEmbed.vue';
import { constructSrcdoc } from '@zyro-inc/site-modules/components/elements/embed/constructSrcdoc';

import { defineComponent } from 'vue';

export default defineComponent({
	name: 'GridEmbedProviderBuilder',

	components: {
		ZyroButton,
		GridEmbed,
	},

	props: {
		id: {
			type: String,
			required: true,
		},
		data: {
			type: Object,
			required: true,
		},
	},

	computed: {
		srcdoc() {
			return constructSrcdoc(this.data.content);
		},
	},

	methods: {
		...mapActions([
			'enterElementEditMode',
			'mergeElementData',
		]),
		setEmbedHeight(height) {
			this.mergeElementData({
				elementId: this.id,
				elementData: {
					settings: {
						styles: {
							height,
						},
					},
				},
			});
		},
	},
});
</script>

<style lang="scss" scoped>
.grid-embed-builder {
	pointer-events: none;
}

.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100%;
	padding: 8px;
	text-align: center;
	background: $color-gray-light;

	&__title {
		margin-bottom: 8px;
	}

	&__subtext {
		margin-bottom: 24px;
		color: $color-gray;
	}
}
</style>
