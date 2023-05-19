<template>
	<div :class="`banner banner--${theme}`">
		<ZyroSvgDeprecated
			v-if="isWithIcon"
			:name="BANNER_THEMES[theme].iconName"
			class="banner__icon"
		/>
		<div class="banner__content-wrapper">
			<div class="banner__content">
				<slot name="title">
					<h3
						v-if="title"
						class="banner__title z-body-small z-body-small--strong"
					>
						{{ title }}
					</h3>
				</slot>
				<slot name="subtitle">
					<p
						v-if="subtitle"
						class="banner__subtitle z-body-small"
					>
						{{ subtitle }}
					</p>
				</slot>
			</div>
			<div
				v-if="hasSlotContent($slots.button)"
				class="banner__button-wrapper"
			>
				<slot name="button" />
			</div>
		</div>
	</div>
</template>

<script>
import { defineComponent } from 'vue';

import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import { hasSlotContent } from '@zyro-inc/site-modules/utils/hasSlotContent';

const BANNER_THEME_NAME_INFO = 'info';
const BANNER_THEME_NAME_SUCCESS = 'success';
const BANNER_THEME_NAME_WARNING = 'warning';
const BANNER_THEME_NAME_ERROR = 'error';

const BANNER_THEMES = {
	[BANNER_THEME_NAME_INFO]: {
		iconName: 'info-circle',
	},
	[BANNER_THEME_NAME_SUCCESS]: {
		iconName: 'check-circle',
	},
	[BANNER_THEME_NAME_WARNING]: {
		iconName: 'alert-triangle',
	},
	[BANNER_THEME_NAME_ERROR]: {
		iconName: 'alert-circle',
	},
};

export default defineComponent({
	components: {
		ZyroSvgDeprecated,
	},

	props: {
		title: {
			type: String,
			default: '',
		},
		subtitle: {
			type: String,
			default: '',
		},
		isWithIcon: {
			type: Boolean,
			default: true,
		},
		theme: {
			type: String,
			default: 'info',
			validator: (value) => value in BANNER_THEMES,
		},
	},

	setup() {
		return {
			BANNER_THEMES,
			hasSlotContent,
		};
	},
});
</script>

<style lang="scss" scoped>
.banner {
	position: relative;
	box-sizing: border-box;
	display: flex;
	padding: 16px;
	border-left: 4px solid $color-azure;

	$this: &;

	@media screen and (max-width: $media-mobile) {
		padding-right: 24px;
	}

	&__icon {
		position: relative;
		margin-right: 12px;
	}

	&__title {
		&#{&} {
			margin-bottom: 4px;
		}
	}

	&__subtitle {
		&#{&} {
			margin-bottom: 0;
			color: $color-gray;
		}
	}

	&__content-wrapper {
		display: flex;
		flex-wrap: wrap;
		grid-gap: 16px;
		align-items: center;
		justify-content: space-between;
		width: 100%;
	}

	&__content {
		margin-right: 24px;
		text-align: left;
	}

	&__button-wrapper {
		display: contents;
		align-items: center;
	}

	&--info {
		background: $color-azure-light;

		#{$this}__icon {
			color: $color-azure;
		}
	}

	&--success {
		background: $color-success-light;
		border-color: $color-success-dark;

		#{$this}__icon {
			color: $color-success-dark;
		}
	}

	&--warning {
		background: $color-warning-light;
		border-color: $color-warning-dark;

		#{$this}__icon {
			color: $color-warning-dark;
		}
	}

	&--error {
		background-color: $color-danger-light;
		border-color: $color-danger-dark;

		#{$this}__icon {
			color: $color-danger-dark;
		}
	}
}
</style>
