<template>
	<div
		:class="computedClass"
		:style="computedStyles"
	>
		<a
			v-for="({ link, svg, title }) in links"
			:key="link"
			:href="link"
			target="_blank"
			rel="noopener"
			:title="title"
			class="social-icons__link"
			v-on="{
				dragstart: preventLinks ? (e) => e.preventDefault() : () => null,
				click: preventLinks ? (e) => e.preventDefault() : () => null,
			}"
			v-html="svg"
		/>
	</div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
	props: {
		links: {
			type: Array,
			default: () => ([]),
		},
		preventLinks: {
			type: Boolean,
			default: false,
		},
		direction: {
			type: String,
			validator: (value) => [
				'row',
				'column',
			].includes(value),
			default: 'row',
		},
		directionMobile: {
			type: String,
			validator: (value) => [
				'row',
				'column',
			].includes(value),
			default: null,
		},
		preventSpacing: {
			type: Boolean,
			default: false,
		},
		fullHeight: {
			type: Boolean,
			default: false,
		},
	},

	computed: {
		computedClass() {
			return [
				'social-icons',
				`social-icons--${this.direction}`,
			];
		},
		computedStyles() {
			const styles = {
				...(this.fullHeight && {
					height: '100%',
				}),
				...(this.preventSpacing && {
					'--space-between-icons': '0px',
				}),
				'--m-icon-direction': this.directionMobile || this.direction,
				'--icon-padding-vertical': this.direction === 'column' ? 'var(--space-between-icons)' : '0',
				'--icon-padding-horizontal': this.direction === 'row' ? 'var(--space-between-icons)' : '0',
			};

			if (this.directionMobile) {
				styles['--m-icon-padding-vertical'] = this.directionMobile === 'column' ? 'var(--space-between-icons)' : '0';
				styles['--m-icon-padding-horizontal'] = this.directionMobile === 'row' ? 'var(--space-between-icons)' : '0';
			}

			return styles;
		},
	},
});
</script>

<style lang="scss" scoped>
/* stylelint-disable custom-property-pattern */
@import "@zyro-inc/site-modules/scss/mixins/site-engine-mobile";

.social-icons {
	display: flex;
	flex-direction: var(--icon-direction);
	justify-content: var(--icon-spacing, start);
	max-height: 100%;
	padding: 10px;
	padding: var(--gridItemInnerPadding);
	background: var(--gridItemInnerBackground);
	background-repeat: no-repeat;
	background-position: center;
	background-size: cover;

	&__link {
		display: flex;
		align-items: center;
		justify-content: center;
		line-height: 1;
		color: var(--icon-color, black);
		transition: color 0.2s ease;

		&:not(:last-child) {
			padding-right: var(--icon-padding-horizontal);
			padding-bottom: var(--icon-padding-vertical);
		}

		&:hover {
			color: var(--icon-color-hover, $color-gray);
		}

		:deep(svg) {
			width: var(--icon-size, 25px);
			height: var(--icon-size, 25px);
			object-fit: contain;
		}
	}
}

@include site-engine-mobile {
	.social-icons {
		flex-direction: var(--m-icon-direction);

		&__link {
			&:not(:last-child) {
				padding-right: var(--m-icon-padding-horizontal, var(--icon-padding-horizontal));
				padding-bottom: var(--m-icon-padding-vertical, var(--icon-padding-vertical));
			}
		}
	}
}
</style>
