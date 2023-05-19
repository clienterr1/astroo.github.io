<template>
	<div>
		<div class="navigation z-body-small">
			<span
				class="navigation__back"
				@click="$emit('update')"
			>
				{{ $t('siteSettings.forms.title') }}
			</span>
			<ZyroSvgDeprecated
				name="chevron"
				direction="right"
				class="navigation__chevron"
			/>
			{{ formId }}
		</div>
		<section
			ref="section"
			class="form-submissions"
		>
			<div class="form-submissions__header">
				<h4 class="z-h4">
					{{ $t('common.submissions') }}
				</h4>
				<div>
					<ZyroTooltip
						v-if="tableHasRecords"
						position="bottom"
						class="form-submissions__action-btn"
						data-qa="formsubmissions-btn-exportlist"
						content-position="absolute"
					>
						<template #trigger>
							<ZyroButton
								size="xs"
							>
								<template #icon-left>
									<Icon
										name="cloud_download"
										dimensions="16px"
									/>
								</template>
								<ZyroSvgDeprecated
									name="chevron"
									direction="down"
								/>
							</ZyroButton>
						</template>
						<div
							class="form-submissions__export-buttons"
							:[DATA_ATTRIBUTE_SELECTOR]="DATA_ATTRIBUTE_SELECTOR_SUBMISSIONS_EXPORT"
						>
							<ZyroButton
								data-qa="formsubmissions-btn-exportcsv"
								@click="exportAsCsv"
							>
								{{ $t('siteSettings.forms.exportToCSV') }}
							</ZyroButton>
						</div>
					</ZyroTooltip>
				</div>
				<span class="form-submissions__header-count">
					( <strong> {{ getFormEntries(formId).length }}&nbsp;</strong>
					<span>
						{{ $t('common.items') }}<span>
							)
						</span>
						<ZyroButton
							v-if="checkboxes.checked.length"
							class="form-submissions__action-btn"
							size="xs"
							:title="$t('common.delete')"
							:disabled="!checkboxes.checked.length"
							data-qa="formsubmissions-btn-deleteentries"
							@click="handleDeleteEntries(checkboxes, formId)"
						>
							<template #icon>
								<Icon
									name="delete"
									dimensions="16px"
								/>
							</template>
						</ZyroButton>
					</span>
				</span>
			</div>
			<div
				v-if="!tableHasRecords"
				class="form-submissions__no-records"
			>
				<ZyroSvgDeprecated name="csv-export" />
				<h5 class="z-h5">
					{{ $t('siteSettings.forms.noOneFilled') }}
				</h5>
				<p>
					{{ $t('siteSettings.forms.onceSubmitted') }}
				</p>
			</div>

			<div class="form-submissions__table-wrapper">
				<table
					v-if="tableHasRecords"
					class="form-submissions__table"
				>
					<thead
						ref="header"
						class="form-submissions__table-header"
					>
						<th class="form-submissions__entry-checkbox">
							<ZyroCheckbox
								id="all"
								:model-value="checkboxes.checked.length === getFormEntries(formId).length"
								@update:model-value="toggleCheckAll"
							/>
						</th>
						<th
							v-for="tableHeading in tableHeadings"
							:key="tableHeading"
						>
							{{ tableHeading }}
						</th>
						<th
							@click="sortTable('date')"
						>
							<div class="form-submissions__entry-date">
								<span>Date added</span>
								<ZyroSvgDeprecated
									name="triangle-down"
									:class="{ 'form-submissions__table-sort-icon--flipped': sortedAsc }"
									class="form-submissions__table-sort-icon"
								/>
							</div>
						</th>
						<th class="form-submissions__entry-action" />
					</thead>
					<tbody
						class="form-submissions__table-entries"
					>
						<tr
							v-for="(item, index) in currentPageItems"
							:key="item.id"
							class="form-submissions__table-entry"
						>
							<td class="form-submissions__entry-checkbox">
								<ZyroCheckbox
									:id="item.id"
									class="form-submissions__submissions-item-checkbox"
									:model-value="checkboxes.checked.includes(item.id)"
									@update:model-value="handleEntryCheckboxToggle({
										itemId: item.id,
										isChecked: $event
									})"
								/>
							</td>
							<td
								v-for="(cellItem, cellIndex) in uniqueTableKeys"
								:key="`cell-${cellIndex}`"
							>
								{{ item.data[cellItem] || '-' }}
							</td>
							<td class="form-submissions__entry-date">
								{{ formatDate(item.created) }}
							</td>
							<td class="form-submissions__entry-action">
								<ZyroTooltip
									position="bottom"
									content-position="absolute"
								>
									<template #trigger>
										<ZyroButton
											v-qa="`formsubmissions-tooltip-moreactions${index}`"
										>
											<template #icon>
												<Icon
													name="more_vert"
													dimensions="16px"
												/>
											</template>
										</ZyroButton>
									</template>
									<ZyroButton
										v-qa="`formsubmissions-tooltip-deleteentry${index}`"
										@click="deleteEntry({
											entryId: item.id,
											formId
										})"
									>
										<template #icon-left>
											<Icon
												name="delete"
												dimensions="16px"
											/>
										</template>
										{{ $t('common.delete') }}
									</ZyroButton>
								</ZyroTooltip>
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<ZyroPagination
				v-if="tableHasRecords"
				class="form-submissions__pagination"
				:current-page="currentPage"
				:page-count="pageCount"
				@change-page="currentPage = $event"
			/>
		</section>
		<div />
	</div>
