<template>
	<div class="asset-folder-breadcrumbs">
		<button
			v-qa="`asset-folder-breadcrumbs-my-library`"
			class="asset-folder-breadcrumbs__button z-body-small"
			:class="{ 'asset-folder-breadcrumbs__button--current': currentDirectory === '/' }"
			@click="setCurrentDirectory('/')"
		>
			{{ $t('builder.foldersMyLibrary') }}
		</button>
		<template
			v-for="(folder, index) in folders"
			:key="index"
		>
			<div
				v-if="currentDirectory.includes(folder.path)"
				class="asset-folder-breadcrumbs__breadcrumb"
			>
				<ZyroSvgDeprecated
					name="chevron-right"
					dimensions="20px"
					class="asset-folder-breadcrumbs__icon"
				/>
				<button
					v-qa="`asset-folder-breadcrumbs-${folder.name}`"
					class="asset-folder-breadcrumbs__button z-body-small"
					:class="{ 'asset-folder-breadcrumbs__button--current': folder.path === currentDirectory }"
					@click="setCurrentDirectory(folder.path)"
				>
					{{ folder.name }}
				</button>
			</div>
		</template>
	</div>
</template>

<script>
import {
	defineComponent,
	computed,
} from 'vue';
import { useStore } from 'vuex';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

export default defineComponent({
	components: {
		ZyroSvgDeprecated,
	},
	setup() {
		const {
			getters,
			dispatch,
		} = useStore();
		const folderData = computed(() => getters['assets/folders']);
		const folders = computed(() => [...folderData.value].sort((a, b) => a.path.localeCompare(b.path)));
		const currentDirectory = computed(() => getters['assets/currentDirectory']);
		const setCurrentDirectory = (path) => dispatch('assets/setCurrentDirectory', path);

		return {
			currentDirectory,
			setCurrentDirectory,
			folders,
		};
	},
});
</script>

<style lang="scss" scoped>
.asset-folder-breadcrumbs {
	$this: &;

	display: flex;
	flex-wrap: wrap;
	align-items: center;
	padding: 0 24px 20px;

	&__icon {
		margin: 0 4px;
		color: $color-gray;
	}

	&__breadcrumb {
		display: flex;
		align-items: center;
	}

	&__button {
		max-width: 120px;
		overflow: hidden;
		font-weight: 500;
		color: $color-gray;
		text-overflow: ellipsis;
		white-space: nowrap;
		cursor: pointer;

		&--current {
			pointer-events: none;
		}

		&:not(#{$this}__button--current) {
			&:hover,
			&:focus {
				text-decoration: underline;
			}
		}
	}
}
</style>
