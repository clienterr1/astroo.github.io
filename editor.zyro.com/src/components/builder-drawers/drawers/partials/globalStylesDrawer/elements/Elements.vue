<template>
	<div>
		<div
			v-for="buttonType in $options.BUTTON_TYPES"
			:key="buttonType"
		>
			<div
				class="elements"
				@click="$emit('change-page', `grid-button-${buttonType}`)"
			>
				<ZyroLabel class="elements__left">
					{{ capitalizeFirstLetter(buttonType) }} button
				</ZyroLabel>

				<div class="elements__right">
					<ZyroSvgDeprecated
						class="elements__edit-icon"
						name="edit"
					/>
					Edit
				</div>
				<ZyroButton
					class="preview"
					:class="`preview--${previewBackgroundColor(buttonType)}`"
				>
					<GridButton
						:content="elementPreview(buttonType).content"
						:type="elementPreview(buttonType).type"
						:class="{ [`grid-button-${buttonType}-mobile`]: isMobileMode }"
						@click.prevent
					/>
				</ZyroButton>
			</div>
		</div>
	</div>
</template>

<script>
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroLabel from '@/components/global/ZyroLabel.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import { mapGetters } from 'vuex';

import GridButton from '@zyro-inc/site-modules/components/elements/button/GridButton.vue';
import { PROPERTY_BACKGROUND_COLOR } from '@zyro-inc/site-modules/constants/globalStyles';
import { capitalizeFirstLetter } from '@zyro-inc/site-modules/utils/modifyString';

import { useElementContrast } from '@/use/useElementContrast';

import { defineComponent } from 'vue';

const BUTTON_TYPES = [
	'primary',
	'secondary',
];

export default defineComponent({
	BUTTON_TYPES,

	components: {
		ZyroButton,
		ZyroLabel,
		ZyroSvgDeprecated,
		GridButton,
	},

	setup() {
		const { getElementContrast } = useElementContrast();

		return {
			getElementContrast,
		};
	},

	computed: {
		...mapGetters('gui', ['isMobileMode']),
	},

	methods: {
		elementPreview(elementType) {
			return {
				content: capitalizeFirstLetter(elementType),
				type: elementType,
			};
		},
		capitalizeFirstLetter,
		previewBackgroundColor(buttonType) {
			return this.getElementContrast(`grid-button-${buttonType}`, PROPERTY_BACKGROUND_COLOR);
		},
	},
});
</script>

<style lang="scss" scoped>
@import "@/components/builder-drawers/drawers/partials/forms";

.elements {
	$this: &;

	padding: 24px 16px 16px;
	cursor: pointer;

	&:hover {
		background-color: $color-gray-light;

		#{$this}__edit-icon {
			display: inline;
			margin-right: 10px;
		}
	}

	&__edit-icon {
		display: none;
	}

	&__left {
		display: inline;
	}

	&__right {
		display: flex;
		float: right;
		padding-right: 20px;
		font-size: 14px;
	}
}

.button {
	border-bottom: 1px solid $color-gray-light;

	&:first-child {
		border-top: 1px solid $color-gray-light;
	}
}

.preview {
	padding: 10px;
	margin-top: 18px;
	margin-bottom: 0;
}
</style>
