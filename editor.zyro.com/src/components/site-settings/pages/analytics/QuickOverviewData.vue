<template>
	<div class="overview">
		<div class="overview__name">
			{{ title }}
		</div>
		<div class="overview__data">
			<div class="raw-value">
				{{ count }}
			</div>
			<div
				v-if="trend && trend !== 0"
				class="trend"
				:class="`${trend > 0 ? 'green' : 'red'}`"
			>
				<ZyroSvgDeprecated
					name="arrow-down"
					:direction="trend < 0 ? 'up' : 'down'"
				/>
				{{ trend }}%
			</div>
		</div>
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
		count: {
			type: Number,
			required: true,
		},
		trend: {
			type: Number,
			required: true,
		},
	},
});
</script>

<style lang="scss" scoped>
.overview {
	width: 100%;

	&__name {
		margin-bottom: 4px;
		font-size: 14px;
		line-height: 20px;
		color: rgb(71, 75, 79);
		letter-spacing: 0.25px;
	}

	&__data {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.raw-value {
		margin-right: 8px;
		font-size: 20px;
		font-weight: 500;
		line-height: 28px;
		color: rgb(0, 0, 0);
	}

	.trend {
		display: flex;
		gap: 4px;
		align-items: center;
		font-size: 14px;

		&.green {
			color: $color-success;
		}

		&.red {
			color: $color-danger-dark;
		}
	}
}
</style>
