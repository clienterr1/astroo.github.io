<template>
	<div class="expandable-item">
		<button
			v-qa="`expandable-settings-${title}-tab`"
			class="expandable-item__button z-body-small z-body-small--strong"
			@click="isOpen = !isOpen"
		>
			<div class="expandable-item__button-content">
				<ZyroSvgDeprecated
					name="chevron"
					dimensions="10px"
					class="expandable-item__arrow"
					:direction="isOpen ? 'down' : 'right'"
				/>
				<p>
					{{ title }}
				</p>
			</div>
		</button>
		<Transition name="slide-top-to-bottom">
			<div
				v-if="isOpen"
				class="expandable-item__content"
			>
				<slot />
			</div>
		</Transition>
	</div>
</template>

<script>
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroSvgDeprecated,
	},

	props: {
		title: {
			type: String,
			required: true,
		},
		shouldOpenAtLoad: {
			type: Boolean,
			default: false,
		},
	},

	data() {
		return {
			isOpen: false,
		};
	},

	created() {
		this.isOpen = this.shouldOpenAtLoad;
	},
});
</script>

<style lang="scss" scoped>
.expandable-item {
	$this: &;

	display: flex;
	flex-direction: column;

	&:not(:last-child) {
		#{$this}__button {
			border-bottom: 1px solid $color-gray-light;
		}
	}

	&__button {
		width: 100%;
		cursor: pointer;
	}

	&__button-content {
		display: flex;
		align-items: center;
		padding: 16px;
		margin: 0 8px;
	}

	&__arrow {
		margin-right: 12px;
	}

	&__content {
		padding: 24px;
		background-color: $color-gray-light;
	}
}
</style>
