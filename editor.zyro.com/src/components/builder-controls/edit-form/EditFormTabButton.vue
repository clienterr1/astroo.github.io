<template>
	<div class="submit">
		<ZyroFieldInput
			:model-value="buttonText"
			:placeholder="$t('builder.editForm.submitButtonLabel')"
			:label="$t('builder.editForm.submitButtonLabel')"
			@update:model-value="updateButtonText"
		/>
		<ZyroLabel>
			{{ $t('builder.editForm.buttonPosition') }}
		</ZyroLabel>
		<ZyroIconControls
			:model-value="buttonAlign"
			:icons="$options.iconsAlign"
			@update:model-value="updateButtonAlign"
		/>
		<ZyroLabel class="submit__label">
			{{ $t('builder.editForm.submitActionLabel') }}
		</ZyroLabel>
		<ZyroSegmentControl
			class="submit__tabs-control"
			:controls="TABS"
			:active-control="currentTab"
			@update:active-control="changeCurrentTab"
		/>
		<template v-if="currentTab.id === SUBMIT_ACTIONS.SHOW_MESSAGE">
			<ZyroTextArea
				:model-value="successMessage"
				:placeholder="$t('builder.editForm.successMessagePlaceholder')"
				@update:model-value="updateSuccessMessage"
			/>
			<p class="editor-text z-body-small">
				{{ $t('builder.editForm.successMessageExplanation') }}
			</p>
		</template>
		<template v-else>
			<ZyroLabel class="submit__label">
				{{ $t('common.page') }}
			</ZyroLabel>
			<ZyroDropdown
				:model-value="selectedPageToLink"
				:options="pages"
				@update:model-value="updateSelectedPageToLink"
			/>
		</template>
	</div>
</template>

<script>
import ZyroDropdown from '@/components/global/ZyroDropdown.vue';
import ZyroFieldInput from '@/components/global/ZyroFieldInput.vue';
import ZyroIconControls from '@/components/global/ZyroIconControls.vue';
import ZyroLabel from '@/components/global/ZyroLabel.vue';
import ZyroSegmentControl from '@/components/global/ZyroSegmentControl.vue';
import ZyroTextArea from '@/components/global/ZyroTextArea.vue';

import {
	mapState,
	mapGetters,
	mapActions,
} from 'vuex';

import { SUBMIT_ACTIONS } from '@zyro-inc/site-modules/components/elements/form/constants';
import { capitalizeFirstLetter } from '@zyro-inc/site-modules/utils/modifyString';

import { useBuilderStyles } from '@/components/builder-controls/useBuilderStyles';
import { useI18n } from 'vue-i18n';

import { defineComponent } from 'vue';

const iconsAlign = [
	{
		value: 'start',
		icon: 'align',
		direction: 'left',
	},
	{
		value: 'center',
		icon: 'align-middle-h',
	},
	{
		value: 'end',
		icon: 'align',
		direction: 'right',
	},
];

export default defineComponent({
	components: {
		ZyroDropdown,
		ZyroFieldInput,
		ZyroIconControls,
		ZyroLabel,
		ZyroSegmentControl,
		ZyroTextArea,
	},

	setup() {
		const {
			getStyleValue,
			getStyleKey,
		} = useBuilderStyles();
		const { t } = useI18n();

		const TABS = [
			{
				id: SUBMIT_ACTIONS.SHOW_MESSAGE,
				title: t('builder.editForm.showMessage'),
			},
			{
				id: SUBMIT_ACTIONS.LINK_TO_PAGE,
				title: t('builder.editForm.linkToPage'),
			},
		];

		return {
			getStyleValue,
			getStyleKey,
			TABS,
			SUBMIT_ACTIONS,
		};
	},

	iconsAlign,

	data() {
		return {
			selectedPage: null,
		};
	},

	computed: {
		...mapState('gui', [
			'isMobileView',
			'isMobileScreen',
		]),
		...mapGetters([
			'currentElement',
			'currentElementSettings',
			'defaultPages',
		]),
		buttonText() {
			return this.currentElement.submitButtonData.content;
		},
		buttonAlign() {
			return this.getStyleValue('align', this.currentElement.submitButtonData.settings.styles);
		},
		successMessage() {
			if (this.currentElementSettings.successMessage) {
				return this.currentElementSettings.successMessage;
			}

			this.mergeCurrentElementData({
				elementData: {
					settings: {
						successMessage: 'Thank you!',
					},
				},
			});

			return '';
		},
		selectedPageToLink() {
			return this.currentElementSettings.submitRedirectPage || this.pages[0];
		},
		pages() {
			// TODO Needs refactoring as there must be a more elegant solution to tackle this.
			return Object.entries(this.defaultPages).map(([pageId, page]) => ({
				pageId,
				title: page.name
					|| capitalizeFirstLetter(page.slug)
					|| 'Home',
			}));
		},
		currentTab: {
			get() {
				const currentTab = this.currentElementSettings.submitAction || this.TABS[0];

				return this.TABS.find((tab) => tab.id === currentTab.id);
			},
			set(value) {
				this.mergeCurrentElementData({
					elementData: {
						settings: {
							submitAction: value,
						},
					},
				});
			},
		},
	},

	methods: {
		...mapActions(['mergeCurrentElementData']),
		changeCurrentTab(newTab) {
			if (newTab.id === SUBMIT_ACTIONS.LINK_TO_PAGE) {
				this.selectedPageToLink = this.currentElementSettings.submitRedirectPage || this.pages[0];

				if (!this.currentElementSettings.submitRedirectPage) {
					this.updateSelectedPageToLink(this.pages[0]);
				}
			}

			this.currentTab = newTab;
		},
		updateButtonText(newValue) {
			this.mergeCurrentElementData({
				elementData: {
					submitButtonData: {
						content: newValue,
					},
				},
			});
		},
		updateButtonAlign(newValue) {
			const key = this.getStyleKey('align');

			this.mergeCurrentElementData({
				elementData: {
					submitButtonData: {
						settings: {
							styles: {
								[key]: newValue,
							},
						},
					},
				},
			});
		},
		updateSuccessMessage(newValue) {
			this.mergeCurrentElementData({
				elementData: {
					settings: {
						successMessage: newValue,
					},
				},
			});
		},
		updateSelectedPageToLink(value) {
			this.mergeCurrentElementData({
				elementData: {
					settings: {
						submitRedirectPage: value,
					},
				},
			});
		},
	},
});
</script>

<style lang="scss" scoped>
.submit {
	&__tabs-control {
		margin-bottom: 18px;
	}

	&__label {
		margin-bottom: 6px;
	}
}

:deep(.submit) {
	.editor-text {
		+ .zyro-field-text {
			margin-top: 20px;
		}
	}

	.separator {
		margin: 16px auto;
	}

	.zyro-field-text + .zyro-field-toggle {
		margin-top: 32px;
	}

	.zyro-field-toggle + .editor-text {
		margin-top: 8px;
	}
}

.text {
	&--gray {
		color: $color-gray;
	}
}
</style>
