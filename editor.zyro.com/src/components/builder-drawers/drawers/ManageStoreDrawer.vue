<template>
	<Component :is="activeComponent" />
</template>

<script>
import { mapGetters } from 'vuex';

import ManageEcwidStore from '@/components/builder-drawers/drawers/partials/ecommerceStoreDrawer/ManageEcwidStore.vue';
import ManageEcommerceStore from '@/components/builder-drawers/drawers/partials/ecommerceStoreDrawer/ManageEcommerceStore.vue';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ManageEcwidStore,
		ManageEcommerceStore,
	},

	computed: {
		...mapGetters('ecommerce', ['showEcommerce']),
		activeComponent() {
			return this.showEcommerce ? 'ManageEcommerceStore' : 'ManageEcwidStore';
		},
	},
});
</script>
