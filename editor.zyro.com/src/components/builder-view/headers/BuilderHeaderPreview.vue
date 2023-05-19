<template>
	<div
		class="builder-header builder-header--preview-mode"
		data-qa="builder-header-preview"
	>
		<ZyroButton
			data-qa="builder-preview-btn-backtoeditor"
			theme="header"
			color="white"
			@click="$emit('exit-preview')"
		>
			<template #icon-left>
				<Icon name="chevron_left" />
			</template>
			{{ $t('builder.headerPreview.backToEditor') }}
		</ZyroButton>

		<div class="builder-header__title">
			<slot name="title">
				<h3 class="z-subheading">
					{{ $t('builder.headerPreview.previewMode') }}
				</h3>
			</slot>
		</div>

		<div class="builder-header__last-item">
			<BuilderHeaderScreenToggleButton v-if="!isMobileScreen" />
			<BuilderHeaderPublishButton v-qa="`builder-preview-btn-publish`" />
		</div>
	</div>
</template>

<script>
import Icon from '@/components/global/Icon.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';

import { mapState } from 'vuex';

import BuilderHeaderPublishButton from '@/components/builder-view/headers/buttons/BuilderHeaderPublishButton.vue';
import BuilderHeaderScreenToggleButton from '@/components/builder-view/headers/buttons/BuilderHeaderScreenToggleButton.vue';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		Icon,
		ZyroButton,
		BuilderHeaderScreenToggleButton,
		BuilderHeaderPublishButton,
	},

	computed: {
		...mapState('gui', ['isMobileScreen']),
	},
});
</script>

<style lang="scss" scoped>
@import "./BuilderHeader";
</style>
