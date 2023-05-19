<template>
	<ZyroModal
		:max-width="modalMaxWidth"
		:max-height="modalMaxHeight"
		:is-loading="!template"
		class="modal-add-content"
		:title="title"
		:subtitle="subtitle"
		position="bottom"
		@close-modal="closeModal"
	>
		<div class="modal-add-content__container">
			<ZyroCollapsible
				v-if="isMobileScreen"
				:is-open="isCollapsibleOpen"
				class="modal-add-content__collapsible"
				@toggle="isCollapsibleOpen = !isCollapsibleOpen"
			>
				<template #heading>
					<h3 class="z-h4">
						{{ $t('builder.expandMobileSectionList') }}
					</h3>
				</template>
				<template #content>
					<CategoriesList
						:categories="categories"
						:current-category-id="currentCategoryId"
						:add-blank-content-button-title="addBlankContentButtonTitle"
						@add-blank-section="$emit('add-blank-content', {})"
						@update:current-category-id="handleCurrentCategoryIdUpdate({ categoryId: $event })"
					/>
				</template>
			</ZyroCollapsible>
			<CategoriesList
				v-else
				:categories="categories"
				:current-category-id="currentCategoryId"
				:add-blank-content-button-title="addBlankContentButtonTitle"
				@update:current-category-id="handleCurrentCategoryIdUpdate({ categoryId: $event })"
				@add-blank-section="$emit('add-blank-content')"
			/>
			<div class="modal-add-content__content-list">
				<!-- Measure modal inner width, for preview blocks/pages width calculation -->
				<div
					ref="measureModalWidth"
					class="measure-modal-width"
				/>
				<div
					v-if="template"
					class="modal-add-content__items"
					:style="computedStyles"
				>
					<div
						v-for="(content, contentId) in selectedCategoryContent"
						:key="`${contentId}-item`"
					>
						<div
							v-if="contentDescriptions && contentDescriptions[contentId]"
							class="modal-add-content__item-description"
						>
							<p class="modal-add-content__item-title">
								{{ contentDescriptions[contentId].title }}
							</p>
							<p class="modal-add-content__item-text">
								{{ contentDescriptions[contentId].text }}
							</p>
						</div>
						<ZyroContentPreview
							v-qa="`builder-addnewcontentmodal-${contentId}`"
							:block-id="contentId"
							:blocks="Array.isArray(content) ? content : [content]"
							:site-elements="siteElements"
							:site-blocks="template.languages.system.blocks"
							:actual-item-width="actualItemWidth"
							:preview-item-width="previewItemWidth"
							class="modal-add-content__item-container"
							@click="$emit('add-content', {
								contentId,
								content
							})"
						/>
					</div>
				</div>
			</div>
		</div>
	</ZyroModal>
</template>

<script setup>
import ZyroContentPreview from '@/components/global/ZyroContentPreview.vue';
import ZyroModal from '@/components/global/ZyroModal.vue';

import gsap from 'gsap';
import {
	watch,
	nextTick,
	ref,
	computed,
	onMounted,
	toRefs,
} from 'vue';
import { useStore } from 'vuex';

import CategoriesList from '@/components/builder-modals/modals/add-content-modal/CategoriesList.vue';
import ZyroCollapsible from '@/components/site-settings/components/ZyroCollapsible.vue';
import { CLOSE_MODAL } from '@/store/builder/gui';
import {
	ADD_CONTENT_MODAL_MASONRY_GUTTER_DESKTOP,
	ADD_CONTENT_MODAL_MASONRY_GUTTER_MOBILE,
	ADD_CONTENT_MODAL_MASONRY_COLUMN_COUNT_DESKTOP,
	ADD_CONTENT_MODAL_MASONRY_COLUMN_COUNT_MOBILE,
} from '@/constants';

const {
	state,
	dispatch,
} = useStore();

const props = defineProps({
	template: {
		type: Object,
		required: true,
	},
	categories: {
		type: Object,
		required: true,
	},
	currentCategoryId: {
		type: String,
		required: true,
	},
	selectedCategoryContent: {
		type: Object,
		required: true,
	},
	siteElements: {
		type: Object,
		required: true,
	},
	title: {
		type: String,
		required: true,
	},
	subtitle: {
		type: String,
		required: true,
	},
	addBlankContentButtonTitle: {
		type: String,
		required: true,
	},
	contentDescriptions: {
		type: Object,
		default: () => {},
	},
	computedStyles: {
		type: Object,
		default: () => {},
	},
});

