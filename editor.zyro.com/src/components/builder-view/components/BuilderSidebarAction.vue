<template>
	<div
		class="action"
		:class="{ 'action--disabled-action-cursor': isDisabled }"
	>
		<ZyroTooltip
			position="right"
			size="small"
			toggle-event="hover"
			content-position="absolute"
			:forced-position="forcedPosition"
			:use-portal="false"
			:hide-tooltip="isActive || isMobileScreen || isSidebarExpanded"
			:mode="isDisabled ? 'dark' : 'light'"
		>
			<template #trigger>
				<slot name="beforeTrigger" />
				<slot name="trigger">
					<ZyroButton
						v-qa="`builder-sidebar-btn-${title}`"
						:is-active="isActive"
						:is-disabled="isDisabled"
						class="action__button z-body-small z-body-small--strong"
						:class="{
							'action__button--expanded': isSidebarExpanded,
							'action__button--active': isActive,
							'action__button--disabled': isDisabled
						}"
						:title="title"
						:[DATA_ATTRIBUTE_SELECTOR]="DATA_ATTRIBUTE_SELECTOR_DRAWER_TRIGGER"
						@click.stop="$emit('action-click')"
					>
						<template #icon>
							<Icon
								v-if="icon"
								:name="icon"
								:is-filled="isIconFilled"
							/>
						</template>
						<slot name="beforeTitle" />
						<p
							v-if="isSidebarExpanded"
							class="action__title"
						>
							{{ title }}
						</p>
					</ZyroButton>
				</slot>
			</template>
			<slot name="tooltip-content">
				{{ title }}
			</slot>
		</ZyroTooltip>
	</div>
</template>

<script>
import { defineComponent } from 'vue';
import { mapState } from 'vuex';

import Icon from '@/components/global/Icon.vue';
import ZyroTooltip from '@/components/global/ZyroTooltip.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';
import {
	DATA_ATTRIBUTE_SELECTOR,
	DATA_ATTRIBUTE_SELECTOR_DRAWER_TRIGGER,
} from '@zyro-inc/site-modules/constants';

export default defineComponent({
	components: {
		Icon,
		ZyroTooltip,
		ZyroButton,
	},

	props: {
		isActive: {
			type: Boolean,
			default: false,
		},
		isDisabled: {
			type: Boolean,
			default: false,
		},
		title: {
			type: String,
			default: null,
		},
		icon: {
			type: String,
			default: null,
		},
		isIconFilled: {
			type: Boolean,
			default: false,
		},
		forcedPosition: {
			type: Object,
			default: () => ({
				left: '64px',
				top: '6px',
				'white-space': 'nowrap',
			}),
		},
	},
	emits: ['action-click'],
	setup() {
		return {
			DATA_ATTRIBUTE_SELECTOR,
			DATA_ATTRIBUTE_SELECTOR_DRAWER_TRIGGER,
		};
	},
	computed: {
		...mapState('gui', [
			'isMobileScreen',
			'isSidebarExpanded',
		]),
	},
});
</script>

<style lang="scss" scoped>
@import "@/components/builder-view/components/BuilderActionButton";

.action {
	&--disabled-action-cursor {
		cursor: not-allowed;
	}

	&:not(:last-child) {
		margin-bottom: 4px;
	}

	&:hover,
	&:focus-visible {
		outline: none;

		&::after {
			transform: scale(1);
		}
	}

	&__title {
		max-width: 186px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
}
</style>
