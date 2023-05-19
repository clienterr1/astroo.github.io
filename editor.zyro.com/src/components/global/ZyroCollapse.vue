<template>
	<div class="zyro-collapse">
		<button
			class="zyro-collapse__trigger"
			:class="[
				{ [`trigger--${size}`]: size },
				{ 'trigger--seperator': !isVisible && hasSeparator }
			]"
			@click="handleTriggerClick"
		>
			<slot
				name="trigger"
				:isVisible="isVisible"
			/>
			<ZyroSvgDeprecated
				v-if="collapseIndication === 'chevron'"
				name="chevron"
				:direction="isVisible ? 'up' : 'down'"
			/>
			<ZyroToggle
				v-if="collapseIndication === 'toggle'"
				:model-value="isVisible"
			/>
		</button>

		<slot v-if="isVisible" />
	</div>
</template>

<script>
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';
import ZyroToggle from '@/components/global/ZyroToggle.vue';

import { defineComponent } from 'vue';

export default defineComponent({

	components: {
		ZyroSvgDeprecated,
		ZyroToggle,
	},

	props: {
		isOpen: {
			type: Boolean,
			default: false,
		},
		collapseIndication: {
			type: String,
			default: 'chevron',
			validator(value) {
				return [
					'chevron',
					'toggle',
				].includes(value);
			},
		},
		size: {
			type: String,
			default: null,
			validator(value) {
				return [
					'large',
					'x-large',
				].includes(value);
			},
		},
		hasSeparator: {
			type: Boolean,
			default: false,
		},
	},
	emits: ['toggle'],

	data() {
		return {
			isVisible: false,
		};
	},

	watch: {
		isOpen(newValue) {
			this.isVisible = newValue;
		},
	},

	created() {
		this.isVisible = this.isOpen;
	},

	methods: {
		handleTriggerClick() {
			this.isVisible = !this.isVisible;
			this.$emit('toggle');
		},
	},
});
</script>

<style lang="scss" scoped>
.zyro-collapse {
	&__trigger {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: 4px 0;
		cursor: pointer;

		&--large {
			padding: 12px 0;
		}

		&--x-large {
			padding: 16px 0;
		}

		&--seperator {
			border-bottom: 1px solid $color-gray-light;
		}
	}
}
</style>
