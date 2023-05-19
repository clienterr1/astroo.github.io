<template>
	<div class="store-card">
		<div class="store-card__icon-wrapper">
			<ZyroSvgDeprecated
				:name="iconName"
				class="store-card__icon"
			/>
		</div>
		<div>
			<p class="z-body--strong store-card__title">
				{{ title }}
			</p>
			<ul class="store-card__list">
				<slot name="features-list" />
			</ul>
		</div>
		<ZyroTooltip
			position="right"
			toggle-event="hover"
			is-on-drawer
			class="store-card__button"
		>
			<template #trigger>
				<ZyroButton
					v-qa="`drawer-addecommerce-addecommerce${title}-btn`"
					@click="$emit('button-click')"
				>
					<template #icon>
						<Icon
							name="add_circle_outline"
							dimensions="20px"
						/>
					</template>
				</ZyroButton>
			</template>
			<p class="z-body-small">
				{{ $t('common.addToSite') }}
			</p>
		</ZyroTooltip>
	</div>
</template>

<script>
import Icon from '@/components/global/Icon.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroTooltip from '@/components/global/ZyroTooltip.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		Icon,
		ZyroButton,
		ZyroTooltip,
		ZyroSvgDeprecated,
	},

	props: {
		title: {
			type: String,
			required: true,
		},
		iconName: {
			type: String,
			required: true,
		},
		isBetaBadgeShown: {
			type: Boolean,
			default: false,
		},
	},
});
</script>

<style lang="scss" scoped>
.store-card {
	$this: &;

	display: flex;
	padding: 18px 10px 16px 16px;
	border-radius: 6px;

	&:hover,
	&:focus {
		background-color: $color-gray-light;
	}

	&__title {
		margin-bottom: 6px;
	}

	&__list {
		list-style-type: none;
	}

	&__button {
		align-self: center;
		margin-left: auto;
	}

	&__icon-wrapper {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 64px;
		height: 64px;
		margin-right: 15px;
		margin-bottom: 16px;
		background-color: $color-light;
		border: 1px solid $color-gray-light;
		border-radius: 5px;
	}

	&__icon {
		width: auto;
		height: 24px;
	}
}
</style>
