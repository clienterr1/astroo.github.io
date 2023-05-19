<template>
	<div
		:class="[
			'item-content-wrapper',
			{ 'item-content-wrapper--active': item.isCurrent },
		]"
	>
		<a
			v-if="item.href"
			v-qa="linkDataQa"
			class="item-content"
			:target="item.target"
			:rel="item.rel"
			:href="item.href"
			v-text="item.name"
		/>
		<span
			v-else
			v-qa="linkDataQa"
			class="item-content"
			v-text="item.name"
		/>
		<div
			v-if="item.hasDropdown"
			class="item-content__icon-container-wrapper"
		>
			<span class="item-content__icon-container">
				<svg
					class="item-content__icon"
					width="10"
					height="7"
					viewBox="0 0 10 7"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M5 6.5L0.669873 0.5L9.33013 0.500001L5 6.5Z"
						fill="currentColor"
					/>
				</svg>
			</span>
		</div>
	</div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'BlockHeaderItemContent',

	props: {
		item: {
			type: Object,
			required: true,
		},
	},

	computed: {
		linkDataQa() {
			return this.item.isCurrent ? `navigationblock-page-active-${this.item.name}` : `navigationblock-page-${this.item.name}`;
		},
	},
});
</script>

<style lang="scss" scoped>
@import "@zyro-inc/site-modules/scss/mixins/site-engine-mobile";
@import "@zyro-inc/site-modules/scss/mixins/font-style";

$underline-space: 7px;

.item-content {
	$this: &;

	position: relative;
	align-self: center;
	margin: 0 0 0 var(--menu-item-spacing);
	font-family: var(--text-font-family, var(--nav-link-font-family));
	font-size: var(--nav-link-font-size);
	font-style: var(--nav-link-font-style);
	font-weight: var(--text-font-weight, var(--nav-link-font-weight));
	line-height: var(--nav-link-line-height);
	color: var(--nav-link-text-color);
	text-decoration: var(--nav-link-text-decoration);
	text-transform: var(--nav-link-text-transform);
	letter-spacing: var(--nav-link-letter-spacing);
	white-space: pre-wrap;
	cursor: pointer;

	&__icon-container {
		all: unset;
		display: flex;
		margin-left: 8px;
		color: var(--nav-link-text-color);
		cursor: pointer;
		border: 1px solid transparent;
		border-radius: 3px;
		transition: border 0.3s;

		&:focus-visible {
			border-color: var(--nav-link-text-color-hover, var(--nav-link-text-color));
		}
	}

	&__icon {
		margin: 2px 6.5px;
		transition: transform 0.3s;
	}
}

.item-content-wrapper {
	display: flex;
	align-items: center;
	text-align: left;

	&--active,
	&:hover,
	&:focus {
		.item-content {
			color: var(--nav-link-text-color-hover, var(--nav-link-text-color));
			text-decoration: underline;
			text-underline-offset: $underline-space;

			&__icon-container {
				color: var(--nav-link-text-color-hover, var(--nav-link-text-color));
			}
		}
	}
}

@include site-engine-mobile {
	.item-content {
		margin: 0;
		text-align: var(--m-navigation-text-align);

		&__icon-container {
			display: inline-block;
		}
	}
}
</style>
