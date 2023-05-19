<template>
	<div>
		<EditTextButton
			ref="editTextMoreButton"
			is-rounded-right
			:is-active="isOpen"
			:tooltip-text="$t('builder.editText.moreOptions')"
			data-qa="textsettings-more-button"
			@click="isOpen = !isOpen"
		>
			<ZyroSvgDeprecated name="dots" />
		</EditTextButton>
		<Popup
			v-if="isOpen"
			:target-ref="$refs.editTextMoreButton && $refs.editTextMoreButton.$el"
			class="toolbar__group"
			placement="bottom-start"
			auto-update
			:offset="4"
			portal-selector="[data-portal='builder-preview']"
			@click-outside="closePopup"
		>
			<div class="more">
				<EditTextMoreLineHeight class="border-bottom" />
				<EditTextMoreBackground class="border-bottom" />
				<EditTextMoreAnimation />
				<EditTextMoreAlignment
					v-if="showEditTextJustifyOptions"
					class="border-bottom"
				/>
				<EditTextMoreTextGenerator
					v-if="!isDemoMode"
					class="border-bottom"
				/>
				<EditTextMoreFeedback />
			</div>
		</Popup>
	</div>
</template>

<script>
import Popup from '@/components/global/Popup.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import {
	mapState,
	mapGetters,
} from 'vuex';
import EditTextButton from '@/components/builder-controls/edit-text/EditTextButton.vue';

import EditTextMoreAlignment from '@/components/builder-controls/edit-text/EditTextMoreAlignment.vue';
import EditTextMoreBackground from '@/components/builder-controls/edit-text/EditTextMoreBackground.vue';
import EditTextMoreTextGenerator from '@/components/builder-controls/edit-text/EditTextMoreTextGenerator.vue';
import EditTextMoreFeedback from '@/components/builder-controls/edit-text/EditTextMoreFeedback.vue';
import EditTextMoreLineHeight from '@/components/builder-controls/edit-text/EditTextMoreLineHeight.vue';
import EditTextMoreAnimation from '@/components/builder-controls/edit-text/EditTextMoreAnimation.vue';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		Popup,
		ZyroSvgDeprecated,
		EditTextButton,
		EditTextMoreAlignment,
		EditTextMoreTextGenerator,
		EditTextMoreFeedback,
		EditTextMoreLineHeight,
		EditTextMoreBackground,
		EditTextMoreAnimation,
	},
	data() {
		return {
			isOpen: false,
		};
	},

	computed: {
		...mapState(['isDemoMode']),
		...mapGetters(['currentBlockType']),
		showEditTextJustifyOptions() {
			return this.currentBlockType !== 'BlockLayout';
		},
	},

	methods: {
		closePopup() {
			this.isOpen = false;
		},
	},
});
</script>

<style lang="scss" scoped>
.more {
	width: 252px;
	background: $color-light;
	border-radius: 5px;
	box-shadow: $box-shadow;
}

.border-bottom {
	border-bottom: 1px solid $color-gray-light;
}
</style>
