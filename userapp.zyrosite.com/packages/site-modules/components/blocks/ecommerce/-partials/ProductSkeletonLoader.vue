<template>
	<div
		class="skeleton-loader"
		:style="computedStyles"
	>
		<div class="skeleton-loader__image" />
		<div
			class="skeleton-loader__wrapper"
			:class="{ 'skeleton-loader__wrapper--center': textAlign === 'center' }"
		>
			<div class="skeleton-loader__title skeleton-loader__text" />
			<div
				v-for="index in 10"
				:key="index"
				class="skeleton-loader__text"
			/>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		imageBorderRadius: {
			type: String,
			default: '0',
		},
		textAlign: {
			type: String,
			default: '',
		},
	},
	computed: {
		computedStyles() {
			return {
				'--image-border-radius': this.imageBorderRadius,
			};
		},
	},
};
</script>

<style lang="scss" scoped>
@import "@zyro-inc/site-modules/scss/mixins/site-engine-mobile";
@import "./shared";

.skeleton-loader {
	display: flex;
	justify-content: center;
	width: 100%;
	max-width: var(--content-width);
	margin: 0 auto;

	&__image {
		width: 100%;
		max-width: 600px;
		height: 100%;
		border-radius: var(--image-border-radius, 0);

		&::after {
			display: block;
			padding-bottom: 100%;
			content: "";
		}
	}

	&__text,
	&__image {
		@include skeleton-loader-animation;
	}

	&__wrapper {
		display: flex;
		flex-direction: column;
		justify-content: center;
		width: 100%;
		max-width: 624px;
		padding-left: 80px;

		&--center {
			align-items: center;
		}
	}

	&__text {
		width: 100%;
		height: 24px;
		margin-top: 8px;
		border-radius: 5px;

		&:nth-child(2) {
			width: 20%;
			margin-top: 16px;
		}

		&:nth-child(3) {
			width: 30%;
			height: 50px;
			margin: 32px 0 20px;
		}

		&:nth-child(4n+1) {
			width: 70%;
		}

		&:nth-child(3n+1) {
			width: 60%;
		}
	}

	&__title {
		width: 70%;
		height: 64px;
	}
}

@include site-engine-mobile {
	.skeleton-loader {
		flex-direction: column;
		width: 100%;

		&__wrapper {
			max-width: unset;
			padding: 32px 0 0;

			&--center {
				align-items: center;
			}
		}

		&__image {
			max-width: unset;
		}
	}
}
</style>
