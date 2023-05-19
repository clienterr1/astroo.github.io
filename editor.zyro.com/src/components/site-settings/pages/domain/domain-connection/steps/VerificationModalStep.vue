<template>
	<ZyroCard class="card">
		<div
			class="card__content"
			data-qa="sitesettings-domain-verification"
		>
			<div class="card__content__icon-wrapper">
				<ZyroSvgDeprecated
					class="card__icon"
					name="check-circle"
				/>
			</div>

			<h2 class="z-h5 card__title">
				{{ $t('siteSettings.domain.hasDomain.giveItSomeTime') }}
			</h2>
			<p class="z-body card__subtitle">
				{{ $t('builder.domainConnectionModalVerificationStepSubtitle1') }}
				<template v-if="previewDomain">
					{{ $t('builder.domainConnectionModalVerificationStepSubtitle2') }}
				</template>
			</p>
			<div
				v-if="previewDomain"
				class="link-preview"
				@click="openSitePreview"
			>
				<p class="link-preview__link z-link">
					{{ previewDomain }}
				</p>
				<div class="link-preview__icon-wrapper">
					<ZyroSvgDeprecated
						class="link-preview__icon"
						name="arrow-up-right"
					/>
				</div>
			</div>
		</div>
	</ZyroCard>
</template>

<script>
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import ZyroCard from '@/components/site-settings/components/ZyroCard.vue';

import { isHostingerBrand } from '@/utils/isHostingerBrand';
import { useStore } from 'vuex';

import {
	defineComponent,
	computed,
} from 'vue';

export default defineComponent({
	components: {
		ZyroSvgDeprecated,
		ZyroCard,
	},

	setup() {
		const {
			getters,
			state,
		} = useStore();

		const previewDomain = computed(() => (isHostingerBrand ? state.previewDomain : state.zyroDomain));
		const sitePreviewDomainUrl = computed(() => (isHostingerBrand ? getters.sitePreviewDomainUrl : getters.siteZyroDomainUrl));

		const openSitePreview = () => {
			window.open(sitePreviewDomainUrl.value, '_blank');
		};

		return {
			previewDomain,
			openSitePreview,
		};
	},
});
</script>

<style lang="scss" scoped>
@import "./ModalStepCard";

.card {
	&__icon {
		color: $color-success-dark;
	}

	&__subtitle {
		max-width: 600px;
	}

	&__content {
		&__icon-wrapper {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 48px;
			height: 48px;
			margin-bottom: 32px;
			background: $color-success-light;
			border-radius: 50%;
		}
	}
}

.link-preview {
	$this: &;

	display: flex;
	justify-content: space-between;
	min-width: 400px;
	max-width: 100%;
	padding: 16px 24px;
	cursor: pointer;
	border: 1px solid $color-gray-border;
	border-radius: 12px;

	@media screen and (max-width: $media-mobile) {
		min-width: auto;
	}

	&:hover,
	&:focus {
		#{$this}__icon {
			color: $color-primary-light;
			transform: rotate(45deg);
		}
	}

	&__link {
		overflow: hidden;
		text-overflow: ellipsis;
	}

	&__icon-wrapper {
		display: flex;
		align-items: center;
		padding-left: 16px;
		margin-left: 8px;
		border-left: 1px solid $color-gray-border;
	}

	&__icon {
		vertical-align: middle;
		transition-timing-function: ease-in-out;
		transition-duration: 0.2s;
		transition-property: transform, color;
	}
}
</style>
