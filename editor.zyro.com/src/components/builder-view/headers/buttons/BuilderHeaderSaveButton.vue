<template>
	<div
		ref="save"
		class="save"
		:class="{ 'save--demo-button': isDemoMode }"
		@mouseenter="setIsSavePopupVisible(true)"
	>
		<ZyroButton
			id="saveWebsiteButton"
			v-qa="`builder-header-btn-${!canSave ? 'saved' : 'save'}`"
			theme="header"
			color="white"
			:disabled="!canSave"
			@click="handleSaveClick"
		>
			<template
				v-if="isDemoMode"
				#icon-left
			>
				<Icon
					name="info"
					dimensions="16px"
					is-filled
				/>
			</template>
			<div
				v-if="!isDemoMode"
				class="save-icon"
				:class="{
					'is-hidden': canSave,
					'is-saved': !canSave,
					'is-saving': isSaving
				}"
			>
				<div class="save-icon__stroke save-icon__stroke--inactive" />
				<div class="save-icon__stroke save-icon__stroke--active" />
				<div class="save-icon__check" />
			</div>
			<div class="save-text">
				{{ buttonLabel }}
			</div>
		</ZyroButton>

		<Popup
			v-if="isSavePopupVisible"
			:target-ref="$refs.save"
			placement="bottom"
			:offset="0"
			auto-update
		>
			<div
				class="save__popup-container"
				@mouseenter="setIsSavePopupVisible(true)"
				@mouseleave="setIsSavePopupVisible(false)"
			>
				<div class="save__popup-content">
					<div v-if="isDemoMode">
						<div class="save__popup-title z-body-small z-font-weight-bold">
							{{ $t('builder.saveButtonPopup.notSaved') }}
						</div>
						<i18n-t
							keypath="builder.saveButtonPopup.notSavedDescription"
							tag="span"
							class="z-body-small"
						>
							<span
								class="z-link"
								@click="handleDemoRedirect"
							>
								{{ $t('common.chooseBuilder') }}
							</span>
						</i18n-t>
					</div>

					<div v-else>
						<div class="save__popup-title z-body-small z-body-small--strong">
							{{ $t('builder.saveButtonPopup.user.title') }}
						</div>
						<div class="save__popup-description z-body-small">
							{{ $t('builder.saveButtonPopup.user.description') }}
						</div>
						<div
							class="save__popup-view-history"
						>
							<p class="z-body-small">
								{{ $t('builder.versionHistoryCreateMessage') }}
							</p>
							<p
								class="save__version-link z-body-small z-link"
								:class="{ 'save__version-link--disabled': !isSitePublished }"
								@click="openVersionHistory"
							>
								{{ $t('builder.versionHistorySee') }}
							</p>
						</div>
					</div>
				</div>
			</div>
		</Popup>
	</div>
</template>

<script>
import { defineComponent } from 'vue';

import {
	mapState,
	mapActions,
	mapGetters,
} from 'vuex';

import { VERSION_HISTORY_ROUTE } from '@/constants/routes';
import { useRedirects } from '@/use/useRedirects';
import EventLogApi from '@/api/EventLogApi';

import Icon from '@/components/global/Icon.vue';
import { useHeaderPopups } from '@/use/useHeaderPopups';
import ZyroButton from '@/components/global/ZyroButton.vue';
import Popup from '@/components/global/Popup.vue';

