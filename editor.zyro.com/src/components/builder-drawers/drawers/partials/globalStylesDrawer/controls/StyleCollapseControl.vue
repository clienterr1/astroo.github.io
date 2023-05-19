<template>
	<div
		class="collapse-control"
		:class="{ 'is-disabled': !isStyleEnabled }"
	>
		<ZyroCollapse
			collapse-indication="toggle"
			:is-open="isStyleEnabled"
			@toggle="toggleStyle"
		>
			<template #trigger>
				<h3 class="form-group__header z-subheading z-subheading--spaced">
					{{ collapseTitle }}
				</h3>
			</template>
			<slot />
		</ZyroCollapse>
	</div>
</template>

<script>
import ZyroCollapse from '@/components/global/ZyroCollapse.vue';

import {
	mapGetters,
	mapMutations,
} from 'vuex';

import { PROPERTY_BACKGROUND_COLOR_NULL } from '@zyro-inc/site-modules/constants/globalStyles';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroCollapse,
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
		collapseTitle: {
			type: String,
			required: true,
		},
	},

	computed: {
		...mapGetters(['siteStyles']),
		isStyleEnabled() {
			return this.siteStyles[this.element][this.property] !== this.getDisabledStyleProperty;
		},
		getDisabledStyleProperty() {
			if (this.property === PROPERTY_BACKGROUND_COLOR_NULL) {
				return 'transparent';
			}

			return 'none';
		},
	},

	methods: {
		...mapMutations(['setStyleProperty']),
		toggleStyle() {
			if (!this.isStyleEnabled) {
				this.setStylePropertyValue('');

				return;
			}

			this.setStylePropertyValue(this.getDisabledStyleProperty);
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
@import "@/components/builder-drawers/drawers/partials/forms";

.collapse-control {
	padding-top: 16px;

	&.is-disabled {
		padding-bottom: 16px;
		border-bottom: 1px solid $color-gray-light;
	}
}
</style>
