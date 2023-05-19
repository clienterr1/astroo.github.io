<template>
	<div>
		<div id="fb-root" />
		<div
			class="fb-customerchat"
			attribution="install_email"
			:page_id="pageId"
		/>
	</div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
	props: {
		pageId: {
			type: [
				Number,
				String,
			],
			required: true,
		},
	},
});
</script>

<style lang="scss">
// This class comes from Facebook Messenger integration script
#fb-root {
	position: relative;
	z-index: $z-index-site-engine-integration;

	.fb_dialog {
		// this element appears when website page is really long in length
		left: -1000px;
	}
}
</style>
