<template>
	<div>
		<EditTextButton
			ref="editTextTypeButton"
			:is-square="false"
			:is-active="isEditTextTypeOpen"
			:tooltip-text="$t('builder.editText.textStyle')"
			@click="isEditTextTypeOpen = !isEditTextTypeOpen"
		>
			<div class="toggle">
				<div class="toggle__text">
					<p class="toggle__label">
						{{ $t('common.style') }}:
					</p>
					<p class="toggle__title">
						{{ currentTitle }}
					</p>
				</div>
				<ZyroSvgDeprecated
					class="toggle__icon"
					name="chevron"
					direction="down"
				/>
			</div>
		</EditTextButton>
		<Popup
			v-if="isEditTextTypeOpen"
			:target-ref="$refs.editTextTypeButton && $refs.editTextTypeButton.$el"
			placement="bottom-start"
			auto-update
			:offset="4"
			portal-selector="[data-portal='builder-preview']"
			@click-outside="isEditTextTypeOpen = false"
		>
			<div class="select">
				<div class="select__header">
					<div class="select__header-title">
						{{ $t('common.textStyles') }}:
					</div>
					<button
						class="select__header-edit"
						@click="openDrawer"
					>
						{{ $t('common.edit') }}
					</button>
				</div>
				<button
					v-for="level in TEXT_EDITOR_LEVELS_HEADING"
					:key="level"
					class="select__item select__item--bold z-body-small"
					:class="{ 'select__item--active': isHeadingLevelActive(level) }"
					@click="setHeadingLevel(level); isEditTextTypeOpen = false"
				>
					<strong>{{ $t('common.heading') }} {{ level }}</strong>
					<span class="select__item--size">{{ getFontSize(`h${level}`) }}</span>
				</button>
				<button
					v-for="({ type, level }) in TEXT_EDITOR_TEXT_TYPES_PARAGRAPH"
					:key="type"
					class="select__item z-body-small"
					:class="{ 'select__item--active': isParagraphClassActive(type) }"
					@click="setParagraphClass(type); isEditTextTypeOpen = false;"
				>
					<span>{{ $t('common.paragraph') }} {{ level }}</span>
					<span class="select__item--size">{{ getFontSize(type) }}</span>
				</button>
			</div>
		</Popup>
	</div>
</template>

<script>
import Popup from '@/components/global/Popup.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import {
	mapGetters,
	mapState,
} from 'vuex';

import {
	PROPERTY_FONT_SIZE,
	PROPERTY_M_FONT_SIZE,
} from '@zyro-inc/site-modules/constants/globalStyles';

import EditTextButton from '@/components/builder-controls/edit-text/EditTextButton.vue';