</template>

<script>
import Icon from '@/components/global/Icon.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroCheckbox from '@/components/global/ZyroCheckbox.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';
import ZyroTooltip from '@/components/global/ZyroTooltip.vue';

import {
	mapGetters,
	mapActions,
} from 'vuex';

import ZyroPagination from '@zyro-inc/site-modules/components/ZyroPagination.vue';
import {
	DATA_ATTRIBUTE_SELECTOR,
	DATA_ATTRIBUTE_SELECTOR_SUBMISSIONS_EXPORT,
} from '@zyro-inc/site-modules/constants';
import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		Icon,
		ZyroButton,
		ZyroCheckbox,
		ZyroSvgDeprecated,
		ZyroTooltip,
		ZyroPagination,
	},

	props: {
		formId: {
			type: String,
			default: null,
		},
	},
	setup() {
		return {
			DATA_ATTRIBUTE_SELECTOR,
			DATA_ATTRIBUTE_SELECTOR_SUBMISSIONS_EXPORT,
		};
	},

	data() {
		return {
			resizeObserver: null,
			elementHeight: 0,
			checkboxes: {
				checked: [],
			},
			currentPage: 1,
			elementsPerPage: 10,
			sortedAsc: false,
		};
	},
	computed: {
		...mapGetters('forms', [
			'getFormEntries',
			'formElementsArray',
		]),
		currentPageItems() {
			const paginatedData = this.getFormEntries(this.formId)
				.slice((this.currentPage - 1) * this.elementsPerPage, this.currentPage * this.elementsPerPage);

			return paginatedData;
		},
		pageCount() {
			return Math.ceil(this.getFormEntries(this.formId).length / this.elementsPerPage);
		},
		tableHasRecords() {
			return this.getFormEntries(this.formId).length > 0;
		},
		formEntries() {
			return this.getFormEntries(this.formId).map((entry) => entry.data);
		},
		uniqueTableKeys() {
			const formEntriesKeys = this.formEntries.map((entry) => Object.keys(entry));

			return [...new Set([...formEntriesKeys.flatMap((item) => item)])];
		},
		formElement() {
			return this.formElementsArray.find(({ formId }) => formId === this.formId);
		},
		formSchema() {
			return this.formElement?.settings?.schema;
		},
		tableHeadings() {
			if (!this.formSchema) return this.uniqueTableKeys;

			return this.uniqueTableKeys.map((formEntryKey) => {
				const formEntrySchemaItem = this.formSchema.find((schemaItem) => schemaItem.name === formEntryKey);

				return formEntrySchemaItem?.inputLabel || formEntryKey;
			});
		},
	},

	async mounted() {
		if (!this.getFormEntries(this.formId).length) {
			await this.fetchFormEntries({
				formId: this.formId,
			});
		}

		if (this.tableHasRecords) {
			this.sortTable('date');
		}
	},

	beforeUnmount() {
		if (this.resizeObserver) {
			this.resizeObserver.disconnect();
		}
	},

	methods: {
		...mapActions('forms', [
			'fetchFormEntries',
			'deleteEntry',
			'deleteEntries',
		]),

		handleEntryCheckboxToggle({
			itemId,
			isChecked,
		}) {
			if (isChecked) {
				this.addCheckedBox(itemId);
			} else {
				this.removeCheckedBox(itemId);
			}
		},
		sortTable(field) {
			if (field === 'date') {
				const getDate = (entry) => new Date(entry.created);

				this.getFormEntries(this.formId).sort((a, b) => (this.sortedAsc ? getDate(a) - getDate(b) : getDate(b) - getDate(a)));
				this.sortedAsc = !this.sortedAsc;
			}
		},
		toggleCheckAll() {
			const checkboxKeys = this.getFormEntries(this.formId).map((listItem) => listItem.id);

			this.checkboxes.checked = this.checkboxes.checked.length < checkboxKeys.length
				? [...checkboxKeys]
				: [];
		},
		addCheckedBox(id) {
			this.checkboxes.checked.push(id);
		},
		removeCheckedBox(id) {
			this.checkboxes.checked.splice(this.checkboxes.checked.indexOf(id), 1);
		},
		handleDeleteEntries(checkboxes, formId) {
			this.deleteEntries({
				checkboxes,
				formId,
			});
			this.checkboxes = {
				checked: [],
			};
		},
		exportAsCsv() {
			const formEntries = this.getFormEntries(this.formId);
			// adds dateAdded key value pair to the CSV that's being exported and parses the JSON data
			const modifiedFormEntries = formEntries.map((entry) => {
				const data = {
					...entry.data,
					dateAdded: new Date(entry.created).toString(),
				};

				return {
					...entry,
					data,
				};
			});

			const formEntriesKeys = modifiedFormEntries.map((entry) => Object.keys(entry.data));
			const keys = [...new Set(formEntriesKeys.flatMap((field) => field))];
			// we need to wrap every entry in quotes so that CSV does not interpret
			const parsedData = modifiedFormEntries.map((listItem) => {
				const modifiedData = Object.fromEntries(Object.entries(listItem.data).map(([key, value]) => [
					key,
					`"${value}"`,
				]));

				return ({
					...listItem,
					data: modifiedData,
				});
			});
			// the semicolon (;) as a delimiter within any field of a submission
			const values = parsedData.map((entryData) => keys.map((key) => entryData.data[key] || '"-"').join(';')).join('\n');
			const encodedCsvData = encodeURIComponent(`${keys.join(';')}\n${values}`);
			const csvContent = `data:text/csv;charset=utf-8,${encodedCsvData}`;

			const downloadElement = document.createElement('a');

			downloadElement.href = csvContent;
			downloadElement.download = `form_data${new Date().toISOString().toString()}.csv`;
			downloadElement.click();
		},
		formatDate(date) {
			const formatter = new Intl.DateTimeFormat('en-us', {
				month: 'long',
				day: 'numeric',
				year: 'numeric',
				hour: 'numeric',
				minute: 'numeric',
				second: 'numeric',
				hourCycle: 'h23',
				fractionalSecondDigits: 2,
			});

			return formatter.format(new Date(date));
			// "Monday, 12/17/2012, 3:00:42.000 AM"
		},
	},
});
</script>

