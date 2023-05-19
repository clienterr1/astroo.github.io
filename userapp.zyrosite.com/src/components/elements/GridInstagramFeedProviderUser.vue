<template>
	<GridInstagramFeed
		:id="id"
		:media="media"
	/>
</template>

<script>

import {
	defineComponent,
	watch,
	nextTick,
} from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';

import GridInstagramFeed from '@zyro-inc/site-modules/components/elements/instagram-feed/GridInstagramFeed.vue';
import { useGridInstagramFeed } from '@zyro-inc/site-modules/components/elements/instagram-feed/useGridInstagramFeed';

export default defineComponent({
	components: {
		GridInstagramFeed,
	},

	props: {
		id: {
			type: String,
			required: true,
		},
		data: {
			type: Object,
			required: true,
		},
	},

	emits: ['media-loaded'],

	setup(props, context) {
		const { getters } = useStore();

		const getInstagramTokenHandler = async ({
			siteId,
			elementId,
		}) => {
			const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/u1/instagram/token/${siteId}/${elementId}`, {
				withCredentials: false,
			});

			return data.accessToken;
		};

		const {
			media,
			init,
		} = useGridInstagramFeed({
			props,
			siteId: getters.siteId,
			getInstagramTokenHandler,
		});

		init();

		watch(media, async (value) => {
			if (value?.length) {
				await nextTick();

				context.emit('media-loaded');
			}
		}, {
			immediate: false,
		});

		return {
			media,
		};
	},
});
</script>
