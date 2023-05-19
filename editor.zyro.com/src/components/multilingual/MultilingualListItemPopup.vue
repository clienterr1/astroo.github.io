<template>
	<ZyroPopup
		type="no-padding"
		:popper-options="{
			placement: 'bottom-end',
			modifiers: [
				{
					name: 'offset',
					options: {
						offset: [
							0,
							12,
						],
					},
				}
			],
		}"
		:show-close-button="false"
	>
		<template #trigger="{ toggle }">
			<ZyroButton
				v-if="item.locale !== defaultLocale || siteLanguagesArray.length === 1 "
				v-qa="`multilingual-button-settings-${item.locale}`"
				:title="$t('common.settings')"
				@click.stop="toggle"
			>
				<template #icon>
					<Icon
						name="settings"
						dimensions="16px"
					/>
				</template>
			</ZyroButton>
		</template>
		<template #default="{ toggle }">
			<div @click.stop>
				<MultilingualPopupButtons
					:item="item"
					@toggle-language-settings="toggle"
				/>
			</div>
		</template>
	</ZyroPopup>
</template>

<script>
import Icon from '@/components/global/Icon.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroPopup from '@/components/global/ZyroPopup.vue';

import { mapGetters } from 'vuex';

import MultilingualPopupButtons from '@/components/multilingual/MultilingualPopupButtons.vue';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		Icon,
		ZyroButton,
		ZyroPopup,
		MultilingualPopupButtons,
	},

	props: {
		item: {
			type: Object,
			required: true,
		},
	},

	computed: {
		...mapGetters([
			'defaultLocale',
			'siteLanguagesArray',
		]),
	},
});
</script>