<style lang="scss" scoped>
.navigation {
	padding-bottom: 20px;

	&__back {
		color: $color-gray;
		cursor: pointer;
	}

	&__chevron {
		width: 6px;
		height: 10px;
		margin: 0 13px;
	}
}

.form-submissions {
	display: flex;
	flex-direction: column;
	height: 100%;
	max-height: 100%;
	padding-bottom: 10px;
	overflow: hidden;

	&__export-buttons {
		display: flex;
		flex-direction: column;
	}

	&__action-btn {
		padding: 0 10px;
		margin-left: 16px;
		border: 1px solid $color-gray-border;
		border-radius: 5px;
	}

	&__no-records {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		min-height: 430px;
		background: $color-light;

		h5 {
			margin-top: 38px;
		}

		p {
			margin-top: 16px;
		}
	}

	&__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 16px 8px 16px 24px;
		background: $color-light;
		border-bottom: 1px solid $color-gray-light;

		&-delete-tooltip {
			margin: 0 17px;
			border: 1px solid $color-dark;
			transition: 0.25s;

			&:disabled {
				border: 1px solid $color-gray;
			}

			&:hover {
				border-color: $color-azure;
			}
		}

		&-count {
			margin-right: auto;
			margin-left: 13px;
		}
	}

	&__table-wrapper {
		max-height: calc(100vh - 240px);
		overflow: auto;
	}

	&__table {
		display: table;
		min-width: 100%;
		margin-bottom: 24px;
		table-layout: fixed;
		border-collapse: collapse;
		background: $color-light;

		th {
			position: sticky;
			top: 0;
			border-bottom: 2px solid $color-gray-light;
			box-shadow: inset 0 1px $color-gray-light, 0 1px $color-gray-light;
		}

		td,
		th {
			max-width: 350px;
			padding: 22px 24px;
			word-wrap: break-word;
			background: $color-light;
			border-right: 1px solid $color-gray-light;
		}

		td {
			box-shadow: inset 1px $color-gray-light;
		}

		tr {
			border-top: 1px solid $color-gray-light;
		}

		// TODO properly rewrite modifiers

		&-sort-icon {
			margin-right: 0;
			margin-left: 12px;

			&--flipped {
				transform: scaleY(-1);
			}
		}

		&-entries {
			overflow: auto;
		}

		&-entry,
		&-header {
			padding: 24px 8px 16px 24px;
			text-align: left;

			&:hover {
				background: $color-gray-light;
			}
		}
	}

	&__entry {
		&-date {
			min-width: 110px;
		}

		&-checkbox,
		&-action {
			width: 72px;
		}

		&-action {
			text-align: right;

			:deep(.zyro-button) {
				overflow: hidden;
			}
		}
	}

	&__pagination {
		display: flex;
		align-items: center;
		align-self: center;
		margin-top: auto;
		user-select: none;
	}
}
</style>
