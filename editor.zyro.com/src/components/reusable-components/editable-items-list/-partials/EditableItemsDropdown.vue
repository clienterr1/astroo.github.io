<template>
	<div>
		<slot
			name="trigger"
			:toggle="toggleDropdown"
		>
			<ZyroButton
				class="add-button"
				@click="toggleDropdown"
			>
				<template #icon-left>
					<Icon
						name="plus-circle"
						dimensions="16px"
						is-custom
					/>
				</template>
				{{ title ?? $t('builder.editItems.selectItems') }}
			</ZyroButton>
		</slot>

		<div
			v-show="isDropdownShown"
			data-qa="edit-items-dropdown"
			class="dropdown dropdown-inner"
		>
			<div class="dropdown-inner border-bottom">
				<button
					v-for="item in items"
					:key="item"
					class="dropdown-item"
					data-qa="edit-items-dropdown-item"
					@click="handleSelect(item)"
				>
					<div>
						<ZyroSvgDeprecated
							v-if="selectedItems.includes(item)"
							name="check-mark"
						/>
					</div>
					<p class="z-body-small">
						{{ item }}
					</p>
				</button>
			</div>
			<div v-if="hasSlotContent($slots['custom-buttons'])">
				<ZyroSeparator />
				<slot name="custom-buttons" />
			</div>
		</div>
	</div>
</template>

<script>
import { defineComponent } from 'vue';

import { hasSlotContent } from '@zyro-inc/site-modules/utils/hasSlotContent';

import Icon from '@/components/global/Icon.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroSeparator from '@/components/global/ZyroSeparator.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

export default defineComponent({

	components: {
		Icon,
		ZyroButton,
		ZyroSeparator,
		ZyroSvgDeprecated,
	},

	props: {
		items: {
			type: Array,
			default: () => ([]),
		},
		selectedItems: {
			type: Array,
			default: () => ([]),
		},
		title: {
			type: String,
			default: null,
		},
	},

	emits: [
		'select',
		'deselect',
	],

	setup() {
		return {
			hasSlotContent,
		};
	},

	data() {
		return {
			isDropdownShown: false,
		};
	},

	methods: {
		handleSelect(item) {
			const eventName = this.selectedItems.includes(item) ? 'deselect' : 'select';

			this.$emit(eventName, item);
		},
		toggleDropdown() {
			this.isDropdownShown = !this.isDropdownShown;
		},
	},
});
</script>

<style lang="scss" scoped>
@import "./AddButton";
@import "./DropdownItem";

.dropdown-inner {
	display: flex;
	flex-direction: column;
	width: 100%;
	max-height: 300px;
	overflow-y: auto;
}

.dropdown {
	position: absolute;
	z-index: 1;
	overflow-y: auto;
	border-radius: $border-radius-small;
	box-shadow: $box-shadow;
}

.border-bottom {
	border-bottom: 0.5px solid $color-gray-border;
}
</style>
