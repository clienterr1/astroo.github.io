<template>
	<ZyroButton
		ref="triggerButton"
		:title="$t('common.settings')"
		data-qa="edit-items-list-trigger"
		@click="isPopupOpen = !isPopupOpen"
	>
		<template #icon>
			<Icon
				name="settings"
				dimensions="16px"
			/>
		</template>
	</ZyroButton>
	<Popup
		v-if="isPopupOpen"
		v-qa="`blog-category-popup`"
		:target-ref="$refs.triggerButton?.$el"
		portal-selector="[data-portal='modal']"
		placement="right-start"
		@click-outside="isPopupOpen = false"
	>
		<ul class="popup-content">
			<li>
				<ZyroButton
					v-qa="`edit-items-list-popup-button-edit`"
					theme="plain"
					@click="$emit('edit'), isPopupOpen = false"
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
					v-qa="`edit-items-list-popup-button-duplicate`"
					theme="plain"
					@click="$emit('duplicate'), isPopupOpen = false"
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
					v-qa="`edit-items-list-popup-button-delete`"
					theme="plain"
					@click="$emit('delete'), isPopupOpen = false"
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
	</Popup>
</template>

<script>
import Icon from '@/components/global/Icon.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';
import Popup from '@/components/global/Popup.vue';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		Icon,
		ZyroButton,
		Popup,
	},
	emits: [
		'edit',
		'duplicate',
		'delete',
	],

	data() {
		return {
			isPopupOpen: false,
		};
	},
});
</script>

<style lang="scss" scoped>
.popup-content {
	padding: 16px;
	overflow: hidden;
	list-style: none;
	background: $color-light;
	border-radius: $border-radius-large;
	box-shadow: 0 5px 5px rgba($color-dark, 0.05), 0 10px 30px rgba($color-dark, 0.2);
}
</style>
