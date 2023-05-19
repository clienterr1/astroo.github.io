<template>
	<div class="page-drawer-header">
		<ZyroSvgDeprecated
			class="page-drawer-header__back-button"
			name="wizard-arrow-left"
			dimensions="24px"
			@click="$emit('go-back')"
		/>
		<p class="page-drawer-header__title">
			{{ $t('common.page') }}:
		</p>
		<ZyroSvgDeprecated
			class="page-drawer-header__icon"
			:name="isHomePage ? 'home' : 'feather-file'"
			dimensions="16px"
		/>
		<p class="page-drawer-header__page-name">
			{{ pageName }}
		</p>
	</div>
</template>

<script>
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';
import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroSvgDeprecated,
	},

	props: {
		pageName: {
			type: String,
			required: true,
		},
		isHomePage: {
			type: Boolean,
			required: true,
		},
	},

	emits: ['go-back'],
});
</script>

<style lang="scss" scoped>
.page-drawer-header {
	display: flex;
	align-items: center;
	margin-bottom: 16px;

	&__back-button {
		margin-right: 16px;
		color: $color-gray;
		cursor: pointer;
		transition: transform 0.2s ease-in-out;

		&:hover {
			transform: translateX(-4px);
		}
	}

	&__icon {
		color: $color-gray;
	}

	&__title {
		padding-left: 16px;
		margin-right: 8px;
		font-size: 14px;
		font-weight: 700;
		line-height: 1.71;
		border-left: 1px solid $color-gray-border;
	}

	&__page-name {
		flex: 1;
		margin-right: 8px;
		margin-left: 8px;
		overflow: hidden;
		font-size: 14px;
		font-weight: 400;
		line-height: 1.71;
		color: $color-gray;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
}
</style>
