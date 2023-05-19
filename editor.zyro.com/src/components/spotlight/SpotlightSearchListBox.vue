<template>
	<div
		class="search-list-box"
		role="listbox"
		aria-label="Suggestions"
	>
		<div v-if="hasResults && !isPageListShown">
			<div
				v-for="(category, categoryName) in searchResults"
				:key="categoryName"
				class="search-list-box__category"
			>
				<p class="search-list-box__category-title">
					{{ categoryNames[categoryName] }}
				</p>
				<div
					v-for="action in category"
					:key="action.id"
					role="option"
					class="search-list-box__item"
					:class="{ 'search-list-box__item--selected': action.id === selectedActionId }"
					@click="doSelectedAction(action)"
				>
					<ZyroSvgDeprecated
						:name="action.icon"
						class="search-list-box__item-icon"
					/>
					{{ action.title }}
				</div>
			</div>
		</div>
		<div v-else-if="isPageListShown">
			<div
				role="option"
				class="search-list-box__item search-list-box__item--back"
				:class="{ 'search-list-box__item--selected': selectedPageId === 'back' }"
				@click="closePageList"
			>
				<ZyroSvgDeprecated
					name="chevron-left"
					class="search-list-box__item-icon"
				/>
				{{ $t('common.back') }}
				<!-- ⌘ / Ctrl + Backspace - close page list -->
				<p class="search-list-box__shortcut-tooltip">
					{{ closePageListShortcutTooltip }}
				</p>
			</div>
			<p class="search-list-box__category-title">
				{{ $t(pageTypeName) }} :
			</p>
			<div
				v-for="(pageData, pageId) in searchPagesToShow"
				:key="pageId"
				class="search-list-box__category"
			>
				<div
					role="option"
					class="search-list-box__item"
					:class="{ 'search-list-box__item--selected': pageId === selectedPageId }"
					@click="openSelectedPage(pageId)"
				>
					<ZyroSvgDeprecated
						name="spotlight_find_in_page"
						class="search-list-box__item-icon"
					/>
					{{ pageData.name }}
				</div>
			</div>
		</div>
		<div
			v-else
			class="search-list-box__empty"
		>
			<p class="search-list-box__empty-title">
				{{ $t('common.searchNoResults') }}
			</p>
			<!-- eslint-disable-next-line vue/component-name-in-template-casing -->
			<i18n-t
				tag="p"
				class="z-body-small search-list-box__empty-message"
				keypath="common.searchSuggestion"
			>
				<a
					:v-qa="'knowledge-base-link'"
					:href="knowledgeBaseLink"
					target="_blank"
					rel="noopener"
				>
					{{ $t('common.knowledgeBase') }}
				</a>
			</i18n-t>
		</div>
	</div>
</template>
<script>
import {
	ref,
	watch,
	defineComponent,
} from 'vue';

import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';
import { useSpotlight } from '@/components/spotlight/useSpotlight';
import { categoryNames } from '@/components/spotlight/actionsList';
import { isHostingerBrand } from '@/utils/isHostingerBrand';
import { getIsUserUsingMac } from '@/utils/getIsUserUsingMac';

export default defineComponent({
	name: 'SpotlightSearchListBox',
	components: {
		ZyroSvgDeprecated,
	},
	setup() {
		const {
			hasResults,
			closeSearch,
			pageTypeName,
			closePageList,
			searchResults,
			selectedPageId,
			isPageListShown,
			selectedActionId,
			doSelectedAction,
			openSelectedPage,
			searchPagesToShow,
			setSearchResults,
			searchKeyword,
		} = useSpotlight();

		const scrollSelectedElement = () => {
			const selectedElement = document.querySelector('.search-list-box__item--selected');

			if (selectedElement) {
				selectedElement.scrollIntoView({
					behavior: 'smooth',
					block: 'center',
				});
			}
		};

		const closePageListShortcutTooltip = ref('');

		closePageListShortcutTooltip.value = getIsUserUsingMac()
			? '⌘ + Backspace'
			: 'Ctrl + Backspace';

		watch(selectedActionId, () => {
			scrollSelectedElement();
		});

		watch(selectedPageId, () => {
			scrollSelectedElement();
		});

		const knowledgeBaseLink = ref('');

		knowledgeBaseLink.value = isHostingerBrand
			? 'https://support.hostinger.com/en'
			: 'https://support.zyro.com/en';

		setSearchResults();

		watch(isPageListShown, () => setSearchResults());
		watch(searchKeyword, () => setSearchResults());

		return {
			closePageListShortcutTooltip,
			searchPagesToShow,
			knowledgeBaseLink,
			openSelectedPage,
			doSelectedAction,
			selectedActionId,
			isPageListShown,
			selectedPageId,
			categoryNames,
			searchResults,
			closePageList,
			pageTypeName,
			closeSearch,
			hasResults,
		};
	},
});
</script>
<style lang="scss" scoped>
.search-list-box {
	height: 393px;
	padding: 0 8px 40px;
	overflow: auto;
	overscroll-behavior: contain;
	background: $color-dark;
	border: 1px solid $color-gray;
	border-bottom-left-radius: 8px;
	transition: 0.1s ease;
	transition-property: height;
	-ms-scroll-chaining: none;
	scroll-padding-block-end: 40px;

	&__category {
		display: flex;
		flex-direction: column;
		transition: all 0.15s ease;
	}

	&__category-title {
		display: flex;
		align-items: center;
		height: 26px;
		padding: 8px 12px 4px;
		margin-top: 4px;
		font-size: 11px;
		color: $color-gray;
		text-transform: uppercase;
		cursor: default;
		user-select: none;
		transition-property: none;
		content-visibility: auto;
	}

	&__item {
		display: flex;
		align-items: center;
		height: 40px;
		padding: 8px 12px;
		font-size: 14px;
		color: $color-light;
		cursor: pointer;
		user-select: none;
		border-radius: 8px;
		transition: all 0.15s ease;
		transition-property: none;
		content-visibility: auto;
		will-change: background, color;

		&--selected,
		&:hover {
			color: $color-light;
			background: $color-gray-dark;
		}

		&--back {
			margin-top: 8px;
		}
	}

	&__item-icon {
		width: 20px;
		height: 20px;
		margin-right: 8px;
		color: $color-light;
	}

	&__empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		color: $color-light;
		cursor: default;
		user-select: none;
	}

	&__empty-title {
		margin-bottom: 8px;
		font-size: 14px;
		font-weight: 700;
		line-height: 24px;
		color: $color-gray;
	}

	&__empty-message {
		color: $color-gray;
	}

	&__shortcut-tooltip {
		margin-left: auto;
		color: $color-gray;
	}
}
</style>
