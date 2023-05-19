<template>
	<Component
		:is="currentEditor"
		:start-tab-id="startTabId"
		:starting-popup-component="startingPopupComponent"
		:use-color-picker-v2="isEcommerceSection"
		class="edit-block-popup"
		@close="$emit('close')"
	/>
</template>

<script>
import { mapGetters } from 'vuex';

import {
	getCode,
	CODE,
} from '@zyro-inc/site-modules/utils/getCode';
import { getMapValue } from '@zyro-inc/site-modules/utils/object';

import EditBlockBlogHeaderTabs from '@/components/builder-controls/edit-block-blog-header/EditBlockBlogHeaderTabs.vue';
import EditBlockBlogListTabs from '@/components/builder-controls/edit-block-blog-list/EditBlockBlogListTabs.vue';
import EditBlockEcommerceProductListTabs from '@/components/builder-controls/edit-block-ecommerce-product-list/EditBlockTabsEcommerceProductList.vue';
import EditBlockEcommerceProductTabs from '@/components/builder-controls/edit-block-ecommerce-product/EditBlockTabsEcommerceProduct.vue';
import EditBlockEcwidStoreTabs from '@/components/builder-controls/edit-block-ecwid-store/EditBlockEcwidStoreTabs.vue';
import EditBlockLayoutTabs from '@/components/builder-controls/edit-block-layout/EditBlockLayoutTabs.vue';
import EditBlockNavigationTabs from '@/components/builder-controls/edit-block-navigation/EditBlockNavigationTabs.vue';
import EditBlockSlideshow from '@/components/builder-controls/edit-block-slideshow/EditBlockSlideshow.vue';
import EditBlockImageSlideshow from '@/components/builder-controls/edit-block-image-slideshow/EditBlockImageSlideshow.vue';
import EditBlockTabs from '@/components/builder-controls/edit-block/EditBlockTabs.vue';

import { defineComponent } from 'vue';

const editorTypes = {
	BlockNavigation: 'EditBlockNavigationTabs',
	BlockSlideshow: 'EditBlockSlideshow',
	BlockImageSlideshow: 'EditBlockImageSlideshow',
	BlockBlogList: 'EditBlockBlogListTabs',
	BlockBlogHeader: 'EditBlockBlogHeaderTabs',
	BlockEcwidStore: 'EditBlockEcwidStoreTabs',
	BlockEcommerceProduct: 'EditBlockEcommerceProductTabs',
	BlockEcommerceProductList: 'EditBlockEcommerceProductListTabs',
	BlockLayout: 'EditBlockLayoutTabs',
	default: 'EditBlockTabs',
};

export default defineComponent({

	components: {
		EditBlockTabs,
		EditBlockNavigationTabs,
		EditBlockBlogListTabs,
		EditBlockBlogHeaderTabs,
		EditBlockEcwidStoreTabs,
		EditBlockEcommerceProductTabs,
		EditBlockEcommerceProductListTabs,
		EditBlockSlideshow,
		EditBlockImageSlideshow,
		EditBlockLayoutTabs,
	},

	props: {
		startTabId: {
			type: String,
			default: '',
		},
		startingPopupComponent: {
			type: String,
			default: null,
		},
	},
	emits: ['close'],

	computed: {
		...mapGetters(['currentBlockType']),
		currentEditor() {
			return getMapValue(this.currentBlockType, editorTypes);
		},
		isEcommerceSection() {
			return [
				'BlockEcommerceProduct',
				'BlockEcommerceProductList',
			].includes(this.currentBlockType);
		},
	},

	created() {
		window.addEventListener('keydown', this.onEscapeClick);
	},

	beforeUnmount() {
		window.removeEventListener('keydown', this.onEscapeClick);
	},

	methods: {
		onEscapeClick(event) {
			if (getCode(event) === CODE.Escape) {
				this.$emit('close');
			}
		},
	},
});
</script>
