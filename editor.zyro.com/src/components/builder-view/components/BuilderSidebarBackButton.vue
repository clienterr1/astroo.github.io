<template>
	<div
		class="builder-sidebar-back-button"
		data-qa="builder-sidebar-back-button"
	>
		<ZyroButton
			data-qa="builder-sidebar-btn-back"
			class="builder-sidebar-back-button__button"
			theme="header"
			color="white"
			@click="handleGoBack"
		>
			<Icon name="chevron_left" />
		</ZyroButton>

		<div
			v-if="isManageWebsiteModalOpen"
			ref="builderSidebarBackButtonRef"
			class="builder-sidebar-back-button__manage-modal"
		>
			<div class="builder-sidebar-back-button__link-container">
				<div
					v-if="isHostingerBrand"
					class="builder-sidebar-back-button__wrap"
				>
					<a
						v-qa="`builderheader-change-template-button`"
						tabindex="0"
						class="z-body-small builder-sidebar-back-button__link"
						:href="getRedirectUrlToBuilder({
							path: REDIRECT_PARAM_VALUES.AI_BUILDER,
							params: {
								siteId: websiteId,
								isChangingTemplate: true
							}
						})"
						@click="logChangeTemplateEvent"
					>
						{{ $t('builder.changeTemplateOrTryAI') }}
					</a>
				</div>
				<div v-else>
					<a
						v-qa="`builderheader-backtossdashboard`"
						tabindex="0"
						class="z-body-small builder-sidebar-back-button__link"
						:href="getRedirectUrlToDashboard({
							path: WWW_REDIRECT_PATHS.SINGLE_SITE_DASHBOARD,
							params: { siteId: websiteId }
						})"
					>
						<ZyroSvgDeprecated
							name="settings-circle-outlined"
							class="builder-sidebar-back-button__link-icon"
							dimensions="16px"
						/>
						{{ $t('builder.websiteManager') }}
					</a>
					<template v-if="isStoreTypeZyro || isStoreTypeEcwid">
						<a
							v-if="isStoreTypeZyro"
							v-qa="`builderheader-storeManager-zyro`"
							tabindex="0"
							class="z-body-small builder-sidebar-back-button__link"
							:href="getRedirectUrlToEcommerce({ siteId: websiteId })"
						>
							<ZyroSvgDeprecated
								name="online-store-outlined"
								class="builder-sidebar-back-button__link-icon"
								dimensions="16px"
							/>
							{{ $t('builder.storeManager.title') }}
						</a>
						<RouterLink
							v-else
							v-qa="`builderheader-storeManager-ecwid`"
							tabindex="0"
							class="z-body-small builder-sidebar-back-button__link"
							:to="{ name: STORE_MANAGER_ROUTE }"
						>
							<ZyroSvgDeprecated
								name="online-store-outlined"
								class="builder-sidebar-back-button__link-icon"
								dimensions="16px"
							/>
							{{ $t('builder.storeManager.title') }}
						</RouterLink>
					</template>
				</div>
			</div>

			<div class="builder-sidebar-back-button__bottom-link-container">
				<a
					v-if="isHostingerBrand"
					v-qa="`builderheader-backtohpanel-websites`"
					tabindex="0"
					class="z-body-small builder-sidebar-back-button__link builder-sidebar-back-button__link--bottom"
					:href="getRedirectUrlToHPanel({ path: 'websites' })"
				>
					<ZyroSvgDeprecated
						name="chevron-left"
						class="builder-sidebar-back-button__link-icon"
						dimensions="16px"
					/>
					{{ $t('siteSettings.backToAllWebsites') }}
				</a>
				<a
					v-else
					v-qa="`builderheader-backtossdashboard-sites`"
					tabindex="0"
					class="z-body-small builder-sidebar-back-button__link builder-sidebar-back-button__link--bottom"
					:href="getRedirectUrlToDashboard()"
				>
					<ZyroSvgDeprecated
						name="chevron-left"
						class="builder-sidebar-back-button__link-icon"
						dimensions="16px"
					/>
					{{ $t('siteSettings.allWebsites') }}
				</a>
			</div>
		</div>
	</div>
