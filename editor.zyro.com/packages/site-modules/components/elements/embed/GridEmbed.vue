<template>
	<div
		:id="id"
		v-qa="'builder-gridelement-gridembed'"
		class="grid-embed"
		:style="computedStyles"
	>
		<iframe
			v-if="shouldRender"
			ref="gridEmbedIframeRef"
			class="grid-embed__iframe"
			:srcdoc="srcdoc"
			title="custom code element"
			@load="observeGridEmbed"
		/>
	</div>
</template>

<script>

import { defineComponent } from 'vue';

export default defineComponent({
	name: 'GridEmbed',

	props: {
		srcdoc: {
			type: String,
			default: '',
		},
		shouldRender: {
			type: Boolean,
			default: false,
		},
		height: {
			type: Number,
			default: null,
		},
		id: {
			type: String,
			required: true,
		},
	},

	emits: ['iframe-height-updated'],

	data() {
		return {
			observedHeight: null,
		};
	},

	computed: {
		embedHeight() {
			if (this.height && (this.observedHeight > this.height)) {
				return this.observedHeight;
			}

			return this.height || this.observedHeight;
		},
		computedStyles() {
			return {
				'--height': `${this.embedHeight}px`,
			};
		},
	},

	methods: {
		observeGridEmbed() {
			const iframeHtml = this.$refs.gridEmbedIframeRef.contentWindow.document.querySelector('html');

			const observerResizer = new ResizeObserver(([{ contentRect }]) => {
				requestAnimationFrame(() => {
					const { height } = contentRect;

					if (height !== this.observedHeight) {
						this.observedHeight = height;
						this.$emit('iframe-height-updated', this.observedHeight);
					}
				});
			});

			observerResizer.observe(iframeHtml);
		},
	},
});
</script>

<style lang="scss">
.grid-embed {
	width: 100%;
	height: auto;

	&__iframe {
		width: 100%;
		height: var(--height);
		overflow: hidden;
		border: none;
	}
}
</style>
