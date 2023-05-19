<template>
	<ZyroCollapse
		class="drawer-collapsible"
		:class="[
			{
				'drawer-collapsible--highlighted': isOpen,
				'drawer-collapsible--with-top-border': hasTopBorder,
				'drawer-collapsible--with-bottom-border': hasBottomBorder,
			}
		]"
		:is-open="isOpen"
		@toggle="$emit('toggle')"
	>
		<template #trigger>
			<div class="drawer-collapsible__heading">
				<ZyroSvgDeprecated
					v-if="icon"
					class="drawer-collapsible__icon"
					:name="icon"
				/>

				<p class="z-body-small">
					<slot name="title" />
				</p>
			</div>
		</template>
		<div class="drawer-collapsible__content">
			<slot />
		</div>
	</ZyroCollapse>
</template>

<script>
import ZyroCollapse from '@/components/global/ZyroCollapse.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroCollapse,
		ZyroSvgDeprecated,
	},

	props: {
		isOpen: {
			type: Boolean,
			default: false,
		},
		icon: {
			type: String,
			default: null,
		},
		hasTopBorder: {
			type: Boolean,
			default: false,
		},
		hasBottomBorder: {
			type: Boolean,
			default: false,
		},
	},

	emits: ['toggle'],
});
</script>

<style lang="scss" scoped>
.drawer-collapsible {
	:deep(.zyro-collapse__trigger) {
		padding: 12px 24px;
		border-bottom: 1px solid transparent;
		transition: 0.3s ease background-color, border-color;
	}

	&__heading {
		display: flex;
		align-items: center;
	}

	&__icon {
		margin-right: 12px;
		color: $color-primary;
	}

	&__content {
		padding: 24px;
	}

	&--with-top-border {
		border-top: 1px solid $color-gray-border;
	}

	&--with-bottom-border {
		border-bottom: 1px solid $color-gray-border;
	}

	&--highlighted {
		:deep(.zyro-collapse__trigger) {
			border-color: $color-gray-border;
		}
	}

	&--highlighted,
	&:hover,
	&:focus {
		:deep(.zyro-collapse__trigger) {
			background-color: $color-gray-light;
		}
	}
}
</style>
