<template>
	<article class="collapsible">
		<ZyroCard
			tag="header"
			class="collapsible__header"
			@click="$emit('toggle')"
		>
			<div class="collapsible__heading-container">
				<ZyroSvgDeprecated
					v-if="icon"
					:name="icon"
					class="collapsible__heading-icon"
				/>
				<h3 class="collapsible__heading z-body z-font-weight-bold">
					<slot name="heading" />
				</h3>
			</div>
			<slot name="tag" />
			<ZyroButton
				class="toggle"
				theme="plain"
				:class="{ 'toggle--reversed': isOpen }"
				:title="isOpen ? $t('common.collapse') : $t('common.expand')"
			>
				<template #icon>
					<Icon
						name="chevron_left"
						direction="left"
						dimensions="20px"
					/>
				</template>
			</ZyroButton>
		</ZyroCard>

		<div v-show="isOpen">
			<ZyroCard
				v-if="hasSlotContent($slots.content)"
				tag="main"
				class="collapsible__main"
				:class="{ 'collapsible__main--icon' : icon }"
			>
				<slot name="content" />
			</ZyroCard>
			<ZyroCard
				v-if="hasSlotContent($slots.footer)"
				tag="footer"
				class="collapsible__footer"
				:class="{ 'collapsible__footer--no-content': !hasSlotContent($slots.content) }"
			>
				<slot name="footer" />
			</ZyroCard>
		</div>
	</article>
</template>

<script>
import { defineComponent } from 'vue';

import { hasSlotContent } from '@zyro-inc/site-modules/utils/hasSlotContent';

import Icon from '@/components/global/Icon.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';
import ZyroCard from '@/components/site-settings/components/ZyroCard.vue';

export default defineComponent({
	components: {
		Icon,
		ZyroButton,
		ZyroSvgDeprecated,
		ZyroCard,
	},

	props: {
		icon: {
			type: String,
			default: '',
		},
		isOpen: {
			type: Boolean,
			default: false,
		},
	},
	setup() {
		return {
			hasSlotContent,
		};
	},
});
</script>

<style lang="scss" scoped>
.collapsible {
	margin-bottom: 16px;
	background-color: $color-light;

	&__header {
		&#{&} { // ensure specificity, because it overrides zyro-card props
			position: relative;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-right: 64px;
			margin-bottom: 0;
			overflow: visible;
			cursor: pointer;
			user-select: none;

			@media screen and (max-width: $media-mobile) {
				justify-content: flex-start;
				padding-right: 32px;
			}
		}
	}

	&__heading {
		&#{&} {
			margin-right: 32px;
			margin-bottom: 0;

			@media screen and (max-width: $media-mobile) {
				margin-right: 8px;
			}
		}
	}

	&__heading-container {
		display: flex;
		align-items: center;
		justify-content: flex-start;
	}

	&__heading-icon {
		flex: none;
		width: 24px;
		height: 26px;
		margin-right: 24px;

		@media screen and (max-width: $media-mobile) {
			margin-right: 8px;
		}
	}

	&__main {
		margin-bottom: 0;

		&--icon {
			margin-bottom: 0;

			@media screen and (max-width: $media-mobile) {
				padding-left: 16px;
				margin-top: -16px;
			}
		}
	}

	&__footer {
		text-align: right;

		&--no-content {
			padding-top: 4px;
		}
	}
}

.toggle {
	position: absolute;
	right: 28px;
	pointer-events: none;
	transition: transform 0.3s;

	&--reversed {
		transform: rotate(180deg);
	}

	@media screen and (max-width: $media-mobile) {
		right: 8px;
	}
}
</style>
