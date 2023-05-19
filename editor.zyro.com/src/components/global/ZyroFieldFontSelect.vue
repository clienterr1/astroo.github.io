<template>
	<div class="font-select">
		<ZyroLabel class="font-select__label">
			{{ $t('builder.editButton.customButtonStyles.text.font') }}
		</ZyroLabel>
		<button
			ref="fontSelectButton"
			type="button"
			class="font-select__text-font-button z-body-small"
			data-qa="buttonstylesettings-selectfont"
			@click="$emit('toggle')"
		>
			<span class="font-select__current-font">
				{{ currentFontFamily }}
			</span>
			<div class="font-select__separator" />
			<span class="font-select__text z-body-small--strong">
				{{ $t('common.change') }}
			</span>
		</button>
		<FontSelect
			:target-ref="$refs.fontSelectButton"
			:is-open="isOpen"
			placement="right-start"
			@update="$emit('set-font-family', $event)"
			@click-outside="$emit('close')"
		/>
	</div>
</template>

<script>
import { defineComponent } from 'vue';
import FontSelect from '@/components/builder-controls/edit-text/FontSelect.vue';
import ZyroLabel from '@/components/global/ZyroLabel.vue';

export default defineComponent({
	components: {
		ZyroLabel,
		FontSelect,
	},
	props: {
		currentFontFamily: {
			type: String,
			required: true,
		},
		isOpen: {
			type: Boolean,
			required: true,
		},
	},
	emits: [
		'set-font-family',
		'toggle',
		'close',
	],
});
</script>

<style lang="scss" scoped>
.font-select {
	display: flex;
	padding: 8px 0;

	&__text-font-button {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 6px 8px;
		cursor: pointer;
		background: $color-gray-light;
		border-radius: 5px;
	}

	&__current-font {
		max-width: 117px;
		margin-right: 12px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	&__separator {
		width: 1px;
		height: 14px;
		background: $color-gray-border;
	}

	&__text {
		margin-left: 12px;
		color: $color-azure;
		white-space: nowrap;
	}
}
</style>
