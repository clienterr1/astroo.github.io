<template>
	<ZyroButton
		data-qa="builder-header-btn-online-store"
		theme="header"
		color="white"
		@click="handleOnlineStoreClick"
	>
		<template #icon>
			<Icon
				name="local_grocery_store"
				is-filled
				dimensions="20px"
			/>
		</template>
		{{ $t('builder.onlineStore') }}
	</ZyroButton>
</template>

<script>
import Icon from '@/components/global/Icon.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';
import EventLogApi from '@/api/EventLogApi';
import { useRedirects } from '@/use/useRedirects';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		Icon,
		ZyroButton,
	},

	setup() {
		const { redirectToEcommerce } = useRedirects();

		const handleOnlineStoreClick = async () => {
			await EventLogApi.logEvent({
				eventName: 'website_builder.ecomm_store.enter',
				isHostingerEvent: true,
				eventProperties: {
					location: 'navigation',
				},
			});

			redirectToEcommerce();
		};

		return {
			handleOnlineStoreClick,
		};
	},
});
</script>
