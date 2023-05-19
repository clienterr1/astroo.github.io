<template>
	<div class="ecommerce-page-item">
		<div
			class="ecommerce-page-item__info"
			@click="handleProductClick"
		>
			<ProductImage
				v-if="page.meta.ogImagePath"
				:src="page.meta.ogImagePath"
				:alt="page.meta.ogImageAlt"
				:site-id="siteId"
				class="ecommerce-page-item__image"
				width="32px"
				height="32px"
			/>
			<div
				v-else
				class="ecommerce-page-item__image"
			>
				<ZyroSvgDeprecated
					class="ecommerce-page-item__image-placeholder"
					dimensions="32px"
					name="blank"
				/>
			</div>
			<p
				v-qa="'manage-ecommerce-label-pagename'"
				class="ecommerce-page-item__title z-body-small"
			>
				{{ page.name }}
			</p>
		</div>
		<ZyroButton
			ref="manageEcommerceButton"
			v-qa="'manage-ecommerce-btn-pagesettings'"
			:title="$t('common.moreSettings')"
			data-testId="popup-trigger"
			class="ecommerce-page-item__settings-button"
			@click="isPageItemPopupOpen = !isPageItemPopupOpen"
		>
			<template #icon>
				<Icon
					name="settings"
					dimensions="16px"
				/>
			</template>
		</ZyroButton>
		<Popup
			v-if="isPageItemPopupOpen"
			:target-ref="$refs.manageEcommerceButton && $refs.manageEcommerceButton.$el"
			placement="bottom"
			auto-update
			:offset="4"
			@click-outside="isPageItemPopupOpen = false"
		>
			<div class="ecommerce-page-item__popup-content">
				<ZyroButton
					v-qa="`manage-ecommerce-popup-button-settings`"
					theme="plain"
					:title="$t('builder.pageSettingsModal.title')"
					class="popup-content__button"
					text-class="z-body-small"
					@click="handleSettingsClick"
				>
					<template #icon-left>
						<Icon
							name="settings"
							dimensions="16px"
						/>
					</template>
					{{ $t('builder.pageSettingsModal.title') }}
				</ZyroButton>
				<ZyroButton
					v-qa="`manage-ecommerce-popup-button-seo`"
					theme="plain"
					:title="$t('builder.pageSettingsModal.buttonSeoTitle')"
					class="popup-content__button"
					text-class="z-body-small"
					@click="$emit('open-seo-settings')"
				>
					<template #icon-left>
						<Icon
							name="search"
							dimensions="16px"
						/>
					</template>
					{{ $t('builder.pageSettingsModal.buttonSeoTitle') }}
				</ZyroButton>
				<ZyroButton
					v-if="!isDemoMode"
					v-qa="`manage-ecommerce-popup-button-edit`"
					theme="plain"
					:title="$t('builder.editProduct')"
					class="popup-content__button"
					text-class="z-body-small"
					@click="handleEditClick"
				>
					<template #icon-left>
						<Icon
							name="edit"
							dimensions="16px"
						/>
					</template>
					{{ $t('builder.editProduct') }}
				</ZyroButton>
			</div>
		</Popup>
	</div>
</template>

<script>
import {
	defineComponent,
	ref,
	computed,
} from 'vue';
import { useStore } from 'vuex';
import { isHostingerBrand } from '@/utils/isHostingerBrand';
import EventLogApi from '@/api/EventLogApi';

import Icon from '@/components/global/Icon.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';
import Popup from '@/components/global/Popup.vue';
import ProductImage from '@zyro-inc/site-modules/components/ecommerce/ProductImage.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

export default defineComponent({
	components: {
		Icon,
		ZyroButton,
		Popup,
		ProductImage,
		ZyroSvgDeprecated,
	},
	props: {
		page: {
			type: Object,
			default: null,
		},
	},
	emits: [
		'open-page',
		'open-settings',
		'edit',
	],

	setup() {
		const { state } = useStore();

		const manageEcommerceButton = ref(null);
		const isPageItemPopupOpen = ref(false);
		const isDeleteModalShown = ref(false);
		const isDemoMode = computed(() => state.isDemoMode);
		const siteId = computed(() => state.websiteId);

		return {
			manageEcommerceButton,
			isPageItemPopupOpen,
			isDeleteModalShown,
			isDemoMode,
			siteId,
		};
	},
	methods: {
		handleProductClick() {
			EventLogApi.logEvent({
				eventName: 'website_builder.ecomm_product_page.enter',
				eventProperties: {
					location: 'drawer',
				},
				isHostingerEvent: isHostingerBrand,
			});

			this.$emit('open-page');
		},
		async handleEditClick() {
			await EventLogApi.logEvent({
				eventName: 'website_builder.ecomm_products.edit',
				eventProperties: {
					location: 'side_menu',
				},
				isHostingerEvent: isHostingerBrand,
			});

			this.$emit('edit');
		},
		handleSettingsClick() {
			EventLogApi.logEvent({
				eventName: 'website_builder.ecomm_page_settings.enter',
				isHostingerEvent: isHostingerBrand,
			});

			this.$emit('open-settings');
		},
	},
});
</script>

<style lang="scss" scoped>
.ecommerce-page-item {
	position: relative;
	display: flex;
	padding: 10px;
	cursor: pointer;
	border-top: 1px solid $color-gray-light;

	&:hover,
	&:focus {
		background-color: $color-gray-light;
		transition: background-color 0.3s ease 0s;
	}

	&__info {
		display: flex;
		align-items: center;
		width: 100%;
		padding-left: 4px;
	}

	&__image-placeholder,
	&__image {
		border-radius: 3px;
	}

	&__image {
		width: 32px;
		height: 32px;
		margin-right: 8px;
		object-fit: cover;
		object-position: center;
	}

	&__title {
		width: 100%;
		max-width: 192px;
		overflow: hidden;
		line-height: 1.43;
		text-overflow: ellipsis;
		letter-spacing: 0.015em;
		white-space: nowrap;
	}

	&__popup-content {
		display: flex;
		flex-direction: column;
		max-width: 400px;
		padding: 16px;
		overflow: hidden;
		background-color: $color-light;
		border-radius: $border-radius-medium;
		box-shadow: 0 6px 14px rgba(0, 0, 0, 10%);
	}
}
</style>
