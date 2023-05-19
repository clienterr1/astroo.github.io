<template>
	<div class="text-list">
		<ul class="text-list__items">
			<li
				v-for="(textItem, index) in textArray"
				:key="`ai-text-${index}`"
				class="text-list__item body-small body-small--light"
			>
				<p
					class="text-list__text"
					data-qa="aiwriter-generatedtext"
				>
					{{ textItem.text }}
				</p>
				<ZyroButton
					v-if="isEditingTextBoxElement"
					theme="plain"
					class="text-list__insert-button"
					data-qa="aiwriter-button-inserttext"
					@click="insertTextToTextBox(textItem.text, index)"
				>
					<template #icon-left>
						<Icon
							name="copy"
							dimensions="16px"
						/>
					</template>
					{{ lastInsertedTextIndex === index ? $t('common.inserted') : $t('common.insertText') }}
				</ZyroButton>
				<ZyroButton
					theme="plain"
					data-qa="aiwriter-button-copytext"
					@click="copyTextToClipboard(textItem.text, index)"
				>
					<template #icon-left>
						<Icon
							name="copy"
							dimensions="16px"
						/>
					</template>
					{{ lastCopiedTextIndex === index ? $t('common.copied') : $t('common.copyText') }}
				</ZyroButton>
			</li>
		</ul>
	</div>
</template>

<script>
import Icon from '@/components/global/Icon.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';

import { mapGetters } from 'vuex';

import EventLogApi from '@/api/EventLogApi';
import {
	TEXT_EDITOR_TAG_PARAGRAPH,
	TEXT_EDITOR_CLASS_BODY,
} from '@/constants';
import { useTextEditor } from '@/use/text-editor/useTextEditor';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		Icon,
		ZyroButton,
	},

	props: {
		textArray: {
			type: Array,
			default: () => [],
		},
	},

	setup() {
		const { insertHTMLToEnd } = useTextEditor();

		return {
			insertHTMLToEnd,
		};
	},

	data() {
		return {
			lastCopiedTextIndex: null,
			lastInsertedTextIndex: null,
		};
	},

	computed: {
		...mapGetters([
			'currentElement',
			'isEditingTextBoxElement',
		]),
	},

	methods: {
		copyTextToClipboard(text, index) {
			this.lastCopiedTextIndex = index;
			navigator.clipboard.writeText(text);

			EventLogApi.logEvent({
				eventName: 'ai.select-text',
				eventProperties: {
					text,
				},
			});
		},
		insertTextToTextBox(text, index) {
			const content = `<${TEXT_EDITOR_TAG_PARAGRAPH} class="${TEXT_EDITOR_CLASS_BODY}">${text}</${TEXT_EDITOR_TAG_PARAGRAPH}>`;

			this.insertHTMLToEnd(content);
			this.lastInsertedTextIndex = index;

			EventLogApi.logEvent({
				eventName: 'ai.select-text',
				eventProperties: {
					text,
				},
			});
		},
	},
});
</script>

<style lang="scss" scoped>
.text-list {
	display: flex;
	flex-direction: column;
	height: 100%;
	padding: 0 20px;

	&__text {
		margin-bottom: 30px;
	}

	&__items {
		height: 100%;
		list-style: none;
	}

	&__item {
		padding: 24px 0;
		text-transform: none;
		cursor: text;
		border-top: 1px solid $color-gray-border;

		&:hover {
			.text-list {
				&__button {
					margin-bottom: 0;
					opacity: 1;
				}
			}
		}
	}

	&__insert-button {
		margin-right: 15px;
	}
}
</style>
