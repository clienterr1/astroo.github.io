<template>
	<div>
		<ZyroButton
			ref="triggerButton"
			class="sidebar-popup__trigger-button z-body-small z-body-small--strong"
			data-qa="builder-sidebar-btn-changes"
			color="white"
			:title="title"
		>
			<template #icon>
				<Icon
					:name="icon"
					dimensions="16px"
					is-custom
				/>
			</template>
			<p v-if="isSidebarExpanded">
				{{ title }}
			</p>
		</ZyroButton>
		<Popup
			v-if="isPopupVisible"
			:target-ref="$refs.triggerButton?.$el"
			auto-update
			:offset="16"
			@click-outside="closeHandler"
		>
			<div class="migration-changes">
				<div class="migration-changes__header">
					<div class="header__icon">
						<ZyroSvgDeprecated
							:name="icon"
							dimensions="24px"
						/>
					</div>
					<div class="header__title">
						{{ $t('builder.gridToLayoutMigrationImportantChanges') }}
					</div>
					<div class="header__close-button">
						<ZyroButton
							class="close-button"
							:title="$t('common.close')"
							@click="closeHandler"
						>
							<template #icon>
								<Icon
									name="close"
									dimensions="20px"
								/>
							</template>
						</ZyroButton>
					</div>
				</div>

				<div class="migration-changes__content">
					<div
						v-if="splitSlideshows.length"
						class="content__slideshows"
					>
						<div class="slideshows__disclaimer">
							<b>{{ $t('common.slideshow') }}:</b> <span>{{ $t('builder.gridToLayoutMigrationSlideshowDisclaimer') }}</span>
						</div>
						<ul class="slideshows__slideshow-list">
							<li
								v-for="slideshow in splitSlideshows"
								:key="`${slideshow.locale}${slideshow.pageId}${slideshow.blockId}`"
								class="slideshow-item"
							>
								<div class="slideshow-item__icon">
									<ZyroSvgDeprecated
										:name="!slideshow.isViewed ? 'check-mark-circle-grey' : 'check-mark-circle-green'"
										dimensions="16px"
									/>
								</div>
								<div class="slideshow-item__text">
									<i18n-t
										tag="p"
										keypath="builder.gridToLayoutMigrationSlideshowItemText"
										class="migration-to-layout-modal__subtitle"
									>
										<b>“{{ slideshow.pageName }}”</b>
									</i18n-t>
								</div>
								<div class="slideshow-item__view-button">
									<button
										@click="handleViewPageClick({
											locale: slideshow.locale,
											pageId:slideshow.pageId,
											blockId: slideshow.blockId,
											modificationType: 'splitSlideshows'
										})"
									>
										{{ $t('builder.view') }}
									</button>
								</div>
							</li>
						</ul>
					</div>

					<div
						v-if="unsnappedElementSections.length"
						class="content__sections"
					>
						<div class="sections__disclaimer">
							<b>{{ $t('common.section') }}:</b> <span>{{ $t('builder.gridToLayoutMigrationSectionDisclaimer') }}</span>
						</div>
						<ul class="sections__section-list">
							<li
								v-for="section in unsnappedElementSections"
								:key="`${section.locale}${section.pageId}${section.blockId}`"
								class="section-item"
							>
								<div class="section-item__icon">
									<ZyroSvgDeprecated
										:name="!section.isViewed ? 'check-mark-circle-grey' : 'check-mark-circle-green'"
										dimensions="16px"
									/>
								</div>
								<div class="section-item__text">
									<i18n-t
										tag="p"
										keypath="builder.gridToLayoutMigrationSectionItemText"
										class="migration-to-layout-modal__subtitle"
									>
										<b>“{{ section.pageName }}”</b>
									</i18n-t>
								</div>
								<div class="section-item__view-button">
									<button
										@click="handleViewPageClick({
											locale: section.locale,
											pageId:section.pageId,
											blockId: section.blockId,
											modificationType: 'unsnappedElementSections'
										})"
									>
										{{ $t('builder.view') }}
									</button>
								</div>
							</li>
						</ul>
					</div>

					<div
						v-if="migrationToLayoutModifications.imageObjectFitRemoved"
						class="content__sections"
					>
						<div class="sections__disclaimer">
							<b>
								{{ $t('builder.editImage.tabImage.objectFit') }} {{ $t('builder.editImage.tabImage.fit') }}:
							</b> <span>{{ $t('builder.gridToLayoutMigrationImageFitDisclaimer') }}</span>
						</div>
					</div>

					<label class="content__consent">
						<ZyroCheckbox
							class="consent__checkbox"
							:model-value="consentCheckbox"
							theme="purple"
							:is-filled="true"
							@update:model-value="consentCheckbox = !consentCheckbox"
						/>
						<p>{{ $t('builder.gridToLayoutMigrationConsentDisclaimer') }}</p>
					</label>
				</div>

				<div class="migration-changes__footer">
					<ZyroButton
						v-qa="'migration-changes-footer-button'"
						class="footer-button"
						:disabled="!consentCheckbox"
						theme="primary"
						@click="understoodHandler"
					>
						{{ $t('builder.understood') }}
					</ZyroButton>
				</div>
			</div>
		</Popup>
	</div>
