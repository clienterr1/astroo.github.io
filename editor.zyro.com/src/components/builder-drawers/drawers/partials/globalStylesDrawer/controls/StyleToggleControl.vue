<template>
	<ZyroButton
		class="toggle-control"
		:class="{ 'toggle-control--enabled': isStyleEnabled }"
		border-radius="0"
		@click="toggleStyle"
	>
		<template #icon>
			<Icon
				:name="toggleValue"
				dimensions="16px"
				is-custom
			/>
		</template>
	</ZyroButton>
</template>

<script>
import Icon from '@/components/global/Icon.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';

import {
	mapGetters,
	mapMutations,
} from 'vuex';

import { defineComponent } from 'vue';

const DEFAULT_TOGGLE_VALUE = 'none';

export default defineComponent({
	name: 'StyleToggleControl',

	components: {
		Icon,
		ZyroButton,
	},

	props: {
		element: {
			type: String,
			required: true,
		},
		property: {
			type: String,
			required: true,
		},
		toggleValue: {
			type: String,
			required: true,
		},
	},

	computed: {
		...mapGetters(['siteStyles']),
		isStyleEnabled() {
			return Boolean(this.siteStyles[this.element][this.property] !== DEFAULT_TOGGLE_VALUE);
		},
	},

	methods: {
		...mapMutations(['setStyleProperty']),
		toggleStyle() {
			if (!this.isStyleEnabled || this.siteStyles[this.element][this.property] === undefined) {
				this.setStylePropertyValue(this.toggleValue);

				return;
			}

			this.setStylePropertyValue(DEFAULT_TOGGLE_VALUE);
		},
		setStylePropertyValue(value) {
			this.setStyleProperty({
				element: this.element,
				property: this.property,
				value,
			});
		},
	},
});
</script>

<style lang="scss" scoped>
.toggle-control {
	width: 36px;
	height: 36px;
	cursor: pointer;
	border: 0;

	&:hover {
		color: $color-dark;
		background-color: $color-gray-light;
	}

	&:focus {
		color: $color-dark;
	}

	&--enabled {
		background-color: $color-gray-light;
	}
}
</style>
