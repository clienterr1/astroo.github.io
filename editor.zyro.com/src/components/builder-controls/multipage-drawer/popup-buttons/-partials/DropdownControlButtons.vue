<template>
	<div class="popup-button">
		<ZyroButton
			v-if="!item.isRootItem && !item.isHidden"
			data-qa="sitemenusettingspopup-btn-move-out-dropdown"
			@click="moveOutOfDropdown"
		>
			<template #icon-left>
				<Icon
					name="subdirectory_arrow_right"
					dimensions="16px"
				/>
			</template>
			{{ $t('builder.siteMenu.moveOutOfDropdown') }}
		</ZyroButton>
		<ZyroButton
			v-if="item.canBeMovedToDropdown"
			data-qa="sitemenusettingspopup-btn-move-to-dropdown"
			@click="moveToDropdown"
		>
			<template #icon-left>
				<Icon
					name="subdirectory_arrow_left"
					dimensions="16px"
				/>
			</template>
			{{ $t('builder.siteMenu.moveToDropdown') }}
		</ZyroButton>
	</div>
</template>

<script>
import Icon from '@/components/global/Icon.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';

import { mapActions } from 'vuex';

import { NAVIGATION_GROUP_ROOT } from '@/constants';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		Icon,
		ZyroButton,
	},

	props: {
		item: {
			type: Object,
			required: true,
		},
	},
	methods: {
		...mapActions('navigation', ['moveItem']),
		moveOutOfDropdown() {
			this.moveItem({
				fromId: this.item.groupId,
				toId: NAVIGATION_GROUP_ROOT,
				oldIndex: this.item.index,
				newIndex: this.item.parentIndex + 1,
			});
		},
		moveToDropdown() {
			this.moveItem({
				fromId: NAVIGATION_GROUP_ROOT,
				toId: this.item.itemAboveId,
				oldIndex: this.item.index,
			});
		},
	},
});
</script>

<style lang="scss" scoped>
@import "@/components/builder-controls/multipage-drawer/popup-buttons/PopupButton";
</style>
