<template>
	<div class="password-settings">
		<div class="password-settings__enable">
			<p class="z-body-small z-body-small--strong">
				{{ $t('builder.enablePassword') }}
			</p>
			<ZyroToggle
				id="password-toggle"
				data-qa="password-enable-toggle"
				:model-value="isPasswordEnabled"
				@update:model-value="$emit('toggle-password-enable', $event)"
			/>
		</div>
		<p
			class="password-settings__subtitle z-body-small"
			:class="{ 'password-settings__subtitle--disabled': !isPasswordEnabled }"
		>
			{{ $t('builder.passwordExplained') }}
		</p>
		<form
			v-if="isPasswordEnabled"
			class="password-settings__form"
			@submit.prevent
		>
			<ZyroFieldInput
				id="page-password"
				v-qa="'sitesettings-popup-input-password'"
				:model-value="password"
				:label="$t('common.password')"
				:placeholder="$t('builder.enterPassword')"
				:type="isPasswordVisible ? 'text' : 'password'"
				:disabled="password !== '' && !isPasswordChanged"
				:error="passwordErrorMessage"
				:maxlength="50"
				@update:model-value="$emit('password-change', $event)"
			>
				<template #suffix>
					<div
						v-if="isPasswordChanged"
						class="password-settings__visibility-change"
						role="toggle-password-visibility"
						@click="isPasswordVisible = !isPasswordVisible"
					>
						<input
							v-model="isPasswordVisible"
							class="password-settings__checkbox"
							type="checkbox"
						>
						<ZyroSvgDeprecated
							class="password-settings__eye-icon"
							:name="isPasswordVisible ? 'eye-open' : 'eye-closed'"
						/>
					</div>
				</template>
			</ZyroFieldInput>
			<ZyroButton
				v-if="password && !isPasswordChanged"
				theme="primary"
				data-qa="page-password-button-change"
				@mousedown="$emit('password-change', '')"
			>
				{{ $t('common.change') }}
			</ZyroButton>
			<p class="password-settings__select-design z-body-small z-body-small--strong">
				{{ $t('builder.passwordCustomizePage') }}
			</p>
			<ZyroSegmentControl
				class="password-settings__customize-tabs"
				:controls="tabs"
				is-background-dark
				:active-control="currentTab"
				@update:active-control="changeTab"
			/>
			<div
				v-if="currentTab.id === TAB_DESIGN"
				class="password-settings__customize-settings-container"
			>
				<div
					v-for="design in designOptions"
					:key="design.id"
					class="password-settings__design-option"
					:class="{ 'password-settings__design-option--selected': design.id === passwordDesign }"
					@click="$emit('design-change', design.id)"
				>
					<div
						class="password-settings__design-image-wrap"
						:class="{ 'password-settings__design-image-wrap--selected': design.id === passwordDesign }"
					>
						<img
							:src="design.image"
							class="password-settings__design-option-image"
						>
						<ZyroSvgDeprecated
							v-if="design.id === passwordDesign"
							name="check-mark"
							class="password-settings__select-indicator"
						/>
					</div>
				</div>
			</div>
			<div
				v-if="currentTab.id === TAB_TEXTS"
				class="password-settings__customize-settings-container"
			>
				<ZyroFieldInput
					id="page-heading"
					v-qa="'sitesettings-popup-input-heading-text'"
					:model-value="headingText"
					:label="$t('common.heading')"
					:placeholder="defaultPasswordPageTexts.heading"
					:maxlength="50"
					@update:model-value="$emit('password-page-text-change', {
						newValue: $event,
						type: 'heading'
					})"
				/>
				<ZyroFieldInput
					id="page-subheading"
					v-qa="'sitesettings-popup-input-subheading-text'"
					:model-value="subheadingText"
					:label="$t('common.subheading')"
					:placeholder="defaultPasswordPageTexts.subheading"
					:maxlength="50"
					@update:model-value="$emit('password-page-text-change', {
						newValue: $event,
						type: 'subheading'
					})"
				/>
				<ZyroFieldInput
					id="page-input-placeholder"
					v-qa="'sitesettings-popup-input-placeholder-text'"
					:model-value="placeholderText"
					:label="$t('builder.editForm.placeholderText')"
					:placeholder="defaultPasswordPageTexts.inputPlaceholder"
					:maxlength="50"
					@update:model-value="$emit('password-page-text-change', {
						newValue: $event,
						type: 'inputPlaceholder'
					})"
				/>
				<ZyroFieldInput
					id="page-button-text"
					v-qa="'sitesettings-popup-input-button-text'"
					:model-value="buttonText"
					:label="$t('common.button')"
					:placeholder="defaultPasswordPageTexts.button"
					:maxlength="50"
					@update:model-value="$emit('password-page-text-change', {
						newValue: $event,
						type: 'button'
					})"
				/>
				<ZyroFieldInput
					id="page-back-text"
					v-qa="'sitesettings-popup-back-text'"
					:model-value="backText"
					:label="$t('common.footer')"
					:placeholder="defaultPasswordPageTexts.backText"
					:maxlength="50"
					@update:model-value="$emit('password-page-text-change', {
						newValue: $event,
						type: 'backText'
					})"
				>
					<template #suffix>
						<p class="password-settings__back-text-suffix">
							{{ homepageName }}
						</p>
					</template>
				</ZyroFieldInput>
			</div>
		</form>
	</div>
