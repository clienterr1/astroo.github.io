<template>
	<div class="multilingual-list">
		<div
			v-for="(language, index) in filteredLanguages"
			:key="`${language.name}`"
			v-qa="`dropdown-language-${language.locale}`"
			class="multilingual-list__item"
			@click="$emit('language-click', language)"
		>
			<Flag
				v-if="showFlags"
				:src="flagData[index].src"
				:alt="flagData[index].alt"
				class="multilingual-list__dropdown-flag"
			/>
			<span class="multilingual-list__label z-body-small">
				{{ language.name }}
			</span>
		</div>
	</div>
</template>

<script>
import { FLAG_CDN_PREFIX } from '@zyro-inc/site-modules/constants';
import Flag from '@zyro-inc/site-modules/components/Flag.vue';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		Flag,
	},

	props: {
		languages: {
			type: Array,
			required: true,
		},
		showFlags: {
			type: Boolean,
		},
	},

	computed: {
		filteredLanguages() {
			const filtered = [];

			return this.languages
				.map((language) => {
					const splitName = language.name.split(' (');
					const name = splitName?.[0];

					if (splitName.length === 1) {
						return {
							...language,
						};
					}

					if (!filtered.includes(name)) {
						filtered.push(name);

						return {
							...language,
							name,
						};
					}

					return null;
				})
				.filter((language) => language !== null);
		},
		flagData() {
			return this.filteredLanguages
				.map((language) => ({
					src: language.country === null ? '/assets/icons/empty-flag.svg' : `${FLAG_CDN_PREFIX}/${language.flagPath}`,
					alt: language.country === null ? 'empty flag' : `${language.locale} flag`,
				}));
		},
	},
});
</script>
<style lang="scss" scoped>
.multilingual-list {
	max-height: 200px;
	padding: 8px 0;
	overflow-y: auto;
	border-radius: 5px;

	&__item {
		display: flex;
		align-items: center;
		padding: 10px;
		cursor: pointer;
		background-color: $color-light;
		transition: background-color 0.1s ease-in-out;

		&:hover,
		&:focus {
			background-color: $color-gray-light;
		}
	}

	&__flag {
		margin: 0 8px;
	}

	&__dropdown-flag {
		margin-right: 10px;
	}
}
</style>
