<template>
	<section
		class="forms"
		:class="{ 'forms--default-width': !activeFormId }"
	>
		<FormsList
			v-if="activeFormId"
			:form-id="activeFormId"
			@update="activeFormId = $event"
		/>
		<template v-else>
			<ZyroSettingsTitle>
				{{ $t('siteSettings.forms.title') }}
			</ZyroSettingsTitle>
			<div class="forms__container">
				<div
					class="forms__info"
				>
					<ZyroText>
						<template #title>
							{{ $t('siteSettings.forms.subtitle') }}
						</template>
						{{ $t('siteSettings.forms.text') }}
					</ZyroText>
				</div>
				<div
					class="forms__meta"
				>
					<template
						v-if="hasFormInboxes"
					>
						<FormCard
							v-for="_form, formId in siteForms"
							:key="`${formId}-form-card`"
							:entry-count="getFormEntries(formId).length"
							:form-id="formId"
							@update="activeFormId = $event"
						/>
					</template>
					<NoFormCard v-else />
				</div>
			</div>
		</template>
	</section>
</template>

<script>
import { useStore } from 'vuex';

import FormCard from '@/components/site-settings/pages/forms/FormCard.vue';
import FormsList from '@/components/site-settings/pages/forms/FormsList.vue';
import NoFormCard from '@/components/site-settings/pages/forms/NoFormCard.vue';

import ZyroSettingsTitle from '@/components/site-settings/components/ZyroSettingsTitle.vue';
import ZyroText from '@/components/site-settings/components/ZyroText.vue';

import {
	defineComponent,
	ref,
	computed,
} from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
	name: 'Forms',

	components: {
		ZyroSettingsTitle,
		NoFormCard,
		FormCard,
		FormsList,
		ZyroText,
	},

	setup() {
		const {
			getters,
			dispatch,
		} = useStore();
		const route = useRoute();

		const activeFormId = ref(route.params.formName);
		const siteForms = computed(() => getters.siteForms);
		const hasFormInboxes = computed(() => !!Object.keys(siteForms.value).length);
		const getFormEntries = computed(() => getters['forms/getFormEntries']);

		Object.keys(siteForms.value).forEach((formId) => {
			if (getFormEntries.value(formId).length === 0) {
				dispatch('forms/fetchFormEntries', {
					formId,
				});
			}
		});

		return {
			activeFormId,
			siteForms,
			hasFormInboxes,
			getFormEntries,
		};
	},
});
</script>

<style lang="scss" scoped>
.forms {
	&--default-width {
		max-width: 966px;
		margin: 0 auto;
	}

	&__container {
		display: flex;
		align-items: flex-start;
		justify-content: flex-start;

		@media screen and (max-width: $media-mobile) {
			flex-direction: column;
		}
	}

	&__info {
		flex: 0 0 40%;
		margin-right: 40px;
	}

	&__meta {
		display: flex;
		flex-direction: column;
	}
}
</style>
