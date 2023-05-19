<template>
	<div class="empty-page">
		<h4 class="empty-page__title">
			{{ $t('builder.emptyPage.title') }}
		</h4>
		<i18n-t
			keypath="builder.emptyPage.subtitle"
			tag="p"
			class="z-body-small"
		>
			<BuilderEmptyPageSubtitle />
		</i18n-t>
		<AddBlockButton />
	</div>
</template>

<script>
import AddBlockButton from '@/components/builder-controls/control-line/AddBlockButton.vue';
import BuilderEmptyPageSubtitle from '@/components/builder-view/components/BuilderEmptyPageSubtitle.vue';
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'BuilderEmptyPage',

	components: {
		AddBlockButton,
		BuilderEmptyPageSubtitle,
	},
});
</script>

<style lang="scss" scoped>
.empty-page {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 150px 0;

	&__title {
		margin-bottom: 8px;
	}

	&__description {
		margin-bottom: 24px;
	}
}
</style>
