<template>
	<div
		ref="appDrawerRef"
		:class="{
			'app-drawer--sidebar-open': isSidebarOpen,
			'app-drawer--left': direction === 'left',
			'app-drawer--with-expanded-sidebar': direction === 'left' && left !== '0' && isSidebarExpanded,
			'app-drawer--right': direction === 'right',
		}"
		:data-popper-reference="BUILDER_SIDEBAR_SELECTOR"
		:style="computedStyles"
		class="app-drawer"
	>
		<ZyroButton
			v-if="showCloseButton"
			class="app-drawer__close"
			data-qa="builder-sidemenu-btn-close"
			:title="$t('common.close')"
			@click="closeDrawer"
		>
			<template #icon>
				<Icon
					name="close"
					dimensions="20px"
				/>
			</template>
		</ZyroButton>
		<slot />
	</div>
</template>

<script>
import {
	ref,
	computed,
	defineComponent,
} from 'vue';
import {
	mapActions,
	mapGetters,
	useStore,
} from 'vuex';

import {
	mapStateGui,
	mapActionsGui,
	CLOSE_DRAWER,
	OPEN_SIDEBAR,
} from '@/store/builder/gui';

import {
	SIDEBAR_WIDTH,
	DATA_SELECTOR_DRAWER,
} from '@/constants';
import Icon from '@/components/global/Icon.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';
import { BUILDER_SIDEBAR_SELECTOR } from '@/components/onboarding/onboardingSelectors';
import { useOnboarding } from '@/components/onboarding/useOnboarding';
import { useDrawerPageSettingsPopup } from '@/use/useDrawerPageSettingsPopup';
import { onClickOutside } from '@/utils/onClickOutside';

export default defineComponent({

	components: {
		Icon,
		ZyroButton,
	},

	props: {
		direction: {
			type: String,
			default: 'left',
			validator: (direction) => [
				'right',
				'left',
			].includes(direction),
		},
		left: {
			type: String,
			default: `${SIDEBAR_WIDTH}px`,
		},
		width: {
			type: String,
			default: '375px',
		},
		showCloseButton: {
			type: Boolean,
			default: true,
		},
		unsetElementOnOpen: {
			type: Boolean,
			default: true,
		},
	},

	emits: ['close'],

	setup(props, context) {
		// Needed for drawers inside <keep-alive>
		//  toggled by activated() & deactivated() lifecycle events
		const { isOnboardingVisible } = useOnboarding();
		const appDrawerRef = ref(null);
		const {
			state,
			dispatch,
		} = useStore();

		const { activeDrawerPageSettingsPopup } = useDrawerPageSettingsPopup();

		const closeDrawer = () => {
			activeDrawerPageSettingsPopup.value = null;
			dispatch(`gui/${CLOSE_DRAWER}`);
			context.emit('close');
		};

		const isEventPrevented = computed(() => state.gui.activeModalName
			|| state.nps.isNpsVisible
			|| isOnboardingVisible.value);

		onClickOutside({
			target: appDrawerRef,
			preventSelector: DATA_SELECTOR_DRAWER,
		}, (event) => {
			// Needed to not handle v-click-outside catching of iframe blurs
			if (isEventPrevented.value || event.type === 'blur') return;

			closeDrawer();
		});

		return {
			isOnboardingVisible,
			BUILDER_SIDEBAR_SELECTOR,
			appDrawerRef,
			closeDrawer,
		};
	},

	computed: {
		...mapStateGui([
			'isSidebarOpen',
			'activeModalName',
			'isSidebarExpanded',
		]),
		...mapGetters(['currentElement']),
		computedStyles() {
			return {
				'--sidebar-width': this.width,
				'--sidebar-left': this.left,
			};
		},
	},

	mounted() {
		if (this.direction === 'left' && !this.isSidebarOpen) {
			this.openSidebar();
		}

		if (this.currentElement && this.unsetElementOnOpen) {
			this.unselectCurrentElement();
		}
	},

	methods: {
		...mapActionsGui({
			openSidebar: OPEN_SIDEBAR,
			closeDrawer: CLOSE_DRAWER,
		}),
		...mapActions(['unselectCurrentElement']),
	},
});
</script>

<style lang="scss" scoped>
.app-drawer {
	$this: &;

	position: fixed;
	top: $header-height-editor;
	bottom: 0;
	z-index: $z-index-layout-drawer;
	width: var(--sidebar-width);
	overflow-x: hidden;
	overflow-y: auto;

	// Show shadow only on the right side
	clip-path: inset(0 -100vw 0 0);
	background-color: white;
	box-shadow: $box-shadow;

	&__close {
		&#{&} {
			position: absolute;
			top: 15px;
			right: 15px;
			z-index: 1;

			@media screen and (max-width: $media-mobile) {
				display: none;
			}
		}
	}

	&--right {
		right: 0;
	}

	&--left {
		left: var(--sidebar-left);

		@media screen and (max-width: $media-mobile) {
			width: calc(100% - var(--sidebar-left));
		}
	}

	&--with-expanded-sidebar {
		left: $sidebar-width-expanded-editor;
	}

	&__header {
		padding: 20px;
	}
}
</style>
