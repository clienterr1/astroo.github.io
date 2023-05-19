<template>
	<ZyroDrawer data-qa="builder-sidebar-aiwriter">
		<div
			ref="aiWriter"
			class="ai-writer"
		>
			<div class="ai-writer__header">
				<div class="ai-writer__title z-h5">
					{{ $t('builder.AIWriter.title') }}
				</div>
				<p
					v-show="currentlyChoosing"
					class="ai-writer__description z-body-small"
				>
					{{ $t('builder.AIWriter.description') }}
				</p>
			</div>
			<div class="ai-writer__content">
				<AiWriterChoice
					:currently-choosing="currentlyChoosing"
					@on-content-update="scrollToAction"
					@toggle-choosing="currentlyChoosing = !currentlyChoosing"
					@generate-text="generateText"
				/>
				<div
					v-if="loading"
					class="loader-wrapper"
				>
					<ZyroLoader />
				</div>
				<AiWriterList
					v-else-if="!currentlyChoosing"
					:text-array="textArray"
				/>
			</div>
		</div>
	</ZyroDrawer>
</template>

<script>
import ZyroDrawer from '@/components/global/ZyroDrawer.vue';

import { captureException } from '@sentry/browser';

import ZyroLoader from '@zyro-inc/site-modules/components/ZyroLoader.vue';

import { getTexts } from '@/api/AiApi';
import AiWriterChoice from '@/components/builder-controls/ai-writer/AiWriterChoice.vue';
import AiWriterList from '@/components/builder-controls/ai-writer/AiWriterList.vue';
import {
	mapActionsNotifications,
	NOTIFY,
} from '@/store/builder/notifications';

import { defineComponent } from 'vue';

export const AI_WRITER = 'AiWriter';

export default defineComponent({
	components: {
		ZyroDrawer,
		ZyroLoader,
		AiWriterChoice,
		AiWriterList,
	},

	data() {
		return {
			currentlyChoosing: true,
			loading: false,
			textArray: [],
		};
	},

	methods: {
		...mapActionsNotifications({
			notify: NOTIFY,
		}),
		async generateText(options) {
			try {
				if (!options) {
					return;
				}

				this.loading = true;
				const { data } = await getTexts(options);

				this.currentlyChoosing = false;
				this.textArray = data;
			} catch (error) {
				this.notify({
					messageI18nKeyPath: 'builder.errorWhileGeneratingText',
					origin: 'AiWriter',
				});

				captureException(error);
			} finally {
				setTimeout(() => {
					this.loading = false;
				}, Math.random() * 1000 + 500);
			}
		},
		async scrollToAction() {
			await this.$nextTick();

			const { aiWriter } = this.$refs;

			aiWriter.scrollTop = aiWriter.scrollHeight - aiWriter.offsetHeight;
		},
	},
});
</script>

<style lang="scss" scoped>
.ai-writer {
	display: flex;
	flex-direction: column;
	height: 100%;
	padding-top: 24px;
	overflow-x: hidden;
	overflow-y: auto;
	scroll-behavior: smooth;

	&__header {
		position: relative;
		align-items: center;
		padding: 0 24px;
		margin-bottom: 16px;
	}

	&__title {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 8px;
	}

	&__description {
		color: $color-gray;
	}

	&__content {
		display: flex;
		flex-direction: column;
		flex-grow: 1;
		align-items: center;
	}
}

.loader-wrapper {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
}
</style>
