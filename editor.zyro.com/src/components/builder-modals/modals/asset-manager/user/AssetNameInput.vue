<template>
	<form
		ref="formRef"
		@submit.prevent="handleRenameAsset"
	>
		<input
			ref="nameInputRef"
			type="text"
			:value="assetName"
			class="asset-name-input z-body-small"
			pattern="^([a-zA-Z0-9- _()]+)$"
			@invalid="$event.target.setCustomValidity($t('builder.foldersAllowedCharacters',{ chars: 'A-Z, a-z, 0-9, _-()' }))"
			@input="handleNameInput"
		>
	</form>
</template>

<script>
import {
	defineComponent,
	ref,
} from 'vue';
import { onClickOutside } from '@/utils/onClickOutside';

export default defineComponent({
	props: {
		assetName: {
			type: String,
			default: '',
		},
	},
	emits: ['toggle-input'],
	setup(props, context) {
		const formRef = ref(null);
		const nameInputRef = ref(null);
		const assetName = ref(props.assetName);

		const handleRenameAsset = () => {
			const nameWithoutCharacters = assetName.value.replace(/[^\d -_a-z]/gi, '').trim();

			assetName.value = nameWithoutCharacters;
			context.emit('toggle-input', nameWithoutCharacters);
		};

		const handleNameInput = (event) => {
			event.target.setCustomValidity('');
			assetName.value = event.target.value;
		};

		onClickOutside({
			target: nameInputRef,
		}, () => {
			const isValid = formRef.value.reportValidity();

			if (isValid) {
				handleRenameAsset();
			}
		});

		return {
			formRef,
			nameInputRef,
			handleRenameAsset,
			handleNameInput,
		};
	},
});
</script>

<style lang="scss" scoped>
.asset-name-input {
	width: 100%;
	margin-bottom: 4px;
	font-family: inherit;
	text-overflow: unset;
	background-color: $color-gray-light;
	border: none;
	border: 1px solid transparent;
	outline: none;

	&:hover,
	&:focus {
		border-color: $color-gray;
	}
}
</style>
