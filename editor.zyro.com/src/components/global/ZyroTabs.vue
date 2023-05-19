<template>
	<div
		v-if="currentTab"
		class="zyro-tabs"
	>
		<button
			v-for="tab in tabs"
			:key="tab.title"
			v-qa="`builder-tab-${tab.title}`"
			:class="{
				'zyro-tabs__tab--active': currentTab.title === tab.title,
				'zyro-tabs__tab--disabled': tab.isDisabled,
				'zyro-tabs__tab--indicator': tab.hasIndicator,
			}"
			:title="tab.title"
			:disabled="tab.isDisabled"
			class="zyro-tabs__tab z-body-small z-body-small--strong"
			@click="$emit('update:current-tab', tab)"
		>
			{{ tab.title }}
		</button>
	</div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
	props: {
		tabs: {
			type: Array,
			required: true,
			validator: (tabs) => {
				const validTabs = tabs.filter((item) => 'title' in item);

				return validTabs.length === tabs.length;
			},
		},
		currentTab: {
			type: Object,
			required: true,
		},
	},
	emits: ['update:current-tab'],
});
</script>

<style lang="scss" scoped>
.zyro-tabs {
	display: flex;
	width: 100%;
	margin-bottom: 8px;
	border-bottom: 0.5px solid $color-gray-border;
	flex-wrap: wrap;

	&__tab {
		position: relative;
		padding: 2px 0;
		font-size: 16px;
		font-weight: 500;
		color: $color-gray;
		cursor: pointer;
		background-color: transparent;
		transition: color 0.2s ease;

		&:not(:last-child) {
			margin-right: 16px;
		}

		&--active {
			color: var(--color-primary);

			&::before {
				position: absolute;
				bottom: 0;
				left: 0;
				width: 100%;
				height: 2px;
				content: "";
				background-color: var(--color-primary);
			}
		}

		&--disabled {
			cursor: not-allowed;
			opacity: 0.6;
		}

		&--indicator {
			&::after {
				position: absolute;
				top: 0;
				right: -10px;
				width: 10px;
				height: 10px;
				content: "";
				background-color: $color-warning-dark;
				border-radius: 50%;
			}
		}
	}
}
</style>
