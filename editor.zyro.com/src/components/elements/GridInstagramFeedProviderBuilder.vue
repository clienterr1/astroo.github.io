<template>
	<GridInstagramFeed
		:id="id"
		:key="renderKey"
		:media="media"
		@dragstart.stop.prevent
	/>
</template>

<script>
import {
	watch,
	computed,
	ref,
	defineComponent,
} from 'vue';
import { useStore } from 'vuex';

import {
	deleteToken,
	getToken,
} from '@/api/InstagramApi';
import GridInstagramFeed from '@zyro-inc/site-modules/components/elements/instagram-feed/GridInstagramFeed.vue';
import { useGridInstagramFeed } from '@zyro-inc/site-modules/components/elements/instagram-feed/useGridInstagramFeed';

import { isDesktopSafari } from '@/utils/browserIdentifiers';

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

	setup(props) {
		const {
			dispatch,
			state,
		} = useStore();
		const { websiteId: siteId } = state;
		const username = computed(() => props.data.settings.username);

		const cleanupUser = (token) => {
			// If there is token in DB, remove it
			if (token) {
				deleteToken({
					siteId: state.websiteId,
					elementId: props.id,
				});
			}

			// Clear username (used as isInstagramConnected)
			if (username.value) {
				dispatch('mergeElementData', {
					elementId: props.id,
					elementData: {
						settings: {
							username: null,
						},
					},
				});
			}
		};

		const {
			media,
			init,
			itemGap,
		} = useGridInstagramFeed({
			props,
			siteId,
			getInstagramTokenHandler: getToken,
			cleanupCallback: cleanupUser,
		});

		watch(username, init, {
			immediate: true,
		});

		const renderKey = ref(0);

		watch(itemGap, () => {
			if (isDesktopSafari) {
				// Rerender on each change in safari or else it wont rerender changed gaps
				renderKey.value += 1;
			}
		});

		return {
			media,
			itemGap,
			renderKey,
		};
	},
});
</script>