const emit = defineEmits(['update:current-category-id']);

const { selectedCategoryContent } = toRefs(props);

const measureModalWidth = ref(null);
const previewItemWidth = ref(0);
const actualItemWidth = ref(0);
const isCollapsibleOpen = ref(true);

const isMobileScreen = computed(() => state.gui.isMobileScreen);
const modalMaxWidth = computed(() => (isMobileScreen.value ? '100%' : '75vw'));
const modalMaxHeight = computed(() => (isMobileScreen.value ? '100%' : '80vh'));

const closeModal = () => {
	dispatch(`gui/${CLOSE_MODAL}`);
};

const setAnimationToPreviewItems = async () => {
	gsap.from('.modal-add-content__item-container', {
		duration: 0.15,
		delay: 0.1,
		y: 150,
		ease: 'power1',
		stagger: 0.03,
		clearProps: 'transform',
	});
	gsap.to('.modal-add-content__item-container', {
		opacity: 1,
		delay: 0.15,
		duration: 0.1,
	});
};

const handleCurrentCategoryIdUpdate = ({ categoryId }) => {
	isCollapsibleOpen.value = false;

	emit('update:current-category-id', categoryId);
};

watch(selectedCategoryContent, async (newValue) => {
	if (!newValue) {
		return;
	}

	await nextTick();

	setAnimationToPreviewItems();
});

onMounted(() => {
	const addContentModalMasonryGutter = isMobileScreen.value
		? ADD_CONTENT_MODAL_MASONRY_GUTTER_MOBILE
		: ADD_CONTENT_MODAL_MASONRY_GUTTER_DESKTOP;

	const addContentModalMasonryColumnCount = isMobileScreen.value
		? ADD_CONTENT_MODAL_MASONRY_COLUMN_COUNT_MOBILE
		: ADD_CONTENT_MODAL_MASONRY_COLUMN_COUNT_DESKTOP;

	previewItemWidth.value = (
		measureModalWidth.value.offsetWidth / addContentModalMasonryColumnCount
		- addContentModalMasonryGutter / addContentModalMasonryColumnCount
	);
	actualItemWidth.value = window.innerWidth;

	setAnimationToPreviewItems();
});

</script>

<style lang="scss" scoped>
/*
 * Outline is invisible on the left side due to overflow,
 * even with overflow-x set to visible;
 * add padding-left and negative margin-left
 * to container to offset that
*/

$hover-outline-width: 1px;

.modal-add-content {
	&__container {
		display: grid;
		grid-template-columns: 25% 75%;
		grid-gap: 16px;
		height: 100%;

		@media screen and (max-width: $media-mobile) {
			display: block;
			overflow: auto;
		}
	}

	&__content-list {
		height: 100%;
		padding-left: $hover-outline-width;
		margin-left: -$hover-outline-width;
		overflow: auto;

		@media screen and (max-width: $media-mobile) {
			overflow: visible;
		}
	}

	&__items {
		columns: 2 auto;
		column-gap: 20px;
		padding-top: 60px;

		@media screen and (max-width: $media-mobile) {
			columns: 1 auto;
			padding-top: 0;
		}
	}

	&__item-description {
		display: flex;
		flex-direction: column;
	}

	&__item-title {
		margin-bottom: 4px;
		font-size: 20px;
		font-weight: 500;
		line-height: 1.4;
	}

	&__item-text {
		margin-bottom: 20px;
		font-size: 14px;
		font-weight: 400;
		line-height: 1.43;
		color: $color-gray;
	}

	&__item-container {
		width: 50%;
		margin-bottom: 20px;
		overflow: hidden;
		pointer-events: auto;
		outline: 2px solid transparent;
		box-shadow: 0 3px 8px rgb(0 0 0 / 5%);
		opacity: 0; // opacity is animated with gsap
		transition: all 0.2s;

		@media screen and (max-width: $media-mobile) {
			border: 1px solid $color-gray-light;
		}

		&:hover {
			cursor: pointer;
			outline: $hover-outline-width solid $color-gray-border;
			transform: translateY(-4px);
		}
	}

	&__collapsible {
		:deep() {
			.collapsible {
				&__header {
					border: 1px solid $color-primary-light;
					border-radius: $border-radius-small;
				}

				&__main {
					padding: 0;
				}
			}
		}
	}

	@media screen and (max-width: $media-mobile) {
		display: block;

		:deep() {
			.modal {
				&__content {
					overflow: hidden;
				}
			}
		}
	}
}

.measure-modal-width {
	width: 100%;
}
</style>