export default defineComponent({
	components: {
		Icon,
		ZyroButton,
		Popup,
	},
	setup() {
		const { handleDemoRedirect } = useRedirects();
		const {
			setIsSavePopupVisible,
			isSavePopupVisible,
		} = useHeaderPopups();

		return {
			handleDemoRedirect,
			isSavePopupVisible,
			setIsSavePopupVisible,
			VERSION_HISTORY_ROUTE,
		};
	},
	computed: {
		...mapState(['isDemoMode']),
		...mapState('user', ['user']),
		...mapState('saving', ['isSaving']),
		...mapGetters(['isSitePublished']),
		...mapGetters('saving', ['canSave']),
		buttonLabel() {
			if (this.isDemoMode) {
				return this.$t('builder.saveButtonPopup.notSaved');
			}

			if (this.isSaving) {
				return this.$t('common.saving');
			}

			if (this.canSave) {
				return this.$t('common.save');
			}

			return this.$t('common.saved');
		},
	},

	created() {
		document.addEventListener('keydown', this.handleKeydown, false);
	},

	beforeUnmount() {
		document.removeEventListener('keydown', this.handleKeydown);
	},

	methods: {
		...mapActions('saving', ['saveWebsite']),
		handleSaveClick() {
			if (this.canSave) {
				this.saveWebsite({
					saveWhenImpersonating: true,
				});

				EventLogApi.logEvent({
					eventName: 'website_builder.builder.saved',
					isHostingerEvent: true,
				});
			}
		},
		handleKeydown(event) {
			if ((event.ctrlKey || event.metaKey) && event.key === 's') {
				if (this.canSave) {
					event.preventDefault();
					this.saveWebsite();
				}
			}
		},
		async openVersionHistory() {
			if (!this.isSitePublished) {
				return;
			}

			await this.saveWebsite();
			this.$router.push({
				name: VERSION_HISTORY_ROUTE,
			});
		},
	},
});
</script>

<style lang="scss" scoped>
@keyframes spin {
	100% {
		transform: rotate(392deg);
	}
}

.save {
	position: relative;

	&--demo-button {
		:deep(.zyro-button) {
			color: $color-warning-dark;
		}
	}

	&__popup-container {
		padding-top: 8px;
	}

	&__popup-content {
		display: flex;
		flex-direction: column;
		max-width: 282px;
		padding: 16px;
		background-color: $color-light;
		border: 1px solid $color-gray-light;
		border-radius: 12px;
		box-shadow: $box-shadow;
	}

	&__popup-description {
		margin-bottom: 12px;
		color: $color-gray;
	}

	&__popup-view-history {
		padding-top: 12px;
		color: $color-gray;
		border-top: 1px solid $color-gray-border;
	}

	&__version-link {
		margin-top: 4px;

		&--disabled {
			color: $color-gray;
			cursor: not-allowed;
		}
	}

	&__popup-title {
		margin-bottom: 8px;
	}
}

.save-icon {
	$this: &;

	position: relative;
	display: block;
	width: 16px;
	height: 16px;
	margin-right: 6px;

	&__stroke {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		border: 2px solid;
		border-radius: 50%;

		&--inactive {
			border-color: $color-gray-border;
			opacity: 0;
		}

		&--active {
			clip-path: polygon(0 0, 50% 0, 50% 50%, 100% 0, 100% 100%, 0 100%);
			border-color: var(--color-success);
			transition: transform 0.8s, clip-path 0.5s;
			transform: rotate(32deg);
		}
	}

	&__check {
		position: absolute;
		bottom: 5px;
		left: 50%;
		width: 12px;
		height: 6px;
		transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
		transform: scale(0) rotate(-45deg);
		transform-origin: 0% 100%;

		&::before,
		&::after {
			position: absolute;
			bottom: 0;
			left: 0;
			content: "";
			background: var(--color-success);
			transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
		}

		&::before {
			top: 0;
			width: 2px;
			transform-origin: 50% 100%;
		}

		&::after {
			right: 0;
			height: 2px;
			transform-origin: 0% 50%;
		}
	}

	&.is-saving {
		transition: all 0.3s;

		#{$this} {
			&__stroke {
				&--inactive {
					opacity: 1;
				}

				&--active {
					clip-path: polygon(0 0, 50% 0, 50% 50%, 100% 100%, 100% 100%, 0 100%);
					animation: spin 0.8s linear 0s infinite;
				}
			}

			&__check {
				transform: scale(0) rotate(-90deg);

				&::before {
					transform: scale(1, 0);
				}

				&::after {
					transform: scale(0, 1);
				}
			}
		}
	}

	&.is-hidden {
		width: 0;
		height: 0;
		overflow: hidden;
	}

	&.is-saved {
		#{$this} {
			&__check {
				transform: scale(1) rotate(-45deg);
			}
		}
	}
}
</style>
