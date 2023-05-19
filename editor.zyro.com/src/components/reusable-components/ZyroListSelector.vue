<template>
	<div class="list-selector">
		<template
			v-for="(listItem, id) in listData"
			:key="id"
		>
			<ZyroSeparator
				v-if="listItem.type === 'separator'"
				class="list-selector__separator"
			/>
			<button
				v-else
				v-qa="`builder-addnewsectionmodal-btn-${listItem.name}`"
				class="list-selector__item z-body-small"
				:class="{ 'is-current': current === id }"
				@click="setCurrent(id)"
			>
				{{ listItem.name }}
				<span
					v-if="listItem.hasBadge"
					class="list-selector__badge z-body-small z-body-small--strong"
				>
					{{ listItem.badgeText || $t('common.new') }}
				</span>
				<ZyroSvgDeprecated
					v-if="listItem.icon"
					:name="listItem.icon"
				/>
			</button>
		</template>
	</div>
</template>

<script>
import ZyroSeparator from '@/components/global/ZyroSeparator.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import { defineComponent } from 'vue';

export default defineComponent({

	components: {
		ZyroSeparator,
		ZyroSvgDeprecated,
	},

	props: {
		listData: {
			type: Object,
			required: true,
			validator: (values) => Object.values(values).every((value) => value.name || value.type),
		},
		current: {
			type: String,
			default: '',
		},
	},

	emits: ['update:current'],

	beforeMount() {
		if (!this.listData[this.current]) {
			this.setCurrent(Object.keys(this.listData)[0]);
		}
	},

	methods: {
		setCurrent(id) {
			this.$emit('update:current', id);
		},
	},
});
</script>

<style lang="scss" scoped>
.list-selector {
	&__item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: 12px 16px;
		margin: 0;
		text-align: left;
		text-decoration: none;
		user-select: none;
		background-color: transparent;
		border-radius: $border-radius-small;

		&.is-current,
		&:hover,
		&:active,
		&:focus {
			background-color: $color-gray-light;
		}

		&:not(.is-current) {
			cursor: pointer;
		}

		&:not(:last-child) {
			margin-bottom: 4px;
		}
	}

	&__separator {
		margin: 8px 0;
	}

	&__badge {
		padding: 0 8px;
		color: $color-light;
		text-align: center;
		background-color: $color-primary;
		border-radius: 100px;
		text-transform: capitalize;
	}
}
</style>
