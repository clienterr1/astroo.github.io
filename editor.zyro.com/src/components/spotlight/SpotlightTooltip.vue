<template>
	<div class="spotlight-tooltip">
		<div class="spotlight-tooltip__text">
			<p class="spotlight-tooltip__title">
				{{ $t('common.search') }}
			</p>
			<i18n-t
				tag="p"
				class="z-body-small spotlight-tooltip__message"
				keypath="common.searchShortcut"
			>
				<span class="z-body-small z-body--strong">
					{{ shortcuts }}
				</span>
			</i18n-t>
		</div>
		<div class="spotlight-tooltip__key-icon-wrap">
			<div class="spotlight-tooltip__key-icon">
				<div class="spotlight-tooltip__key-symbol">
					{{ isMacMachine ? '⌘' : 'Ctrl' }}
				</div>
			</div>
		</div>
		<div class="spotlight-tooltip__key-icon-wrap">
			<div class="spotlight-tooltip__key-icon spotlight-tooltip__key-icon--second">
				<div class="spotlight-tooltip__key-symbol">
					/
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { getIsUserUsingMac } from '@/utils/getIsUserUsingMac';

export default {
	name: 'SpotlightTooltip',
	setup() {
		return {
			isMacMachine: getIsUserUsingMac(),
			shortcuts: getIsUserUsingMac() ? '⌘ + /' : 'Ctrl + /',
		};
	},
};
</script>

<style lang="scss" scoped>
@keyframes pulse {
	0% {
		box-shadow: 0 8px 0 0 $color-gray;
		transform: translateY(-4px);
	}

	40% {
		box-shadow: 0 4px 0 0 $color-gray;
		transform: translateY(0);
	}

	60% {
		box-shadow: 0 8px 0 0 $color-gray;
		transform: translateY(-4px);
	}

	100% {
		box-shadow: 0 8px 0 0 $color-gray;
		transform: translateY(-4px);
	}
}

@keyframes pulse2 {
	0% {
		box-shadow: 0 8px 0 0 $color-gray;
		transform: translateY(-4px);
	}

	30% {
		box-shadow: 0 8px 0 0 $color-gray;
		transform: translateY(-4px);
	}

	60% {
		box-shadow: 0 4px 0 0 $color-gray;
		transform: translateY(0);
	}

	80% {
		box-shadow: 0 8px 0 0 $color-gray;
		transform: translateY(-4px);
	}

	100% {
		box-shadow: 0 8px 0 0 $color-gray;
		transform: translateY(-4px);
	}
}

.spotlight-tooltip {
	display: flex;
	flex-direction: row;
	align-items: center;

	&__text {
		display: flex;
		flex-direction: column;
		width: 150px;
		margin-right: 16px;
	}

	&__title {
		margin-bottom: 4px;
		font-size: 16px;
		font-weight: 400;
		line-height: 24px;
	}

	&__message {
		color: $color-gray;
		white-space: break-spaces;
	}

	&__key-icon-wrap {
		border-radius: 12px;

		&:not(:last-child) {
			margin-right: 4px;
		}
	}

	&__key-icon {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 50px;
		height: 50px;
		border: 2px solid $color-gray;
		border-radius: 12px;
		animation: 1.6s ease-in infinite pulse;

		&--second {
			animation: 1.6s ease-in infinite pulse2;

			// delay second button animation
		}
	}

	&__key-symbol {
		font-size: 24px;
		font-weight: 700;
		line-height: 30px;
		color: $color-gray;
	}
}
</style>
