<template>
	<div class="ecommerce-button">
		<GridButton
			ref="ecommerceRef"
			tag-name="button"
			data-qa="builder-gridelement-gridecommercebutton"
			:content="content"
			:type="type"
			:font-size-mobile="fontSizeMobile"
			:font-size-desktop="fontSizeDesktop"
			:font-family="fontFamily"
			:font-weight="fontWeight"
			:border-radius="borderRadius"
			:background-color="backgroundColor"
			:font-color="fontColor"
			:border-color="borderColor"
			:background-color-hover="backgroundColorHover"
			:font-color-hover="fontColorHover"
			:border-color-hover="borderColorHover"
			:border-width="borderWidth"
			is-in-builder
			@click.prevent
			@drag.prevent
			@dragstart.prevent
		/>
		<div
			v-if=" !isProductValid"
			:style="warningStyle"
		>
			<ZyroTooltip
				toggle-event="hover"
				mode="dark"
				position="right"
			>
				<template #trigger>
					<ZyroSvgDeprecated
						name="warning"
						dimensions="32px"
					/>
				</template>
				{{ $t('builder.zyroEcommerceNoProducts') }}
			</ZyroTooltip>
		</div>
	</div>
</template>

<script>
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';
import ZyroTooltip from '@/components/global/ZyroTooltip.vue';

import {
	ref,
	computed,
	defineComponent,
} from 'vue';
import {
	mapActions,
	useStore,
} from 'vuex';

import GridButton from '@zyro-inc/site-modules/components/elements/button/GridButton.vue';
import { useGridButton } from '@zyro-inc/site-modules/components/elements/button/useGridButton';
import { useEcommerceGridButton } from '@zyro-inc/site-modules/components/elements/button/useGridEcommerceButton';

const WARNING_SIZE = 32;

export default defineComponent({
	name: 'GridEcommerceButtonProviderBuilder',

	components: {
		ZyroSvgDeprecated,
		ZyroTooltip,
		GridButton,
	},

	props: {
		data: {
			type: Object,
			required: true,
		},
		id: {
			type: String,
			required: true,
		},
	},

	setup(props, context) {
		const { state } = useStore();
		const ecommerceRef = ref(null);

		const {
			content,
			type,
			fontSizeMobile,
			fontSizeDesktop,
			fontFamily,
			fontWeight,
			borderRadius,
			backgroundColor,
			fontColor,
			borderColor,
			backgroundColorHover,
			borderWidth,
			fontColorHover,
			borderColorHover,
		} = useGridButton(props, context, {
			href: computed(() => props.data.href),
		});

		const {
			productVariantId,
			storeProducts,
		} = useEcommerceGridButton(props, state);

		const warningStyle = computed(() => {
			if (!ecommerceRef.value) {
				return null;
			}

			return {
				top: `-${WARNING_SIZE / 2}px`,
				right: `-${WARNING_SIZE / 2}px`,
				position: 'absolute',
				zIndex: 1,
			};
		});

		// Need to check if the assigned product is still in the list.
		// If not, make it -1 and indicate that the product is gone from the button.
		const modifiedProductId = computed(() => {
			const isProductValid = productVariantId.value
				&& storeProducts.value.some((product) => product.variants.some((variant) => variant.id === productVariantId.value));

			return isProductValid ? productVariantId.value : -1;
		});

		const isProductValid = computed(() => /^(?!(\s*|-1)$)/.test(modifiedProductId.value));

		return {
			ecommerceRef,
			warningStyle,
			content,
			type,
			fontSizeMobile,
			fontSizeDesktop,
			fontFamily,
			fontWeight,
			borderRadius,
			backgroundColor,
			fontColor,
			borderColor,
			borderWidth,
			backgroundColorHover,
			fontColorHover,
			borderColorHover,
			isProductValid,
		};
	},

	mounted() {
		// To set product id instantly in case user
		// leaves the first product in the select list
		// to prevent calling the backend in user website

		this.mergeElementData({
			elementId: this.id,
			elementData: {
				settings: {
					productVariantId: this.productVariantId,
				},
			},
		});
	},

	methods: {
		...mapActions(['mergeElementData']),
	},
});
</script>
<style scoped lang="scss">
.ecommerce-button {
	width: 100%;
	height: 100%;
}
</style>
