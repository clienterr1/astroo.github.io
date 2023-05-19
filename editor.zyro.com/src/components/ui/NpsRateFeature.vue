<template>
	<div
		class="rate-feature"
		:class="{ 'rate-feature--description-disabled': isDescriptionDisabled }"
	>
		<div
			class="rate-feature__container"
			:class="{ 'rate-feature__container--with-border': !hideBorder }"
		>
			<a
				target="_blank"
				class="z-link z-link--dark"
				@click="openNps"
			>
				<ZyroSvgDeprecated
					class="rate-feature__icon"
					name="smiley-face"
				/>
			</a>
			<p
				v-if="!isDescriptionDisabled"
				class="rate-feature__text"
			>
				<i18n-t
					tag="p"
					keypath="builder.editImage.tabSeo.NpsImage"
				>
					<a
						target="_blank"
						class="z-link z-link--dark"
						data-qa="feature-nps-modal-link"
						@click="openNps"
					>
						{{ $t('builder.editImage.tabSeo.NpsImageRateThisFeature') }}
					</a>
				</i18n-t>
			</p>
		</div>
	</div>
</template>

<script>
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import { mapActions } from 'vuex';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroSvgDeprecated,
	},

	props: {
		featureName: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			required: true,
		},
		isDescriptionDisabled: {
			type: Boolean,
			default: false,
		},
		hideBorder: {
			type: Boolean,
			default: false,
		},
	},

	methods: {
		...mapActions('nps', ['setNpsData']),
		openNps() {
			this.setNpsData({
				question: `${this.$t('builder.npsRateQuestion')} ${this.featureName}?`,
				isVisible: true,
				formType: this.type,
			});
		},
	},
});
</script>

<style lang="scss" scoped>
.rate-feature {
	$this: &;

	display: flex;
	align-items: flex-start;
	margin-bottom: 0;
	font-size: 13px;

	&__container {
		display: flex;
		width: 100%;
		padding-top: 8px;

		&--with-border {
			border-top: 1px solid $color-gray-border;

			#{$this} {
				margin-top: 0;
			}
		}
	}

	&--description-disabled {
		padding-left: 7px;
		margin-top: 0;

		#{$this}__container {
			padding-top: 6px;
			border-top: 0;
		}

		#{$this}__icon {
			width: 22px;
			height: 22px;
		}
	}

	&__icon {
		flex-shrink: 0;
		width: 20px;
		height: 20px;
		margin-right: 8px;
	}

	&__text {
		line-height: 1.25;
		color: $color-gray;
	}
}

</style>
