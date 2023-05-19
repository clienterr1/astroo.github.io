<template>
	<ResizeHandle
		:type="resizeHandleType"
		:resize-direction="resizeHandleDirection"
		@mousedown="startSectionResizing"
	/>
</template>

<script>
import ResizeHandle from '@/components/builder-controls/control-line/ResizeHandle.vue';
import { useSectionResizing } from '@/use/useSectionResizing';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ResizeHandle,
	},

	props: {
		blockId: {
			type: String,
			required: true,
		},
	},

	setup(props, context) {
		const {
			startSectionResizing,
			resizeHandleType,
			resizeHandleDirection,
		} = useSectionResizing(props, context);

		return {
			startSectionResizing,
			resizeHandleType,
			resizeHandleDirection,
		};
	},
});
</script>
