<template>
	<EditableItemsList
		ref="items"
		:items="editableItems"
		:placeholder="$t('builder.editSocialIcons.tabLinks.placeholder')"
		:item-placeholder-text="$t('builder.editSocialIcons.tabLinks.itemPlaceholder')"
		:validate-value="validator"
		@edit="editUrl"
		@update-items="updateItems"
	>
		<template #header>
			<EditableItemsAddButton
				:button-text="$t('builder.editSocialIcons.tabLinks.addNew')"
				:placeholder="$t('builder.editSocialIcons.tabLinks.placeholder')"
				:validate-value="validator"
				data-qa="edit-social-icons-popup-links-button-add"
				@add="addUrl"
			/>
		</template>
		<template
			#item-button="{ item, index, startEditingItem }"
		>
			<ZyroPopup
				type="no-padding"
				:popper-options="{
					placement: 'bottom-end',
					modifiers: [
						{
							name: 'offset',
							options: {
								offset: [
									0,
									8,
								],
							},
						}
					],
				}"
				:show-close-button="false"
			>
				<template #trigger="{ toggle }">
					<ZyroButton
						:title="$t('common.settings')"
						:data-qa="`edit-social-icons-popup-links-settings-open-${currentElement.links[index].icon || 'link'}`"
						@click="toggle"
					>
						<template #icon>
							<Icon
								name="settings"
								dimensions="16px"
							/>
						</template>
					</ZyroButton>
				</template>
				<div class="links__link-settings">
					<ZyroButton
						data-qa="edit-social-icons-popup-links-link-edit"
						@click="startEditingItem(index, item)"
					>
						<template #icon-left>
							<Icon
								name="edit"
								dimensions="16px"
							/>
						</template>
						{{ $t('common.edit') }}
					</ZyroButton>

					<ZyroButton
						class="links__link-remove"
						theme="plain"
						color="black"
						:title="$t('common.delete')"
						data-qa="edit-social-icons-popup-links-link-remove"
						@click="removeUrl(index)"
					>
						<template #icon-left>
							<Icon
								name="delete"
								dimensions="16px"
							/>
						</template>
						{{ $t('common.delete') }}
					</ZyroButton>
				</div>
			</ZyroPopup>
		</template>
	</EditableItemsList>
</template>

<script>
import Icon from '@/components/global/Icon.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroPopup from '@/components/global/ZyroPopup.vue';

import {
	mapGetters,
	mapActions,
} from 'vuex';

import svgImporter from '@/utils/svgImporter';

import { availableIcons } from '@/assets/icons/brands/info';
import EditableItemsAddButton from '@/components/reusable-components/editable-items-list/-partials/EditableItemsAddButton.vue';
import EditableItemsList from '@/components/reusable-components/editable-items-list/EditableItemsList.vue';
import {
	getValidUrl,
	getValidEmail,
	getValidPhoneNumber,
} from '@/utils/urlValidators';
import { useGamification } from '@/use/useGamification';
import { GAMIFICATION_TASK_CHANGE_SOCIAL_ICONS } from '@/constants';
import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		Icon,
		ZyroButton,
		ZyroPopup,
		EditableItemsList,
		EditableItemsAddButton,
	},

	setup() {
		const { completeAchievement } = useGamification();

		return {
			completeAchievement,
		};
	},

	data() {
		return {
			error: '',
		};
	},

	computed: {
		...mapGetters(['currentElement']),
		editableItems() {
			return this.currentElement.links.map((item) => {
				const {
					link,
					icon,
				} = item;

				return {
					originalData: {
						...item,
					},
					name: decodeURI(link),
					iconLocation: icon ? 'brands' : '',
					icon: icon ? `${icon}-brands` : 'link',
				};
			});
		},
	},

	methods: {
		...mapActions(['mergeCurrentElementData']),
		async getIconByURL(url) {
			const urlStartRegex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)/;
			const urlWithoutStart = url.replace(urlStartRegex, '');

			const icon = availableIcons.find((iconObject) => iconObject
				.identifiers.some((identifier) => {
					const pattern = new RegExp(`^${identifier}`, 'i');

					return pattern.test(urlWithoutStart);
				}));

			const iconSvg = await svgImporter.getSvg(icon && icon.iconName, 'brands', 'brands');

			return {
				...icon,
				svg: iconSvg,
			};
		},
		parseUrl(urlToParse) {
			const {
				url,
				isUrlValid,
			} = getValidUrl(urlToParse);

			const {
				url: emailUrl,
				isUrlValid: isEmailUrlValid,
			} = getValidEmail(urlToParse);

			const {
				url: phoneNumberUrl,
				isUrlValid: isPhoneNumberUrlValid,
			} = getValidPhoneNumber(urlToParse);

			const parsedUrl = url.includes('http') ? url : `https:${url}`;

			if (isEmailUrlValid && emailUrl) {
				return {
					url: emailUrl,
					isUrlValid: isEmailUrlValid,
				};
			}

			if (isPhoneNumberUrlValid && phoneNumberUrl) {
				return {
					url: phoneNumberUrl,
					isUrlValid: isPhoneNumberUrlValid,
				};
			}

			return {
				url: parsedUrl,
				isUrlValid,
			};
		},
		validator(urlToValidate) {
			const {
				url,
				isUrlValid,
			} = this.parseUrl(urlToValidate);

			if (!urlToValidate.trim()) {
				return {
					isValid: false,
					error: this.$t('validate.emptyValue'),
				};
			}

			const isValid = url.length > 5 && isUrlValid;

			return {
				isValid,
				error: !isValid ? this.$t('builder.editSocialIcons.error.invalidUrl') : '',
			};
		},
		updateItems(links) {
			this.mergeCurrentElementData({
				elementData: {
					links: links.map(({ originalData }) => ({
						...originalData,
					})),
				},
			});
		},
		async addUrl(newUrl) {
			const { url } = this.parseUrl(newUrl);

			const icon = await this.getIconByURL(url);
			const links = [
				...this.currentElement.links,
				{
					link: url,
					icon: icon.iconName || '',
					svg: icon.svg,
				},
			];

			this.mergeCurrentElementData({
				elementData: {
					links,
				},
			});

			this.completeAchievement(GAMIFICATION_TASK_CHANGE_SOCIAL_ICONS);
		},
		removeUrl(index) {
			const links = [...this.currentElement.links];

			links.splice(index, 1);
			this.mergeCurrentElementData({
				elementData: {
					links,
				},
			});

			this.completeAchievement(GAMIFICATION_TASK_CHANGE_SOCIAL_ICONS);
		},
		async editUrl({
			newValue,
			index,
		}) {
			const { url } = this.parseUrl(newValue.name);
			const icon = await this.getIconByURL(url);
			const links = [...this.currentElement.links];
			const currentItem = {
				...links[index],
			};

			links[index] = {
				...currentItem,
				link: url,
				icon: icon.iconName || '',
				svg: icon.svg,
			};
			this.mergeCurrentElementData({
				elementData: {
					links,
				},
			});

			this.completeAchievement(GAMIFICATION_TASK_CHANGE_SOCIAL_ICONS);
		},
	},
});
</script>

<style lang="scss" scoped>
.links {
	&__link-settings {
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}
}
</style>
