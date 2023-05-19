<template>
	<div>
		<BaseEditControls
			:button-title="$t('common.enterCode')"
			class="edit-embed"
		>
			<ZyroPopupCard
				type="editor"
				show-footer
				:title="$t('common.embedCode')"
				:save-btn-title="$t('common.embedCode')"
				max-width="560px"
				editor-popup-width="560px"
				@close="closeEditEmbed"
				@save="setEmbedContent"
			>
				<ZyroLabel class="edit-embed__input-label">
					{{ $t('builder.editEmbed.addYourCodeHere') }}
				</ZyroLabel>
				<ZyroCodeEditor v-model="embedContentValue" />
				<NpsRateFeature
					:feature-name="$t('builder.npsRateEmbed')"
					:type="NPS_TYPE_FEATURE_EMBED_CODE"
				/>
			</ZyroPopupCard>
		</BaseEditControls>
	</div>
</template>
<script>
import ZyroLabel from '@/components/global/ZyroLabel.vue';
import ZyroPopupCard from '@/components/global/ZyroPopupCard.vue';

import {
	mapGetters,
	mapActions,
} from 'vuex';

import BaseEditControls from '@/components/builder-controls/BaseEditControls.vue';
import ZyroCodeEditor from '@/components/reusable-components/ZyroCodeEditor.vue';
import NpsRateFeature from '@/components/ui/NpsRateFeature.vue';
import { NPS_TYPE_FEATURE_EMBED_CODE } from '@/constants';

import { defineComponent } from 'vue';

const DANGEROUS_EMBED_KEYWORDS = ['WebAssembly'];

export default defineComponent({

	components: {
		ZyroLabel,
		ZyroPopupCard,
		ZyroCodeEditor,
		BaseEditControls,
		NpsRateFeature,
	},
	emits: ['close'],

	setup() {
		return {
			NPS_TYPE_FEATURE_EMBED_CODE,
		};
	},

	data() {
		return {
			embedContentValue: null,
		};
	},

	computed: {
		...mapGetters(['currentElementContent']),
	},

	created() {
		this.embedContentValue = this.currentElementContent;
	},

	methods: {
		...mapActions(['mergeCurrentElementData']),
		setEmbedContent() {
			if (!this.isEmbedContentAllowed(this.embedContentValue)) {
				this.closeEditEmbed();

				return;
			}

			this.mergeCurrentElementData({
				elementData: {
					content: this.embedContentValue,
				},
			});

			this.closeEditEmbed();
		},
		closeEditEmbed() {
			this.$emit('close');
		},
		isEmbedContentAllowed(contentValue) {
			return !this.hasDangerousKeywords(contentValue);
		},
		hasDangerousKeywords(embedValue) {
			return DANGEROUS_EMBED_KEYWORDS.some((keyword) => embedValue.includes(keyword));
		},
	},
});
</script>
<style lang="scss" scoped>
.edit-embed {
	&__input-label {
		margin-bottom: 6px;
	}
}
</style>
