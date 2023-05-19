<template>
	<div class="empty-block__wrapper">
		<div class="empty-block">
			<p class="empty-block__title z-body-small z-body-small--strong">
				{{ $t('builder.emptyBlockWarning.textStrong') }}
			</p>
			<!-- eslint-disable-next-line vue/component-name-in-template-casing -->
			<i18n-t
				keypath="builder.emptyBlockWarning.subtitle"
				tag="p"
				class="z-body-small"
			>
				<EmptyBlockWarningSubtitle />
			</i18n-t>
		</div>
	</div>
</template>

<script>
import EmptyBlockWarningSubtitle from '@/components/block-grid/EmptyBlockWarningSubtitle.vue';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		EmptyBlockWarningSubtitle,
	},
});
</script>

<style lang="scss" scoped>
.empty-block {
	z-index: -1;
	display: flex;
	flex-direction: column;
	place-content: center;
	place-items: center;
	height: 100%;
	border: 1px dashed $color-gray;

	&__title {
		margin-bottom: 8px;
	}

	&__wrapper {
		grid-row: 1 / 9;
		grid-column: 2/-2;
		padding: 72px 0;
	}

	&--inactive {
		opacity: 0;
	}
}
</style>
