<template>
	<div
		class="datalist"
		:class="{ 'datalist--opened': isOpened }"
	>
		<VueSelect
			class="datalist__select"
			:options="options"
			:model-value="modelValue"
			:placeholder="placeholder"
			:label="labelKey"
			:filterable="filterable"
			:dropdown-should-open="shouldDropdownOpen"
			:searchable="searchable"
			:disabled="disabled"
			@update:model-value="$emit('update:model-value', $event)"
			@open="isOpened = true"
			@close="isOpened = false"
			@search="$emit('search', $event)"
		>
			<template #open-indicator>
				<ZyroSvgDeprecated
					v-show="!shouldOpenDropdownOnInput"
					class="datalist__select-arrow"
					name="chevron"
					direction="down"
				/>
			</template>

			<template #no-options>
				<div class="datalist__no-results">
					{{ $t('common.searchNoResults') }}
				</div>
			</template>

			<template #option="option">
				<slot
					name="option"
					:option="option"
				/>
			</template>

			<template #selected-option="option">
				<slot
					name="selected-option"
					:option="option"
				/>
			</template>
		</VueSelect>
	</div>
</template>

<script>
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import VueSelect from 'vue-select';

import {
	defineComponent,
	ref,
} from 'vue';

export default defineComponent({
	components: {
		ZyroSvgDeprecated,
		VueSelect,
	},

	props: {
		options: {
			type: Array,
			default: () => [],
		},
		labelKey: {
			type: String,
			default: null,
		},
		placeholder: {
			type: String,
			default: '',
		},
		modelValue: {
			type: [
				Array,
				String,
				Number,
			],
			default: null,
		},
		filterable: {
			type: Boolean,
			default: true,
		},
		searchable: {
			type: Boolean,
			default: true,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		shouldOpenDropdownOnInput: {
			type: Boolean,
			default: false,
		},
	},

	emits: [
		'update:model-value',
		'search',
	],

	setup(props) {
		const isOpened = ref(false);
		const shouldDropdownOpen = ({ search }) => (props.shouldOpenDropdownOnInput ? !!search.length : isOpened.value);

		return {
			shouldDropdownOpen,
			isOpened,
		};
	},
});
</script>

<style lang="scss" scoped>
.datalist {
	$this: &;

	height: 45px;
	background-color: $color-gray-light;

	&--opened {
		#{$this}__select-arrow {
			transform: rotateZ(360deg);
		}
	}

	&__select {
		height: 100%;
	}

	&__select-arrow {
		transition: transform 0.2s;
	}

	&__no-results {
		padding: 8px;
	}

	// Styles that overrides vue-select internal styles
	:deep() {
		.v-select {
			position: relative;
			box-sizing: border-box;
			font-family: inherit;

			& * {
				box-sizing: border-box;
			}
		}

		$this: ".vs";

		// .vs--single.vs--open
		#{$this}--single#{$this}--open {
			// .vs--single.vs--open .vs__selected
			& #{$this}__selected {
				position: absolute;
				opacity: 0.4;
			}

			// .vs--single.vs--open.vs--searching .vs__selected
			&#{$this}--searching {
				& #{$this}__selected {
					opacity: 0;
				}
			}
		}

		.vs {
			&__clear {
				display: none;
			}

			&__dropdown-toggle {
				display: flex;
				height: 100%;
				padding: 0 10px 4px;
			}

			&__selected {
				display: flex;
				align-items: center;
				height: 100%;
				margin: 4px 8px 0;
				font-size: 14px;
			}

			&__search,
			&__search:focus {
				z-index: 1;
				flex-grow: 1;
				width: 0;
				max-width: 100%;
				padding: 0 8px;
				margin: 8px 0 0;
				line-height: 1.4;
				background: transparent;
				border: none;
				outline: none;

				&::-webkit-search-cancel-button {
					appearance: none;
				}
			}

			&__actions {
				display: flex;
				align-items: center;
				padding: 4px 6px 0 3px;
			}

			&__selected-options {
				position: relative;
				display: flex;
				flex-basis: 100%;
				flex-grow: 1;
				flex-wrap: wrap;
			}

			&__dropdown-menu {
				position: absolute;
				z-index: 2;
				width: 100%;
				min-width: 160px;
				max-height: 100%;
				padding: 5px 0;
				overflow-y: auto;
				list-style: none;
				background-color: white;
				border-bottom-right-radius: 5px;
				border-bottom-left-radius: 5px;
				box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 15%);
			}

			&__dropdown-option {
				padding: 10px 12px 10px 18px;
				font-size: 14px;
				line-height: 1.4;
				cursor: pointer;

				&--highlight {
					color: $color-dark;
					background-color: $color-gray-light;
					transition: background-color 0.1s;
				}
			}
		}
	}
}
</style>