</template>

<script>
import Icon from '@/components/global/Icon.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';
import Popup from '@/components/global/Popup.vue';
import ZyroCheckbox from '@/components/global/ZyroCheckbox.vue';

import {
	computed,
	defineComponent,
	ref,
} from 'vue';
import { useStore } from 'vuex';

export default defineComponent({

	components: {
		Icon,
		ZyroSvgDeprecated,
		ZyroButton,
		Popup,
		ZyroCheckbox,
	},

	props: {
		isActive: {
			type: Boolean,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		icon: {
			type: String,
			required: true,
		},
	},
	emits: ['close-popup'],
	setup(props, context) {
		const {
			state,
			getters,
			dispatch,
			commit,
		} = useStore();
		const isPopupVisible = computed(() => props.isActive || state.gui.isMigrationToLayoutPopupVisible);
		const isSidebarExpanded = computed(() => state.gui.isSidebarExpanded);
		const consentCheckbox = ref(false);
		const migrationToLayoutModifications = computed(() => getters.siteMeta.migrationToLayoutModifications);

		const getPageIdByBlockId = (blockId, locale) => {
			// User may have removed a locale after the migration - if that's the case, do not include this page as a changed one.
			if (!getters.siteLanguages[locale]) {
				return null;
			}

			return Object.entries(getters.siteLanguages[locale].pages)
			// eslint-disable-next-line no-unused-vars
				.find(([_, { blocks }]) => Object.values(blocks).includes(blockId))?.[0] || null;
		};

		const splitSlideshows = computed(() => Object.entries(migrationToLayoutModifications.value.splitSlideshows || {})
			.flatMap(([locale, splitSlideshowData]) => Object.entries(splitSlideshowData)
				.map(([blockId, isViewed]) => {
					const pageId = getPageIdByBlockId(blockId, locale);

					if (pageId === null) {
						return null;
					}

					return {
						blockId,
						pageId,
						pageName: getters.siteLanguages[locale].pages[pageId]?.name,
						locale,
						isViewed,
					};
				}))
			.filter((splitSlideshow) => splitSlideshow)
			.sort((a, b) => a.pageId.localeCompare(b.pageId)));

		const unsnappedElementSections = computed(() => Object.entries(migrationToLayoutModifications.value.unsnappedElementSections || {})
			.flatMap(([locale, unsnappedElementSectionData]) => Object.entries(unsnappedElementSectionData)
				.map(([blockId, isViewed]) => {
					const pageId = getPageIdByBlockId(blockId, locale);

					if (pageId === null) {
						return null;
					}

					return {
						blockId,
						pageId,
						pageName: getters.siteLanguages[locale].pages[pageId]?.name,
						locale,
						isViewed,
					};
				}))
			.filter((unsnappedElementSection) => unsnappedElementSection)
			.sort((a, b) => a.pageId.localeCompare(b.pageId)));

		const closeHandler = () => {
			context.emit('close-popup');
			dispatch('gui/setMigrationToLayoutPopupVisibility', false);
		};

		const understoodHandler = () => {
			closeHandler();
			dispatch('removeMetaProperty', 'migrationToLayoutModifications');
			dispatch('saving/saveWebsite');
		};

		// modificationType: ['splitSlideshows' | 'unsnappedElementSection']
		// matches property name in siteData
		const handleViewPageClick = async ({
			locale,
			pageId,
			blockId,
			modificationType,
		}) => {
			if (state.currentLocale !== locale) {
				await dispatch('updateCurrentLocale', locale);
			}

			if (state.currentPageId !== pageId) {
				await dispatch('updateCurrentPageId', pageId);
			}

			document
				.querySelector(`[data-block-id="${blockId}"]`)
				.scrollIntoView({
					behavior: 'smooth',
					block: 'start',
					inline: 'nearest',
				});

			const value = {
				...migrationToLayoutModifications.value,
				[modificationType]: {
					...migrationToLayoutModifications.value[modificationType],
					[locale]: {
						...migrationToLayoutModifications.value[modificationType][locale],
						[blockId]: true,
					},
				},
			};

			commit('setWebsiteMeta', {
				key: 'migrationToLayoutModifications',
				value,
			});
		};

		return {
			migrationToLayoutModifications,
			isPopupVisible,
			handleViewPageClick,
			closeHandler,
			understoodHandler,
			isSidebarExpanded,
			consentCheckbox,
			splitSlideshows,
			unsnappedElementSections,
		};
	},
});
</script>

<style lang="scss" scoped>
@import "@/components/builder-view/components/BuilderSidebarPopup";

$builder-header-height: 50px;
$modal-vertical-padding-sum: 32px;
$modal-max-height: calc(100vh - $builder-header-height - $modal-vertical-padding-sum);
$modal-header-height: 70px;
$modal-footer-height: 60px;

.migration-changes {
	width: calc(100vw - 32px);
	max-width: 380px;
	max-height: $modal-max-height;
	padding: 16px;
	background-color: $color-light;
	border-radius: 16px;
	box-shadow: 0 6px 14px 0 $color-dark;

	&__header {
		display: flex;
		align-items: center;
		margin-bottom: 16px;

		.header__icon {
			display: flex;
			align-items: center;
			margin-right: 10px;
		}

		.header__title {
			margin-right: auto;
			font-size: 16px;
			font-weight: 700;
		}

		.header__close-button .close-button {
			margin-top: calc((36px - 20px) / -2);
			margin-right: calc((36px - 20px) / -2);
		}
	}

	&__content {
		max-height: calc($modal-max-height - $modal-header-height - $modal-footer-height - 16px);
		padding: 0 16px;
		margin: 0 -16px;
		overflow-y: scroll;

		.content__slideshows .slideshows__disclaimer,
		.content__sections .sections__disclaimer {
			margin-bottom: 16px;

			span {
				color: $color-gray;
			}
		}

		.content__slideshows .slideshows__slideshow-list,
		.content__sections .sections__section-list {
			margin-bottom: 16px;
			list-style: none;

			.slideshow-item,
			.section-item {
				display: flex;
				align-items: center;
				padding-bottom: 4px;
				padding-left: 18px;
				border-left: 1px solid $color-gray-border;

				&__icon {
					display: flex;
					align-items: center;
					margin-right: 10px;
				}

				&__text {
					margin-right: auto;
				}

				&__view-button button {
					font-size: 14px;
					color: $color-primary;
					text-decoration: underline;

					&:hover {
						cursor: pointer;
					}
				}
			}
		}

		.content__consent {
			display: flex;
			margin-top: 24px;
			margin-bottom: 16px;

			.consent__checkbox {
				margin-right: 8px;
				font-size: 20px;
			}

			p {
				font-size: 14px;
			}
		}
	}

	&__footer {
		display: flex;
		flex-direction: row-reverse;
		width: calc(100% + 32px);
		padding-top: 16px;
		margin: 0 -16px;
		border-top: 1px solid $color-gray-border;

		.footer-button {
			margin-right: 16px;
		}
	}
}
</style>
