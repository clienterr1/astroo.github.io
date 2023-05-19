<template>
	<div class="form-card">
		<h3 class="z-body z-font-weight-bold form-card__title">
			<span class="form-card__form-name">
				{{ formId }}
			</span>
			<ZyroSvgDeprecated
				name="bullet-point"
				class="form-card__title-bullet-point"
			/>
			<span class="form-card__submission-count"> {{ entryCount }} {{ $t('common.submissions') }}</span>
		</h3>

		<i18n-t
			tag="p"
			class="z-body form-card__form-name"
			keypath="siteSettings.forms.cardDescription"
		>
			{{ formId }}
		</i18n-t>
		<ZyroButton
			v-qa="`sitesettings-${formId}-btn-viewlist`"
			theme="outline"
			class="form-card__button"
			@click="$emit('update', formId)"
		>
			{{ $t('siteSettings.forms.viewList') }}
		</ZyroButton>
	</div>
</template>

<script>
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroButton,
		ZyroSvgDeprecated,
	},

	props: {
		formId: {
			type: String,
			required: true,
		},
		entryCount: {
			type: Number,
			required: true,
		},
		activeFormId: {
			type: String,
			default: null,
		},
	},
});
</script>

<style lang="scss" scoped>
.form-card {
	flex: 0 0 60%;
	padding: 24px 32px;
	margin-bottom: 16px;
	background: $color-light;

	@media screen and (max-width: $media-mobile) {
		padding: 16px;
		margin-bottom: 8px;
	}

	&__form-name {
		word-break: break-all;
	}

	&__title {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		margin-bottom: 24px;

		&-bullet-point {
			margin: 0 7px 0 10px;
			flex-shrink: 0;
		}
	}

	&__submission-count {
		color: $color-gray;
		white-space: nowrap;
	}

	&__button {
		display: block;
		margin-top: 28px;
		margin-left: auto;
	}
}
</style>
