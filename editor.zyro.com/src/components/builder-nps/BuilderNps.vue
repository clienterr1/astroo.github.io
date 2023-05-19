<template>
	<div class="feedback">
		<div class="feedback__content-wrapper">
			<div class="feedback__content">
				<div v-if="currentStep === RATE_STEP">
					<p
						class="feedback__text"
						data-qa="feature-nps-modal-text"
					>
						{{ ratingQuestion }}
					</p>
					<ul class="feedback__rate-wrapper">
						<li
							v-for="item in icons"
							:key="item.id"
							class="feedback__item"
						>
							<input
								:id="item.id"
								class="feedback__checkbox"
								type="radio"
								name="feedback"
								:value="item.name"
							>
							<label
								v-qa="`feature-nps-modal-option-${item.id}`"
								:for="item.id"
								class="feedback__selection"
								@click="selectSmileRating(item)"
							>
								<div class="feedback__icon-wrapper">
									<ZyroSvgDeprecated
										class="feedback__icon"
										:name="item.icon"
									/>
								</div>
								<p class="feedback__text-option">
									{{ item.name }}
								</p>
							</label>
						</li>
					</ul>
				</div>
				<div
					v-else-if="currentStep === COMMENT_STEP"
					class="feedback__form"
				>
					<div class="feedback__text-wrapper">
						<p class="feedback__opinion z-body-small">
							{{ $t('builder.nps.yourRating') }}
						</p>
						<ZyroSvgDeprecated
							class="feedback__selected-icon"
							:name="selectedItem.icon"
						/>
						<p class="feedback__selected-opinion z-body-small">
							{{ selectedItem.name }}
						</p>
					</div>
					<div class="feedback__send-button-wrapper">
						<ZyroTextArea
							v-model="comment"
							theme="secondary"
							:placeholder="$t('builder.nps.commentPlaceholder')"
							maxlength="300"
							class="feedback__comment-textarea"
						/>

						<ZyroButton
							v-qa="'feature-nps-modal-button-submit'"
							theme="primary"
							class="feedback__send-button"
							@click="sendFeedback"
						>
							{{ $t('builder.nps.send') }}
						</ZyroButton>
					</div>
				</div>
				<div
					v-else-if="isReferAFriendShown"
					class="feedback__user-happy"
				>
					<p class="z-h5 feedback__user-happy-title">
						{{ $t('builder.nps.thankYouShort') }}
					</p>
					<p class="z-body feedback__user-happy-description">
						{{ $t('builder.nps.referAFriendAndEarn') }}
					</p>
					<ZyroButton
						class="feedback__user-happy-button"
						theme="primary"
						color="plump-purple"
						:href="dashboardLink"
						target="_blank"
						data-qa="nps-popup-refer-a-friend"
					>
						{{ $t('builder.nps.referAFriend') }}
					</ZyroButton>
					<ZyroSvgDeprecated
						class="feedback__user-happy-illustration"
						name="illustration-raised-glass"
					/>
				</div>
				<div
					v-else-if="currentStep === THANKS_STEP"
					class="feedback__like-block"
				>
					<div class="feedback__like-wrapper">
						<ZyroSvgDeprecated
							class="feedback__like-icon"
							name="like-blue"
						/>
						<p class="feedback__like-text">
							{{ $t('builder.nps.thankYou') }}
						</p>
					</div>
				</div>
				<button
					v-if="currentStep === COMMENT_STEP"
					class="feedback__back-button"
					@click="goBack"
				>
					<ZyroSvgDeprecated name="back-icon" />
				</button>
				<button
					v-if="!isCloseButtonHidden"
					class="feedback__button"
					@click="close"
				>
					<ZyroSvgDeprecated
						class="feedback__close-icon"
						name="x"
					/>
				</button>
			</div>
		</div>
	</div>
</template>

<script>
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { mapState } from 'vuex';

import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';
import ZyroTextArea from '@/components/global/ZyroTextArea.vue';
import { isHostingerBrand } from '@/utils/isHostingerBrand';

import { sendNpsScore } from '@/api/NpsApi';
import { getRedirectUrlToDashboard } from '@/use/useRedirects';

const RATE_STEP = 'score';
const COMMENT_STEP = 'comment';
const THANKS_STEP = 'thanks';
const THANKS_SECTION_TIMEOUT = 5000;
const USER_HAPPY_MIN_SCORE = 5;

