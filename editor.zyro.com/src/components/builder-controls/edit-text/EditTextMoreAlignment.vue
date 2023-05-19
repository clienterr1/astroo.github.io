<template>
	<EditTextMoreItem
		:title="$t('builder.editText.alignment')"
		direction="row"
	>
		<div class="input">
			<button
				class="input__button"
				:class="{ 'active': currentAlignment === 'flex-start' }"
				@click="updateAlignment('flex-start')"
			>
				<ZyroSvgDeprecated
					class="input__icon"
					name="align"
					direction="up"
				/>
			</button>
			<button
				class="input__button"
				:class="{ 'active': currentAlignment === 'center' }"
				@click="updateAlignment('center')"
			>
				<ZyroSvgDeprecated
					name="align-middle"
					class="input__icon"
				/>
			</button>
			<button
				class="input__button"
				:class="{ 'active': currentAlignment === 'flex-end' }"
				@click="updateAlignment('flex-end')"
			>
				<ZyroSvgDeprecated
					class="input__icon"
					name="align"
					direction="down"
				/>
			</button>
		</div>
	</EditTextMoreItem>
</template>

<script>
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import {
	mapGetters,
	mapActions,
} from 'vuex';
import EditTextMoreItem from '@/components/builder-controls/edit-text/EditTextMoreItem.vue';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroSvgDeprecated,
		EditTextMoreItem,
	},

	computed: {
		...mapGetters(['currentElementStyles']),
		currentAlignment() {
			return this.currentElementStyles?.justify || 'flex-start';
		},
	},

	methods: {
		...mapActions(['mergeCurrentElementData']),
		updateAlignment(value) {
			this.mergeCurrentElementData({
				elementData: {
					settings: {
						styles: {
							justify: value,
						},
					},
				},
			});
		},
	},
});
</script>

<style lang="scss" scoped>
.input {
	display: flex;
	overflow: hidden;
	border: 1px solid $color-gray-border;
	border-radius: 6px;

	&__button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 30px;
		height: 30px;

		&:hover {
			cursor: pointer;
			background: $color-gray-light;
		}

		&.active {
			background: $color-gray-light;
		}
	}

	&__icon {
		width: 14px;
		height: 14px;
	}
}
</style>