import {
	DRAWER_STYLES_TAB_ID_TYPOGRAPHY,
	TEXT_EDITOR_LEVELS_HEADING,
	TEXT_EDITOR_NODE_NAME_HEADING,
	TEXT_EDITOR_NODE_NAME_PARAGRAPH,
	TEXT_EDITOR_TEXT_TYPES_PARAGRAPH,
	DRAWER_USER_STYLES,

	USER_STYLES_SELECT_KEY_HEADING,
	USER_STYLES_SELECT_KEY_PARAGRAPH,
} from '@/constants';
import { useDrawerTabs } from '@/components/builder-drawers/drawers/use/useDrawerTabs';
import {
	CHANGE_DRAWER_PAGE,
	mapActionsGui,
	TOGGLE_DRAWER,
} from '@/store/builder/gui';
import { useTextEditor } from '@/use/text-editor/useTextEditor';
import { useTextTypePreviewCalculation } from '@/use/useTextTypePreviewCalculation';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		Popup,
		ZyroSvgDeprecated,
		EditTextButton,
	},

	setup(props, context) {
		const {
			editor,
			getInlineStyleValue,
		} = useTextEditor();
		const { changeCurrentTab } = useDrawerTabs();
		const { typographyPreviewSizes } = useTextTypePreviewCalculation(props, context);

		return {
			editor,
			getInlineStyleValue,
			changeCurrentTab,
			typographyPreviewSizes,
			TEXT_EDITOR_TEXT_TYPES_PARAGRAPH,
			TEXT_EDITOR_NODE_NAME_HEADING,
			TEXT_EDITOR_NODE_NAME_PARAGRAPH,
			TEXT_EDITOR_LEVELS_HEADING,
		};
	},

	data() {
		return {
			isEditTextTypeOpen: false,
		};
	},

	computed: {
		...mapState('gui', ['isMobileView']),
		...mapGetters(['siteStyles']),
		headingLevel() {
			return this.editor.getAttributes(TEXT_EDITOR_NODE_NAME_HEADING).level;
		},
		currentParagraphClass() {
			return this.editor.getAttributes(TEXT_EDITOR_NODE_NAME_PARAGRAPH).className;
		},
		currentParagraphLevel() {
			return TEXT_EDITOR_TEXT_TYPES_PARAGRAPH.find(({ type }) => type === this.currentParagraphClass)?.level ?? '3';
		},
		currentTitle() {
			if (this.getInlineStyleValue('fontSize')
				|| this.getInlineStyleValue('fontFamily')
				|| this.getInlineStyleValue('fontWeight')
			) {
				return this.$t('common.custom');
			}

			return this.editor.isActive(TEXT_EDITOR_NODE_NAME_HEADING)
				? `${this.$t('common.heading')} ${this.headingLevel}`
				: `${this.$t('common.paragraph')} ${this.currentParagraphLevel}`;
		},
		currentTypographyName() {
			const headingName = this.headingLevel ? `h${this.headingLevel}` : null;
			const paragraphName = this.editor.getAttributes(TEXT_EDITOR_NODE_NAME_PARAGRAPH).className;

			return headingName || paragraphName;
		},
		currentTypographyPageKey() {
			return this.editor.isActive(TEXT_EDITOR_NODE_NAME_HEADING)
				? USER_STYLES_SELECT_KEY_HEADING
				: USER_STYLES_SELECT_KEY_PARAGRAPH;
		},
	},

	methods: {
		...mapActionsGui({
			toggleDrawer: TOGGLE_DRAWER,
			changeDrawerPage: CHANGE_DRAWER_PAGE,
		}),
		getFontSize(typographyName) {
			const currentTypography = this.siteStyles[typographyName];
			const desktopFontSize = currentTypography[PROPERTY_FONT_SIZE];
			const mobileFontSize = currentTypography[PROPERTY_M_FONT_SIZE];

			return this.isMobileView ? (mobileFontSize || desktopFontSize) : desktopFontSize;
		},
		openDrawer() {
			this.toggleDrawer(DRAWER_USER_STYLES);
			this.changeCurrentTab({
				drawer: DRAWER_USER_STYLES,
				tabId: DRAWER_STYLES_TAB_ID_TYPOGRAPHY,
			});
			this.changeDrawerPage({
				drawerKey: DRAWER_USER_STYLES,
				pageKey: this.currentTypographyPageKey,
				options: {
					currentTypographyType: this.currentTypographyName,
				},
			});
		},
		isHeadingLevelActive(level) {
			return !this.editor.getAttributes('textStyle').fontSize && this.editor.isActive(TEXT_EDITOR_NODE_NAME_HEADING, {
				level,
			});
		},
		isParagraphClassActive(className) {
			return !this.editor.getAttributes('textStyle').fontSize && this.currentParagraphClass === className;
		},
		setHeadingLevel(level) {
			this.editor.chain()
				.selectParentNode()
				.unsetMarkFontSize()
				.unsetFontFamily()
				.unsetFontWeight()
				.setHeading({
					level,
				})
				.focus()
				.run();
		},
		setParagraphClass(className) {
			this.editor.chain()
				.selectParentNode()
				.unsetMarkFontSize()
				.unsetFontFamily()
				.unsetFontWeight()
				.setParagraph({
					className,
				})
				.focus()
				.run();
		},
	},
});
</script>

<style lang="scss" scoped>
@import "@zyro-inc/site-modules/scss/mixins/site-engine-mobile";

.select {
	display: flex;
	flex-direction: column;
	width: 208px;
	padding: 8px 0;
	overflow: hidden;
	background: $color-light;
	border-radius: $border-radius-small;
	box-shadow: $box-shadow;

	&__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 8px 16px;
	}

	&__header-title {
		font-size: 11px;
		line-height: 1.27;
		color: $color-gray;
		text-transform: uppercase;
	}

	&__header-edit {
		font-size: 13px;
		font-weight: 700;
		line-height: 1;
		color: $color-azure;
		cursor: pointer;
	}

	&__item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: 6px 16px;
		text-align: start;
		cursor: pointer;

		&--size {
			color: $color-gray;
		}

		&--active {
			background-color: $color-gray-light;
		}

		&:hover {
			background-color: $color-gray-light;
		}
	}

	&__item-size {
		color: $color-gray;
	}
}

.toggle {
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 104px;
	text-align: start;

	&__text {
		margin-right: 4px;
		overflow: hidden;
	}

	&__label {
		font-size: 12px;
		font-weight: 700;
		line-height: 1;
		color: $color-gray;
	}

	&__icon {
		flex-shrink: 0;
	}

	&__title {
		overflow: hidden;
		line-height: 1;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
}

@include site-engine-mobile {
	.toggle {
		width: 150px;
		padding-right: 0;
	}
}
</style>