export default defineComponent({
	components: {
		ZyroButton,
		ZyroSvgDeprecated,
		ZyroTextArea,
	},
	props: {
		isCloseButtonHidden: {
			type: Boolean,
			default: false,
		},
	},
	emits: [
		'close',
		'send-feedback',
	],

	setup() {
		const { t } = useI18n();
		const dashboardLink = getRedirectUrlToDashboard({
			params: {
				openGrowSurf: true,
			},
		});

		const icons = [
			{
				id: 'feedback-hate',
				name: t('builder.nps.ratingHate'),
				score: 1,
				icon: 'hate',
			},
			{
				id: 'feedback-dislike',
				name: t('builder.nps.ratingDislike'),
				score: 3,
				icon: 'dislike',
			},
			{
				id: 'feedback-neutral',
				name: t('builder.nps.ratingNeutral'),
				score: 5,
				icon: 'neutral',
			},
			{
				id: 'feedback-good',
				name: t('builder.nps.ratingLike'),
				score: 9,
				icon: 'good',
			},
			{
				id: 'feedback-love',
				name: t('builder.nps.ratingLove'),
				score: 10,
				icon: 'love',
			},
		];

		return {
			icons,
			RATE_STEP,
			COMMENT_STEP,
			THANKS_STEP,
			dashboardLink,
			isHostingerBrand,
		};
	},

	data() {
		return {
			currentStep: RATE_STEP,
			comment: '',
			score: null,
			selectedItem: null,
		};
	},

	computed: {
		...mapState([
			'websiteId',
			'isDemoMode',
		]),
		...mapState('nps', [
			'npsData',
			'question',
		]),
		isUserHappy() {
			return this.score > USER_HAPPY_MIN_SCORE;
		},

		ratingQuestion() {
			return this.question || this.$t('builder.nps.ratingQuestion');
		},
		isReferAFriendShown() {
			return this.currentStep === THANKS_STEP && !this.isHostingerBrand && this.isUserHappy && !this.isDemoMode;
		},
	},

	methods: {
		goBack() {
			this.currentStep = RATE_STEP;
			this.selectedItem = '';
		},

		selectSmileRating(selectItem) {
			this.score = selectItem.score;
			this.selectedItem = selectItem;
			this.currentStep = COMMENT_STEP;
		},

		async sendFeedback() {
			this.$emit('send-feedback', {
				score: this.score,
				comment: this.comment,
			});

			this.currentStep = THANKS_STEP;

			if (!this.isUserHappy) {
				setTimeout(this.close, THANKS_SECTION_TIMEOUT);
			}

			await sendNpsScore({
				score: this.score,
				comment: this.comment,
				formType: this.npsData.formType,
				siteId: this.websiteId,
				importedWebsiteUrl: this.npsData.importedWebsiteUrl,
			});
		},

		close() {
			this.$emit('close');
		},
	},
});
</script>

<style lang="scss" scoped>
.feedback {
	$this: &;

	position: relative;
	z-index: 100;
	display: flex;
	justify-content: left;
	min-width: 328px;
	padding: 0;
	overflow: hidden;
	color: $color-dark;
	border-radius: $border-radius-small;

	@media screen and (max-width: $media-mobile) {
		width: 100%;
		min-height: 180px;
		margin-left: 0;
	}

	&__content {
		width: 100%;

		@media screen and (max-width: $media-mobile) {
			width: 100%;
			padding: 0 16px;
		}
	}

	&__content-wrapper {
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		width: 100%;
		min-width: 328px;
		padding: 16px;
		background-color: $color-light;
		border-radius: $border-radius-small;
		box-shadow: 0 6px 14px rgba($color-dark, 0.1);

		@media screen and (max-width: $media-mobile) {
			width: 100%;
			padding: 0;
		}
	}

	&__user-happy-title {
		margin-bottom: 4px;
	}

	&__user-happy-description {
		padding-right: 48px;
	}

	&__user-happy {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		min-height: 200px;
		padding: 5px;
	}

	&__user-happy-button {
		margin-top: 24px;
	}

	&__user-happy-illustration {
		position: absolute;
		right: 0;
		bottom: 0;
	}

	&__rate-wrapper {
		display: flex;
		list-style-type: none;

		@media screen and (max-width: $media-mobile) {
			justify-content: center;
		}
	}

	&__item {
		&:not(:last-child) {
			margin-right: 16px;
		}
	}

	&__icon {
		width: 32px;
		height: 32px;
	}

	&__icon-wrapper {
		position: relative;
		width: 48px;
	}

	&__button {
		position: absolute;
		top: 13px;
		right: 13px;
		margin-left: 0.5rem;
		cursor: pointer;
		background: none;
		border: none;

		@media screen and (max-width: $media-mobile) {
			right: 30px;
		}
	}

	&__checkbox {
		display: none;
	}

	&__like-block {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 292px;
		min-height: 276px;
		margin: 0 auto;
		text-align: center;
	}

	&__like-icon {
		width: 48px;
		height: 48px;
	}

	&__like-text {
		margin-top: 25px;
		font-weight: 400;
		line-height: 20px;
	}

	&__close-icon {
		width: 24px;
		height: 24px;
	}

	&__text-area {
		margin-top: 26px;
		margin-bottom: 16px;
		font-size: 14px;
	}

	&__text-wrapper {
		display: flex;
		justify-content: center;
		margin: 16px 0 24px;
	}

	&__opinion {
		margin-right: 8px;
		margin-bottom: 0;
	}

	&__selected-icon {
		width: 20px;
		height: 20px;
		margin-right: 8px;
	}

	&__selected-opinion {
		margin-bottom: 0;
	}

	&__text {
		max-width: 232px;
		padding-top: 10px;
		margin: 0 auto 24px;
		font-weight: 400;
		text-align: center;

		@media screen and (max-width: $media-mobile) {
			padding-top: 24px;
		}
	}

	&__send-button {
		margin-right: auto;

		@media screen and (max-width: $media-mobile) {
			margin-bottom: 16px;
		}
	}

	&__send-button-wrapper {
		width: 100%;
		text-align: right;
	}

	&__comment-textarea {
		display: block;
		margin-bottom: 16px;

		&::placeholder {
			font-size: 14px;
			color: $color-gray;
		}
	}

	&__input-wrapper {
		min-width: 296px;
		margin-top: 24px;
		margin-bottom: 16px;

		@media screen and (max-width: $media-mobile) {
			max-width: none;
		}
	}

	&__selection {
		text-align: center;
		cursor: pointer;

		&:hover {
			#{$this}__icon-wrapper {
				margin-top: -9px;
				background-color: $color-gray-light;
				border-radius: 50%;
				transition: opacity 0.2s ease;
			}

			#{$this}__icon {
				margin-top: 9px;
			}
		}
	}

	&__text-option {
		width: 48px;
		font-size: 12px;
		font-weight: 400;
		color: $color-dark;
	}

	&__back-button {
		position: absolute;
		top: 14px;
		left: 13px;
		padding: 4px;
		cursor: pointer;
		background: none;
		border: none;

		@media screen and (max-width: $media-mobile) {
			left: 30px;
		}
	}
}
</style>
