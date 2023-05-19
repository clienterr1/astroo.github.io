<template>
	<div
		class="active-step"
		data-qa="active-step"
	>
		<span :key="id">
			<p class="z-body z-body--strong active-step__title">
				<slot name="title" />
			</p>
			<p class="z-body-small active-step__description">
				<slot name="description" />
			</p>
			<div v-if="learnMoreLink">
				<a
					:href="learnMoreLink"
					class="z-body-small z-link active-step__learn-more-link"
					target="_blank"
					rel="noopener noreferrer"
				>
					{{ $t('common.learnMore') }}
					<ZyroSvgDeprecated
						name="chevron-left"
						direction="down"
						class="active-step__link-chevron"
					/>
				</a>
			</div>
			<ZyroButton
				:data-qa="`builder-header-quick-start-guide-step-btn-${id}`"
				theme="primary"
				class="active-step__button"
				:is-disabled="isButtonDisabled"
				@click="$emit('start-step-action')"
			>
				{{ buttonText }}
			</ZyroButton>
		</span>
	</div>
</template>
<script>
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroButton,
		ZyroSvgDeprecated,
	},

	props: {
		id: {
			type: String,
			required: true,
		},
		learnMoreLink: {
			type: String,
			default: null,
		},
		buttonText: {
			type: String,
			default: null,
		},
		isButtonDisabled: {
			type: Boolean,
			default: false,
		},
	},
});
</script>
<style lang="scss" scoped>
.active-step {
	&__title {
		margin-bottom: 8px;
	}

	&__description {
		margin-bottom: 16px;
		color: $color-gray;
	}

	&__learn-more-link {
		display: flex;
		align-items: center;
		color: $color-primary;
	}

	&__link-chevron {
		margin-left: 4px;
	}

	&__button {
		position: absolute;
		bottom: 16px;
		left: 16px;
	}
}
</style>
