<template>
	<div class="grid-shapes">
		<div
			v-for="shape in AVAILABLE_SHAPES"
			:key="shape.name"
			class="grid-shape"
		>
			<ZyroSvgDeprecated
				:name="shape.name"
				location="shapes"
				@click="updateShape(shape.name)"
			/>
		</div>
	</div>
</template>

<script>
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import {
	mapGetters,
	mapState,
	mapActions,
} from 'vuex';

import { AVAILABLE_SHAPES } from '@zyro-inc/site-modules/constants/shapes';
import svgImporter from '@/utils/svgImporter';
import { processSvg } from '@/utils/processSvg';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroSvgDeprecated,
	},

	setup() {
		return {
			AVAILABLE_SHAPES,
		};
	},

	computed: {
		...mapState(['currentElementId']),
		...mapGetters(['currentElement']),
	},

	methods: {
		...mapActions(['mergeCurrentElementData']),
		async updateShape(name) {
			const svg = await svgImporter.getSvg(name, 'shapes');

			this.mergeCurrentElementData({
				elementData: {
					svg: processSvg(svg),
					shape: name,
				},
				pushToHistory: true,
			});
		},
	},
});
</script>

<style lang="scss" scoped>
.grid-shapes {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	row-gap: 6px;
	column-gap: 6px;
	max-height: 400px;
	margin-top: 16px;
	overflow-y: auto;
}

.grid-shape {
	width: 77px;
	height: 77px;
	padding: 8px;
	background-color: transparent;
	border-radius: 3px;
	transition: background-color 0.2s ease-in-out;

	&:hover {
		cursor: pointer;
		background-color: rgb(245, 248, 251);
	}

	svg {
		width: 100%;
		height: 100%;
	}
}
</style>
