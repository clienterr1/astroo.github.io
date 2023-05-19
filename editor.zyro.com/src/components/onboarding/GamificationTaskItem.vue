<template>
	<div
		class="gamification-task-item"
		data-qa="gamification-task-item"
		:class="{ 'gamification-task-item--active': !item.isCompleted }"
		@click="handleItemClicked(item)"
	>
		<ZyroCheckbox
			data-qa="gamification-task-item-checkbox"
			class="gamification-task-item__checkbox"
			is-rounded
			theme="green"
			is-filled
			:model-value="item.isCompleted"
			is-non-clickable
		/>
		<div class="gamification-task-item__text-container">
			<p class="z-body-small">
				<slot />
			</p>
			<ZyroSvgDeprecated
				v-if="!item.isCompleted"
				name="chevron-right"
				class="gamification-task-item__arrow"
			/>
		</div>
	</div>
	<ZyroSeparator
		v-if="!isLastItem"
		class="separator"
	/>
</template>

<script>
import ZyroCheckbox from '@/components/global/ZyroCheckbox.vue';
import ZyroSeparator from '@/components/global/ZyroSeparator.vue';
import EventLogApi from '@/api/EventLogApi';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';
import { defineComponent } from 'vue';
import { useStore } from 'vuex';
import { CLOSE_DRAWER } from '@/store/builder/gui';
import { GAMIFICATION_EVENT_NAMES } from '@/constants';

export default defineComponent({
	components: {
		ZyroSeparator,
		ZyroCheckbox,
		ZyroSvgDeprecated,
	},

	props: {
		isLastItem: {
			type: Boolean,
			required: true,
		},
		item: {
			type: Object,
			required: true,
		},
	},
	setup() {
		const { dispatch } = useStore();

		const handleItemClicked = (item) => {
			if (!item.clickAction || item.isCompleted) {
				return;
			}

			dispatch(`gui/${CLOSE_DRAWER}`);
			item.clickAction();

			EventLogApi.logEvent({
				eventName: GAMIFICATION_EVENT_NAMES.TASK_ENTER[item.id],
				isHostingerEvent: true,
			});
		};

		return {
			handleItemClicked,
		};
	},
});
</script>

<style lang="scss" scoped>
.gamification-task-item {
	$this: &;

	position: relative;
	display: flex;
	align-items: center;
	width: 100%;
	height: 50px;
	padding: 16px 0;

	&__checkbox {
		margin-right: 12px;
		margin-left: 8px;
		pointer-events: none;
	}

	&__text-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
	}

	&__arrow {
		margin-right: 8px;
		color: $color-gray;
		transition: transform 0.3s ease;
		transform: translateX(0);
	}

	&--active {
		cursor: pointer;

		&:hover {
			background-color: $color-gray-light;

			#{$this}__arrow {
				transform: translateX(8px);
			}
		}
	}
}

.separator {
	margin-left: 44px;
	width: unset;
}
</style>
