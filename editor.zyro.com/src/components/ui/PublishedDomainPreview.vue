<template>
	<div class="domain-preview">
		<ZyroSvgDeprecated
			class="domain-preview__bg-arrow-left"
			name="arrow"
			direction="left"
		/>
		<ZyroSvgDeprecated
			class="domain-preview__bg-arrow-right"
			name="arrow"
			direction="right"
		/>
		<ZyroSvgDeprecated
			class="domain-preview__bg-arrow-rotate"
			name="rotate-cw"
		/>
		<div
			class="domain-input"
			@click="handleClick"
		>
			<ZyroSvgDeprecated
				class="domain-input__lock"
				name="lock"
			/>
			<label
				class="domain-input__label no-select"
				for="domain"
			>
				https://
			</label>
			<p
				id="domain"
				data-qa="builder-publishmodal-inputfield-freedomain"
				class="z-body-small no-select"
				data-hj-whitelist
			>
				{{ domainToShow }}
			</p>
			<p
				v-if="!hideSubdomain"
				class="z-body-small no-select"
			>
				{{ previewSubdomain }}
			</p>
		</div>
		<ZyroButton
			theme="primary"
			size="xs"
			class="domain-preview__button z-button-small"
			data-qa="builder-publishmodal-btn-viewyoursite"
			@click="$emit('open-site')"
		>
			{{ $t('common.viewWebsite') }}
		</ZyroButton>
	</div>
</template>

<script>
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';
import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroButton,
		ZyroSvgDeprecated,
	},
	props: {
		domainToShow: {
			type: String,
			required: true,
		},
		previewSubdomain: {
			type: String,
			required: true,
		},
		hideSubdomain: {
			type: Boolean,
		},
	},
	emits: ['open-site'],
	methods: {
		handleClick() {
			if (this.hideSubdomain) {
				navigator.clipboard.writeText(`https://${this.domainToShow}`);
			} else {
				navigator.clipboard.writeText(`https://${this.domainToShow}${this.previewSubdomain}`);
			}
		},
	},
});
</script>
<style lang="scss" scoped>
.domain-preview {
	position: relative;
	display: flex;
	align-items: center;
	padding: 8px 8px 8px 16px;
	background: $color-gray-light;
	border-radius: 50px;
	transition: all 0.2s;

	&__bg-arrow-left {
		width: 16px;
		height: 16px;
		margin-right: 8px;
	}

	&__bg-arrow-right {
		width: 16px;
		height: 16px;
		margin-right: 8px;
		color: $color-gray;
	}

	&__bg-arrow-rotate {
		width: 16px;
		height: 16px;
		margin-right: 16px;
	}

	&__button {
		padding: 10px 24px;
		border: none;

		@media screen and (max-width: $media-mobile) {
			margin: 0 auto;
		}
	}
}

.domain-input {
	display: flex;
	align-items: center;
	width: 381px;
	height: 36px;
	padding: 8px 16px;
	margin-right: auto;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	cursor: copy;
	background: $color-light;
	border: 1px solid $color-gray-border;
	border-radius: 50px;
	transition: all 0.3s ease;

	&:hover {
		background: $color-gray-light;
	}

	&__lock {
		width: 16px;
		height: 16px;
		margin-right: 8px;
		color: $color-success-dark;
	}

	&__label {
		font-size: 14px;
		font-style: normal;
		font-weight: normal;
		font-stretch: normal;
		line-height: 1.43;
		color: $color-gray;
		cursor: copy;
	}
}

@media screen and (max-width: $media-mobile) {
	.domain-preview .domain-input {
		position: static;
		width: 100%;
		height: auto;
		padding: 10px;
		margin-right: 10px;
		background: $color-gray-light;
		border-radius: 0;
	}
}

.no-select {
	user-select: none;
}
</style>
