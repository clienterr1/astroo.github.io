<template>
	<div>
		<div
			class="site-drawer-overlay"
			:class="{ 'site-drawer-overlay--open': isOpen }"
			@touchend.stop.prevent
		/>
		<Transition
			:name="placement === 'right' ? 'drawer-slide-right' : 'drawer-slide-left'"
		>
			<aside
				v-if="isOpen"
				ref="siteDrawerRef"
				:class="{
					'site-drawer--left': placement === 'left',
					'site-drawer--right': placement === 'right',
				}"
				:style="computedStyles"
				class="site-drawer"
			>
				<div class="site-drawer__content">
					<span
						v-qa="'builder-sitedrawer-btn-close'"
						class="site-drawer__close-button"
						:class="{ 'site-drawer__close-button--hide-mobile': !alwaysShowCloseButton }"
						@click="closeDrawer"
					>
						<CloseButton />
					</span>
					<slot />
				</div>
			</aside>
		</Transition>
	</div>
</template>
<script>
import CloseButton from '@zyro-inc/site-modules/components/CloseButton.vue';
import { onClickOutside } from '@vueuse/core';

import {
	defineComponent,
	ref,
	onMounted,
} from 'vue';

export default defineComponent({
	name: 'Drawer',

	components: {
		CloseButton,
	},

	props: {
		placement: {
			type: String,
			default: 'right',
			validator: (placement) => [
				'right',
				'left',
			].includes(placement),
		},
		width: {
			type: String,
			default: '350px',
		},
		alwaysShowCloseButton: {
			type: Boolean,
			default: true,
		},
		isOpen: {
			type: Boolean,
			default: false,
		},
		topPositionMobile: {
			type: String,
			default: '0px',
		},
	},
	emits: ['close-drawer'],
	setup(props, context) {
		const siteDrawerRef = ref(null);

		onMounted(() => {
			onClickOutside(siteDrawerRef, () => {
				context.emit('close-drawer');
			});
		});

		return {
			siteDrawerRef,
		};
	},
	computed: {
		computedStyles() {
			return {
				'--sidebar-width': this.width,
				'--sidebar-top-mobile': this.topPositionMobile,
			};
		},
	},

	methods: {
		closeDrawer() {
			this.$emit('close-drawer');
		},
	},
});
</script>

<style lang="scss" scoped>
.site-drawer-overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba($color-dark, 0.2);
	opacity: 0;
	transition: opacity 0.2s ease;

	&--open {
		z-index: $z-index-site-engine-overlay;
		opacity: 1;

		@media screen and (max-width: $media-mobile) {
			opacity: 0;
		}
	}
}

.site-drawer {
	position: fixed;
	top: 0;
	bottom: 0;
	z-index: $z-index-layout-drawer;
	width: var(--sidebar-width);
	overflow-x: hidden;
	overflow-y: auto;
	background-color: $color-light;
	box-shadow: $box-shadow;

	&--right {
		right: 0;
	}

	&--left {
		left: 0;
	}

	@media screen and (max-width: $media-mobile) {
		top: var(--sidebar-top-mobile, 0);
		width: 100%;
		box-shadow: none;
	}

	&__content {
		position: relative;
		height: 100%;
		overflow-y: hidden;
	}

	&__close-button {
		position: absolute;
		top: 0;
		right: 0;
		z-index: 1;
		display: flex;
		justify-content: flex-end;
		width: 100%;
		padding: 7px 10px;
		background-color: white;

		&--hide-mobile {
			@media screen and (max-width: $media-mobile) {
				display: none;
			}
		}
	}
}
</style>