</template>
<script>
import ZyroButton from '@/components/global/ZyroButton.vue';
import Icon from '@/components/global/Icon.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import {
	WWW_REDIRECT_PATHS,
	REDIRECT_PARAM_VALUES,
} from '@/constants';
import {
	mapGetters,
	mapState,
} from 'vuex';
import {
	getRedirectUrlToHPanel,
	getRedirectUrlToHTemplates,
	getRedirectUrlToDashboard,
	getRedirectUrlToEcommerce,
	getRedirectUrlToBuilder,
} from '@/use/useRedirects';
import EventLogApi from '@/api/EventLogApi';
import { isHostingerBrand } from '@/utils/isHostingerBrand';
import {
	ref,
	defineComponent,
} from 'vue';
import { onClickOutside } from '@vueuse/core';
import { STORE_MANAGER_ROUTE } from '@/constants/routes';

export default defineComponent({
	components: {
		Icon,
		ZyroButton,
		ZyroSvgDeprecated,
	},

	setup() {
		const builderSidebarBackButtonRef = ref(null);
		const isManageWebsiteModalOpen = ref(false);

		const toggleManageWebsiteModal = () => {
			isManageWebsiteModalOpen.value = !isManageWebsiteModalOpen.value;
		};

		onClickOutside(builderSidebarBackButtonRef, () => {
			toggleManageWebsiteModal();
		});

		return {
			isHostingerBrand,
			WWW_REDIRECT_PATHS,
			REDIRECT_PARAM_VALUES,
			STORE_MANAGER_ROUTE,
			getRedirectUrlToHPanel,
			getRedirectUrlToHTemplates,
			getRedirectUrlToDashboard,
			getRedirectUrlToEcommerce,
			getRedirectUrlToBuilder,
			builderSidebarBackButtonRef,
			isManageWebsiteModalOpen,
			toggleManageWebsiteModal,
		};
	},

	computed: {
		...mapState(['websiteId']),
		...mapGetters('ecommerce', ['isStoreTypeZyro']),
		...mapGetters('ecwid', ['isStoreTypeEcwid']),
	},

	methods: {
		handleGoBack() {
			if (this.isHostingerBrand) {
				EventLogApi.logEvent({
					eventName: 'website_builder.builder.back',
					isHostingerEvent: true,
				});
			}

			this.toggleManageWebsiteModal();
		},
		logChangeTemplateEvent() {
			EventLogApi.logEvent({
				eventName: 'website_builder.change_template.enter',
				isHostingerEvent: true,
			});
		},
	},
});
</script>
<style lang="scss" scoped>
.builder-sidebar-back-button {
	$this: &;

	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 49px;

	&__button {
		display: flex;
		justify-content: flex-start;
		width: 100%;
		height: $header-height-editor;
	}

	&__manage-modal {
		position: absolute;
		top: #{$header-height-editor + 8px};
		left: 16px;
		z-index: $z-index-layout-sidebar;
		min-width: 224px;
		color: $color-dark;
		background-color: $color-light;
		border: 1px solid $color-gray-light;
		border-radius: 12px;
		box-shadow: $box-shadow;
	}

	&__link-container {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		padding: 8px;
		border-bottom: 1px solid $color-gray-border;
	}

	&__link {
		display: flex;
		width: 100%;
		padding: 8px 12px;
		text-decoration: none;
		cursor: pointer;
		border-radius: 8px;
		transition: 0.2s;
		white-space: nowrap;

		&--bottom {
			display: flex;
			flex-direction: row;
			align-items: center;
		}

		&:hover {
			background-color: $color-gray-light;
		}
	}

	&__wrap {
		width: 100%;
	}

	&__link-icon {
		margin-right: 12px;
		color: $color-primary;
	}

	&__bottom-link-container {
		padding: 8px;
	}
}
</style>
