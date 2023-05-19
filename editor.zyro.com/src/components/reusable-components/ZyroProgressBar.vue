<template>
	<div class="progress-bar">
		<div
			class="progress-bar__bar"
			:class="[
				`progress-bar__bar--${color}`,
				{ 'progress-bar__bar--with-border' : withBorder }
			]"
			:style="{ '--percentage': `${percentage}%` }"
		/>
		<p
			v-if="isWithText"
			class="progress-bar__text"
		>
			{{ `${percentage}%` }}
		</p>
	</div>
</template>
<script>
export default {
	props: {
		percentage: {
			type: Number,
			default: 0,
		},
		isWithText: {
			type: Boolean,
			default: false,
		},
		color: {
			type: String,
			default: 'success',
			validator: (color) => [
				'dark-success',
				'success',
			].includes(color),
		},
		withBorder: {
			type: Boolean,
			default: false,
		},
	},
};
</script>
<style lang="scss" scoped>
.progress-bar {
	display: flex;
	gap: 12px;

	&__bar {
		position: relative;
		width: 100%;
		height: 16px;
		margin: 4.5px 0;
		margin-bottom: 8px;
		background: $color-gray-light;
		border-radius: 100px;

		&::before {
			position: absolute;
			top: 0;
			bottom: 0;
			left: 0;
			width: var(--percentage);
			content: "";
			border-radius: 100px;
			transition: width 0.3s ease;
		}

		&--with-border {
			border: 1px solid $color-light;
		}

		&--success {
			&::before {
				background: $color-success;
			}
		}

		&--success-dark {
			&::before {
				background: $color-success-dark;
			}
		}
	}

	&__text {
		width: 10%;
		font-size: 14px;
		font-weight: 400;
		line-height: 1.71;
		color: $color-gray;
	}
}
</style>
