<template>
	<div class="add-block-button">
		<ZyroButton
			ref="addSectionButton"
			v-qa="'builder-btn-addsection'"
			class="add-block-button__button"
			:class="{ 'add-block-button__button--mobile': isMobileMode }"
			theme="primary"
			color="blue"
			:aria-label="$t('common.addSection')"
			@click="addSection"
		>
			<template #icon-left>
				<Icon
					name="add"
					dimensions="16px"
				/>
			</template>
			{{ isMobileMode ? null : $t('common.addSection') }}
		</ZyroButton>
	</div>
</template>

<script>
import Icon from '@/components/global/Icon.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';

import {
	mapActions,
	mapGetters,
	mapState,
} from 'vuex';

import EventLogApi from '@/api/EventLogApi';
import {
	mapActionsGui,
	OPEN_MODAL,
} from '@/store/builder/gui';
import { MODAL_ADD_BLOCK } from '@/constants';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		Icon,
		ZyroButton,
	},

	props: {
		blockId: {
			type: String,
			default: null,
		},
	},

	computed: {
		...mapState(['currentPageId']),
		...mapGetters('gui', ['isMobileMode']),
		addSectionLabel() {
			return this.isMobileMode ? null : this.$t('common.addSection');
		},
	},

	methods: {
		...mapActionsGui({
			openModal: OPEN_MODAL,
		}),
		...mapActions(['addBlock']),
		addSection() {
			this.openModal({
				name: MODAL_ADD_BLOCK,
				settings: {
					previousBlockId: this.blockId,
				},
			});
			this.$refs.addSectionButton.$el.blur();
			EventLogApi.logEvent({
				eventName: 'user.openBlockLibrary',
			});
		},
	},
});
</script>

<style lang="scss" scoped>
.add-block-button {
	&__button {
		margin: 0 8px;
		pointer-events: all;
		cursor: pointer;

		&--mobile {
			padding: 2px 0 2px 8px;

			&:focus:hover {
				padding: 2px 0 2px 10px;
			}
		}
	}
}
</style>
