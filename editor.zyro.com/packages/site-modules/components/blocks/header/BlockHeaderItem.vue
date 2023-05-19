<template>
	<li class="block-header-item">
		<label class="block-header-item__label">
			<input
				v-if="!areDropdownsHidden && item.hasDropdown"
				type="checkbox"
				class="block-header-item__mobile-dropdown-trigger"
			>
			<BlockHeaderItemContent
				v-qa="`navigation-item-${item.name}`"
				:item="item"
				class="block-header-item__item"
				:aria-haspopup="item.hasDropdown"
			/>
			<div
				v-if="!areDropdownsHidden && item.hasDropdown"
				class="block-header-item__dropdown-area"
			>
				<ul class="block-header-item__dropdown">
					<BlockHeaderItem
						v-for="subItem in item.subItems"
						:key="subItem.id"
						:item="subItem"
					/>
				</ul>
			</div>
		</label>
	</li>
</template>

<script>
import BlockHeaderItemContent from '@zyro-inc/site-modules/components/blocks/header/BlockHeaderItemContent.vue';

import { defineComponent } from 'vue';

export default defineComponent({
	name: 'BlockHeaderItem',

	components: {
		BlockHeaderItemContent,
	},

	props: {
		item: {
			type: Object,
			required: true,
		},
		areDropdownsHidden: {
			type: Boolean,
			default: false,
		},
	},
});
</script>

<style lang="scss" scoped>
@import "@zyro-inc/site-modules/scss/mixins/site-engine-mobile";

$underline-space: 7px;

.block-header-item {
	$this: &;

	user-select: none;

	&__dropdown-area {
		$side-padding: 16px;

		position: absolute;
		z-index: 1;
		display: none;
		padding-right: $side-padding;
		padding-bottom: 48px;
		padding-left: $side-padding;
		margin-left: calc(var(--menu-item-spacing) - #{$side-padding});
	}

	&__label {
		&:hover {
			.block-header-item__dropdown-area {
				display: block;
			}

			:deep(.item-content__icon) {
				transform: rotate(180deg);
			}
		}
	}

	&__dropdown {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		padding: 16px 24px;
		list-style: none;
		background-color: var(--dropdown-background-color);
		border-radius: $border-radius-small;
		box-shadow: $box-shadow;
		animation: expand 0.2s cubic-bezier(0.45, 0, 0.1, 1);

		& > #{$this}:not(:last-child) {
			margin-bottom: 8px;
		}

		:deep(.item-content) {
			margin: 0;
		}

		@media screen and (min-width: $media-mobile) {
			justify-content: start;
			max-height: 400px;
			overflow: auto;
		}
	}

	&__mobile-dropdown-trigger {
		position: absolute;
		width: 0;
		height: 0;
		opacity: 0;
	}

	&--no-margin {
		#{$this}__item {
			margin: 0;
		}
	}
}

@include site-engine-mobile {
	.block-header-item {
		$this: &;

		&__dropdown-area {
			position: unset;
			padding: 8px 0;
			margin: 8px calc(-1 * var(--padding-left)) 0 calc(-1 * var(--padding-right));
			background-color: var(--m-dropdown-background-color);
		}

		&__label {
			&:hover {
				.block-header-item__dropdown-area {
					display: none;
				}

				:deep(.item-content__icon) {
					transform: unset;
				}
			}
		}

		&__dropdown {
			padding: 0;
			background-color: transparent;
			box-shadow: none;

			:deep(.item-content) {
				margin: 0 0 $underline-space;
			}
		}

		&__mobile-dropdown-trigger {
			display: none;

			// An invisible checkbox controls if we should show dropdown on mobile or not
			&:checked {
				+ .block-header-item__item {
					:deep(.item-content__icon) {
						transform: rotate(180deg);
					}
				}

				~ .block-header-item__dropdown-area {
					display: block;
				}
			}
		}
	}
}

@keyframes expand {
	0% {
		display: none;
		opacity: 0;
	}

	1% {
		display: block;
		opacity: 0;
		transform: translate(0, -1em);
	}

	100% {
		opacity: 1;
		transform: translate(0, 1);
	}
}
</style>
