<template>
	<ZyroPopup
		class="popup"
		:show-close-button="false"
		type="no-padding"
		:popper-options="{
			placement: 'bottom-end',
			modifiers: [
				{
					name: 'offset',
					options: {
						offset: [
							0,
							4,
						],
					},
				},
			],
		}"
		is-popup-content-flex-column
	>
		<template #trigger="{ toggle }">
			<ZyroButton
				:title="$t('common.settings')"
				@click="toggle"
			>
				<template #icon>
					<Icon
						name="settings"
						dimensions="16px"
					/>
				</template>
			</ZyroButton>
		</template>
		<template #default="popup">
			<div class="popup__content">
				<ZyroButton
					v-for="{
						id, icon, title, text
					} in manageSlideshowPopupOptions"
					:key="`${id}-button`"
					class="z-body-small"
					theme="plain"
					:color="id === DELETE_OPTION_ID ? 'red' : 'black'"
					:title="title"
					@click.stop="handleOptionClick(popup, id)"
				>
					<template #icon-left>
						<Icon
							:name="icon"
							dimensions="16px"
							is-custom
						/>
					</template>
					{{ text }}
				</ZyroButton>
			</div>
		</template>
	</ZyroPopup>
</template>

<script>
import Icon from '@/components/global/Icon.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroPopup from '@/components/global/ZyroPopup.vue';

import { useManageBlockSlideshowSlides } from '@/components/builder-controls/edit-block-slideshow/use/useManageBlockSlideshowSlides';

import { defineComponent } from 'vue';
import { DELETE_OPTION_ID } from '@/components/builder-controls/edit-block-slideshow/editBlockSlideshowConstants';

export default defineComponent({
	components: {
		Icon,
		ZyroButton,
		ZyroPopup,
	},

	setup(props, context) {
		const { manageSlideshowPopupOptions } = useManageBlockSlideshowSlides(props, context);

		const handleOptionClick = (popup, optionId) => {
			popup.toggle();
			context.emit(optionId);
		};

		return {
			handleOptionClick,
			manageSlideshowPopupOptions,
			DELETE_OPTION_ID,
		};
	},
});
</script>

<style lang="scss" scoped>
.popup {
	&__content {
		display: flex;
		flex-direction: column;
	}
}
</style>
