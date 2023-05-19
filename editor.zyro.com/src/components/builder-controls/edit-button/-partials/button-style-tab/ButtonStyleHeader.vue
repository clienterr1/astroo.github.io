<template>
	<div class="style-header">
		<ZyroLabel class="style-header__label">
			{{ $t('builder.editButton.tabStyleLabel') }}
		</ZyroLabel>
		<ZyroButton
			class="style-header__button"
			@click="openDrawer"
		>
			<template #icon-left>
				<Icon
					name="brush"
					dimensions="16px"
				/>
			</template>
			{{ $t('common.changeShape') }}
		</ZyroButton>
	</div>
</template>

<script>
import Icon from '@/components/global/Icon.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroLabel from '@/components/global/ZyroLabel.vue';

import {
	DRAWER_STYLES_TAB_ID_BUTTON_SETS,
	DRAWER_USER_STYLES,
} from '@/constants';
import { useDrawerTabs } from '@/components/builder-drawers/drawers/use/useDrawerTabs';
import {
	mapActionsGui,
	TOGGLE_DRAWER,
} from '@/store/builder/gui';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		Icon,
		ZyroButton,
		ZyroLabel,
	},

	setup() {
		const { changeCurrentTab } = useDrawerTabs();

		return {
			changeCurrentTab,
		};
	},

	methods: {
		...mapActionsGui({
			toggleDrawer: TOGGLE_DRAWER,
		}),
		openDrawer() {
			this.toggleDrawer(DRAWER_USER_STYLES);
			this.changeCurrentTab({
				drawer: DRAWER_USER_STYLES,
				tabId: DRAWER_STYLES_TAB_ID_BUTTON_SETS,
			});
		},
	},
});
</script>

<style lang="scss" scoped>
.style-header {
	display: flex;
	justify-content: space-between;

	&__label {
		width: auto;
	}

	&__button {
		font-size: 14px;
		text-transform: none;
		letter-spacing: normal;
	}
}
</style>
