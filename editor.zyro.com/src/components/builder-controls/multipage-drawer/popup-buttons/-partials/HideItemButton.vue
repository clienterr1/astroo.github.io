<template>
	<!-- You need to wrap the button in a div if you want to test click event :') -->
	<div class="popup-button">
		<ZyroButton
			:data-qa="`sitemenusettingspopup-btn-${item.isHidden ? 'show' : 'hide'}`"
			@click="hideNavigationItem"
		>
			<template #icon-left>
				<Icon
					dimensions="16px"
					:name="item.isHidden ? 'visibility' : 'visibility_off'"
				/>
			</template>
			{{ item.isHidden ? $t('common.show') : $t('builder.siteMenu.hideFromNavigation') }}
		</ZyroButton>
	</div>
</template>

<script>
import Icon from '@/components/global/Icon.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';

import { mapActions } from 'vuex';

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
		toggle: {
			type: Function,
			default: () => ({}),
		},
	},

	methods: {
		...mapActions('navigation', ['changeItemVisibility']),
		hideNavigationItem() {
			const {
				navItemId,
				isHidden = false,
			} = this.item;

			this.changeItemVisibility({
				itemId: navItemId,
				isHidden: !isHidden,
			});

			this.toggle();
		},
	},
});
</script>

<style lang="scss" scoped>
@import "@/components/builder-controls/multipage-drawer/popup-buttons/PopupButton";
</style>
