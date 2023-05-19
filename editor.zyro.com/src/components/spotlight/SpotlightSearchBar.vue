<template>
	<div class="search-bar">
		<label
			for="spotlight-search"
			class="search-bar__label"
		/>
		<input
			id="spotlight-search"
			ref="searchInputRef"
			v-model="searchKeyword"
			type="text"
			autocomplete="off"
			autocorrect="off"
			spellcheck="false"
			aria-label="list"
			role="combobox"
			:placeholder="$t(searchInputPlaceholder)"
			class="search-bar__input"
			@input="logSearchInputValue($event.target.value)"
		>
	</div>
</template>
<script>
import {
	ref,
	onMounted,
	defineComponent,
} from 'vue';
import { debounce } from '@zyro-inc/site-modules/utils/debounce';
import EventLogApi from '@/api/EventLogApi';
import { useSpotlight } from '@/components/spotlight/useSpotlight';

export default defineComponent({
	name: 'SpotlightSearchBar',
	setup() {
		const searchInputRef = ref(null);
		const {
			searchKeyword,
			searchInputPlaceholder,
		} = useSpotlight();

		// Focus the search input on mount
		onMounted(() => {
			searchInputRef.value?.focus();
		});

		const logSearchInputValue = debounce((value) => {
			if (!value) return;

			EventLogApi.logEvent({
				eventName: 'website_builder.search.typed',
				eventProperties: {
					search_phrase: value,
				},
				isHostingerEvent: true,
			});
		}, 500);

		return {
			searchInputPlaceholder,
			searchInputRef,
			searchKeyword,
			logSearchInputValue,
		};
	},
});
</script>
<style lang="scss" scoped>
.search-bar {
	position: relative;
	min-width: 640px;

	&__label {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border-width: 0;
	}

	&__input {
		width: 100%;
		height: 100%;
		padding: 1rem;
		font: inherit;
		font-size: 1rem;
		font-weight: 500;
		color: $color-light;
		background: $color-dark;
		border: 1px solid $color-gray;
		border-bottom: 0;
		border-top-left-radius: 8px;
		border-top-right-radius: 8px;
		outline: none;
	}
}
</style>