</template>
<script>
import {
	defineComponent,
	computed,
	ref,
} from 'vue';
import { useI18n } from 'vue-i18n';

import { useStore } from 'vuex';
import EventLogApi from '@/api/EventLogApi';

import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';
import ZyroFieldInput from '@/components/global/ZyroFieldInput.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroToggle from '@/components/global/ZyroToggle.vue';
import ZyroSegmentControl from '@/components/global/ZyroSegmentControl.vue';

import designDefault from '@/assets/images/password-page-design-default.png';
import designCalm from '@/assets/images/password-page-design-calm.png';
import designPopular from '@/assets/images/password-page-design-popular.png';

import {
	PAGE_PASSWORD_DESIGN_TYPE_DEFAULT,
	PAGE_PASSWORD_DESIGN_TYPE_CALM,
	PAGE_PASSWORD_DESIGN_TYPE_POPULAR,
} from '@zyro-inc/site-modules/constants/index';

const TAB_DESIGN = 'design';
const TAB_TEXTS = 'texts';

export default defineComponent({
	components: {
		ZyroSegmentControl,
		ZyroFieldInput,
		ZyroToggle,
		ZyroButton,
		ZyroSvgDeprecated,
	},
	props: {
		password: {
			type: String,
			default: '',
		},
		passwordDesign: {
			type: String,
			default: 'default',
		},
		isPasswordChanged: {
			type: Boolean,
			default: false,
		},
		headingText: {
			type: String,
			default: '',
		},
		subheadingText: {
			type: String,
			default: '',
		},
		placeholderText: {
			type: String,
			default: '',
		},
		buttonText: {
			type: String,
			default: '',
		},
		backText: {
			type: String,
			default: '',
		},
		isPasswordEnabled: {
			type: Boolean,
			default: false,
		},
		defaultPasswordPageTexts: {
			type: Object,
			required: true,
		},
	},
	emits: [
		'password-page-text-change',
		'toggle-password-enable',
		'password-change',
		'design-change',
	],
	setup(props) {
		const { t } = useI18n();
		const { getters } = useStore();

		const currentTab = ref(null);
		const isPasswordVisible = ref(false);

		const homepageName = computed(() => getters.siteHomePage?.name);
		const passwordErrorMessage = computed(() => {
			if (props.isPasswordEnabled && props.isPasswordChanged && !props.password) {
				return t('builder.passwordErrorMessage');
			}

			return '';
		});

		const designOptions = [
			{
				id: PAGE_PASSWORD_DESIGN_TYPE_DEFAULT,
				image: designDefault,
			},
			{
				id: PAGE_PASSWORD_DESIGN_TYPE_CALM,
				image: designCalm,
			},
			{
				id: PAGE_PASSWORD_DESIGN_TYPE_POPULAR,
				image: designPopular,
			},
		];

		const tabs = [
			{
				id: TAB_DESIGN,
				title: t('builder.helpResources.design'),
			},
			{
				id: TAB_TEXTS,
				title: t('common.texts'),
			},
		];

		[currentTab.value] = tabs;

		const changeTab = (tab) => {
			currentTab.value = tab;
		};

		EventLogApi.logEvent({
			eventName: 'website_builder.password_setup.enter',
			isHostingerEvent: true,
		});

		return {
			TAB_TEXTS,
			TAB_DESIGN,
			homepageName,
			passwordErrorMessage,
			designOptions,
			isPasswordVisible,
			currentTab,
			changeTab,
			tabs,
		};
	},
});
</script>
<style lang="scss" scoped>
.password-settings {
	width: 355px;

	&__enable {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		margin-top: 16px;
		margin-bottom: 8px;
	}

	&__subtitle {
		margin-bottom: 20px;
		color: $color-gray;

		&--disabled {
			margin-bottom: 37px;
		}
	}

	&__checkbox {
		display: none;
	}

	&__visibility-change {
		cursor: pointer;
	}

	&__select-design {
		margin: 8px 0;
	}

	&__eye-icon {
		width: 20px;
		height: 20px;
	}

	&__design-option {
		position: relative;
		width: 100%;
		height: 200px;
		margin-bottom: 16px;
		cursor: pointer;
		border: 1px solid transparent;

		&--selected {
			border: none;
		}
	}

	&__design-option-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	&__design-image-wrap {
		width: 100%;
		height: 100%;
		overflow: hidden;
		border: 1px solid $color-gray-border;
		border-radius: 8px;

		&--selected {
			border: 2px solid $color-primary-dark;
		}
	}

	&__select-indicator {
		position: absolute;
		top: -12px;
		right: -12px;
		width: 24px;
		height: 24px;
		padding: 2px;
		color: white;
		background: $color-primary-dark;
		border: 3px solid $color-light;
		border-radius: 100px;
	}

	&__form {
		animation: expand 1s cubic-bezier(0.45, 0, 0.1, 1);
	}

	&__customize-tabs {
		margin-bottom: 16px;
	}

	&__customize-settings-container {
		animation: expand 0.5s cubic-bezier(0.45, 0, 0.1, 1);
	}

	&__back-text-suffix {
		padding: 14px 16px;
		font-size: 14px;
		color: $color-gray;
		background-color: $color-gray-light;
	}
}

@keyframes expand {
	0% {
		display: none;
		opacity: 0;
	}

	1% {
		display: block;
		opacity: 0;
		transform: translate(0, -1em);
	}

	100% {
		opacity: 1;
		transform: translate(0, 1);
	}
}
</style>
