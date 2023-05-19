<template>
	<div class="blog-drawer-item">
		<div
			class="blog-drawer-item__info"
			@click="$emit('edit')"
		>
			<p
				class="blog-drawer-item__title z-body"
				data-qa="blog-label-posttitle"
			>
				{{ title }}
			</p>
			<div class="blog-drawer-item__footer z-subheading-small">
				<p class="blog-drawer-item__footer-type">
					{{ typeText }}
				</p>
				<p class="blog-drawer-item__footer-date">
					{{ date }}
				</p>
			</div>
		</div>
		<ZyroButton
			ref="moreSettingsRef"
			:title="$t('common.moreSettings')"
			data-testId="popup-trigger"
			data-qa="blog-btn-postsettings"
			class="blog-drawer-item__settings-button"
			@click="togglePopup"
		>
			<template #icon>
				<Icon
					name="more_vert"
					dimensions="16px"
				/>
			</template>
		</ZyroButton>
		<Popup
			v-if="isMoreSettingsOpen"
			:target-ref="$refs.moreSettingsRef?.$el"
			placement="right-start"
			@click-outside="handleClickOutside"
		>
			<ul
				class="popup-content"
				@click.stop
			>
				<li>
					<ZyroButton
						v-qa="`trigger-button-edit`"
						theme="plain"
						class="popup-content__button"
						text-class="z-body-small"
						@click="$emit('edit'), togglePopup()"
					>
						<template #icon-left>
							<Icon
								name="edit"
								dimensions="16px"
							/>
						</template>
						{{ $t('common.edit') }}
					</ZyroButton>
				</li>
				<li>
					<ZyroButton
						v-qa="`trigger-button-duplicate`"
						theme="plain"
						class="popup-content__button"
						text-class="z-body-small"
						@click="$emit('duplicate'), togglePopup()"
					>
						<template #icon-left>
							<Icon
								name="copy"
								dimensions="16px"
							/>
						</template>
						{{ $t('common.duplicate') }}
					</ZyroButton>
				</li>
				<li>
					<ZyroButton
						v-qa="`trigger-button-settings`"
						theme="plain"
						class="popup-content__button"
						text-class="z-body-small"
						@click="$emit('settings'), togglePopup()"
					>
						<template #icon-left>
							<Icon
								name="settings"
								dimensions="16px"
							/>
						</template>
						{{ $t('common.settings') }}
					</ZyroButton>
				</li>
				<li>
					<ZyroButton
						v-qa="`trigger-button-publish`"
						theme="plain"
						:title="$t('common.settings')"
						class="popup-content__button"
						text-class="z-body-small"
						@click="$emit('publish'), togglePopup()"
					>
						<template #icon-left>
							<Icon
								:name="isPublishable ? 'publish' : 'unpublished'"
								dimensions="16px"
							/>
						</template>
						{{ isPublishable ? $t('common.publish') : $t('common.unpublish') }}
					</ZyroButton>
				</li>
				<li>
					<ZyroButton
						v-qa="`trigger-button-delete`"
						theme="plain"
						class="popup-content__button popup-content__button-delete"
						text-class="z-body-small"
						@click="isDeleteModalShown = true"
					>
						<template #icon-left>
							<Icon
								name="delete"
								dimensions="16px"
							/>
						</template>
						{{ $t('common.delete') }}
					</ZyroButton>
				</li>
			</ul>
			<Teleport
				v-if="isDeleteModalShown"
				to="body"
			>
				<SystemDialogModal
					v-qa="'blog-post-delete-modal'"
					class="blog-post-delete-modal"
					:title="$t('builder.deleteBlogPostModal.title')"
					:primary-button-text="$t('common.cancel')"
					:secondary-button-text="$t('common.delete')"
					secondary-button-color="warning"
					@click-primary="isDeleteModalShown = false"
					@click-secondary="$emit('delete')"
					@close="isDeleteModalShown = false"
				>
					<p class="z-body">
						{{ $t('builder.deleteBlogPostModal.description') }}
					</p>
				</SystemDialogModal>
			</Teleport>
		</Popup>
	</div>
</template>

<script>
import Icon from '@/components/global/Icon.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';
import Popup from '@/components/global/Popup.vue';

import SystemDialogModal from '@/components/builder-modals/modals/SystemDialogModal.vue';

import { defineComponent } from 'vue';

export default defineComponent({

	components: {
		Icon,
		ZyroButton,
		SystemDialogModal,
		Popup,
	},

	props: {
		title: {
			type: String,
			default: '',
		},
		typeText: {
			type: String,
			required: true,
		},
		date: {
			type: String,
			default: '',
		},
		isPublishable: {
			type: Boolean,
			default: false,
		},
	},
	emits: [
		'edit',
		'duplicate',
		'settings',
		'publish',
		'delete',
	],

	data() {
		return {
			isDeleteModalShown: false,
			isMoreSettingsOpen: false,
		};
	},

	methods: {
		togglePopup() {
			this.isMoreSettingsOpen = !this.isMoreSettingsOpen;
		},
		handleClickOutside(event) {
			if (!event.target?.closest('[role="dialog"]')) {
				this.isMoreSettingsOpen = false;
			}
		},
	},
});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/components/Popup";

.blog-drawer-item {
	position: relative;
	display: flex;
	padding: 14px 6px 8px 16px;
	margin-bottom: 8px;
	cursor: pointer;
	border: 1px solid $color-gray-light;
	border-radius: $border-radius-small;

	&__info {
		width: 100%;
	}

	&__footer {
		display: flex;
		flex-direction: row;
		margin-top: auto;
		margin-bottom: 4px;

		&-date {
			color: $color-gray;
		}

		&-type {
			margin-right: 8px;
		}
	}

	&__title {
		width: 100%;
		max-width: 260px;
		margin-bottom: 4px;
		overflow: hidden;
		text-overflow: ellipsis;
		letter-spacing: 0.015em;
		white-space: nowrap;
	}

	&__settings-button {
		position: absolute;
		top: 18px;
		right: 0;
	}
}

.popup-content {
	&__button-delete {
		color: $color-primary;
	}
}

.blog-post-delete-modal {
	z-index: $z-index-popup;
}
</style>
