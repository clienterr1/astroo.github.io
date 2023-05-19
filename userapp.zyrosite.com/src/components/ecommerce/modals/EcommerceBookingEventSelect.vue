<template>
	<!-- modal can be opened through query param, so this prevents opening it on user sites without stores and so on -->
	<ModalLayout
		v-if="isModalEnabled"
		ref="modal"
		padding="0"
		max-width="1048px"
		width="100vw"
		background-color="transparent"
	>
		<div class="ecommerce-booking-modal">
			<div class="ecommerce-booking-modal__content">
				<div class="ecommerce-booking-modal__info">
					<p class="ecommerce-booking-modal__title">
						{{ title }}
					</p>
					<div class="ecommerce-booking-modal__icons">
						<div class="ecommerce-booking-modal__text-wrapper">
							<img
								class="ecommerce-booking-modal__icon"
								:src="calendarIcon"
							>
							<p class="ecommerce-booking-modal__text">
								{{ formattedSelectedDate }}
							</p>
						</div>
						<div class="ecommerce-booking-modal__text-wrapper">
							<img
								class="ecommerce-booking-modal__icon"
								:src="clockIcon"
							>
							<p class="ecommerce-booking-modal__text">
								{{ calculatedTime }} ({{ aggregatedDuration }})
							</p>
						</div>
					</div>
					<div class="ecommerce-booking-modal__text-wrapper">
						<img
							class="ecommerce-booking-modal__icon"
							:src="locationIcon"
						>
						<p class="ecommerce-booking-modal__text">
							{{ location }}
						</p>
					</div>
				</div>
				<div class="ecommerce-booking-modal__availability">
					<p class="ecommerce-booking-modal__time-title">
						{{ translations.selectDateAndTime }}
					</p>
					<div class="ecommerce-booking-modal__calendar-wrapper">
						<DatePicker
							v-model="selectedDate"
							inline
							hide-offset-dates
							auto-apply
							class="ecommerce-booking-modal-calendar"
							:class="{ 'ecommerce-booking-modal-calendar--loading': isCalendarLoading }"
							:disabled-dates="disabledDates"
							:min-date="new Date()"
							:locale="getLanguage"
							no-swipe
							:month-change-on-scroll="false"
							:enable-time-picker="false"
							:custom-props="{ language: getLanguage }"
							:month-year-component="datePickerHeader"
							@update-month-year="loadAvailability({ data: $event })"
						>
							<template #calendar-header="{ index }">
								<div>
									{{ dayNames[index] }}
								</div>
							</template>
						</DatePicker>
						<div class="ecommerce-booking-modal__time-wrapper">
							<div>
								<p class="ecommerce-booking-modal__selected-day">
									{{ selectedMonthAndWeekday }}
								</p>
							</div>
							<div class="ecommerce-booking-modal__time-slot-wrapper">
								<div
									v-if="isSlotsLoading"
									class="ecommerce-booking-modal__time-slot-loader"
								/>
								<button
									v-for="(slot, index) in timeSlots"
									v-else
									:key="`time-${index}`"
									class="ecommerce-booking-modal__time-slot"
									:class="{ 'ecommerce-booking-modal__time-slot--active': selectedTimeSlot === slot }"
									@click="selectTimeSlot(slot)"
								>
									{{ getVisibleDate(new Date(slot)) }}
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="ecommerce-booking-modal__buttons">
				<button
					class="ecommerce-booking-modal__button"
					@click="closeEcommerceModal"
				>
					{{ translations.cancel }}
				</button>
				<button
					class="ecommerce-booking-modal__button ecommerce-booking-modal__button--save"
					:class="{ 'loading': isCheckoutLoading }"
					:disabled="!isTimeSelected"
					@click="handleSubmit"
				>
					{{ translations.book }}
				</button>
			</div>
		</div>
	</ModalLayout>
</template>

<script>
import { useEcommerce } from '@/components/ecommerce/useEcommerce';
import { useEcommerceModal } from '@/components/ecommerce/modals/useEcommerceModal';
import DatePicker from '@vuepic/vue-datepicker';
import ModalLayout from '@/components/ecommerce/modals/partials/ModalLayout.vue';
import {
	mapState,
	mapActions,
	mapGetters,
} from 'vuex';
import calendarIcon from '@/assets/icons/calendar.svg';
import clockIcon from '@/assets/icons/clock.svg';
import locationIcon from '@/assets/icons/location.svg';
import { BOOKING_DURATION_UNIT_HOURS } from '@zyro-inc/site-modules/constants/ecommerce';
import {
	getAvailability,
	getTimeSlots,
} from '@/api/EcommerceApi';
import { getIsInIframe } from '@zyro-inc/site-modules/utils/getIsInIframe';
import DatePickerHeader from '@/components/ecommerce/date-picker/DatePickerHeader.vue';
import {
	defineComponent,
	computed,
} from 'vue';

export default defineComponent({
	components: {
		ModalLayout,
		DatePicker,
	},

	props: {
		translations: {
			type: Object,
			default: () => {},
		},
		language: {
			type: String,
			default: 'en',
		},
		isCartVisible: {
			type: Boolean,
			default: false,
		},
	},

	setup(props) {
		const { openEcommerceModal } = useEcommerceModal(props);
		const { initiateCheckout } = useEcommerce(props);
		const datePickerHeader = computed(() => DatePickerHeader);

		return {
			initiateCheckout,
			openEcommerceModal,
			datePickerHeader,
		};
	},

	data() {
		return {
			calendarIcon,
			clockIcon,
			locationIcon,
			isTimeSelected: false,
			selectedTimeSlot: null,
			selectedDate: new Date(),
			timeSlots: [],
			isSlotsLoading: false,
			isCalendarLoading: false,
			isCheckoutLoading: false,
			disabledDates: [],
		};
	},

	computed: {
		...mapState('ecommerce', [
			'products',
			'selectedBookingProductId',
			'shoppingCartBookingEvents',
			'shoppingCartItems',
		]),
		...mapGetters('ecommerce', ['isStoreTypeZyro']),
		isModalEnabled() {
			return this.isStoreTypeZyro && !!this.selectedBookingProductId;
		},
		selectedBookingProduct() {
			return this.products?.find((product) => product.id === this.selectedBookingProductId);
		},
		bookingEvent() {
			return this.selectedBookingProduct?.variants[0].booking_event;
		},
		title() {
			return this.selectedBookingProduct?.title;
		},
		location() {
			return this.bookingEvent?.location;
		},
		duration() {
			return this.bookingEvent?.length || null;
		},
		durationUnit() {
			return this.bookingEvent?.length_unit;
		},
		aggregatedDuration() {
			const duration = this.durationUnit === BOOKING_DURATION_UNIT_HOURS ? this.duration / 1000 / 60 / 60 : this.duration / 1000 / 60;
			const time = this.durationUnit === BOOKING_DURATION_UNIT_HOURS ? this.translations.hourShort : this.translations.minuteShort;

			return `${duration} ${time}`;
		},
		eventStartDate() {
			if (!this.selectedTimeSlot) {
				return null;
			}

			return new Date(this.selectedTimeSlot);
		},
		eventEndDate() {
			if (!this.selectedTimeSlot) {
				return null;
			}

			const dateInMilliseconds = this.eventStartDate.getTime();
			const calculatedTime = dateInMilliseconds + this.duration;

			return new Date(calculatedTime);
		},
		calculatedTime() {
			if (!this.selectedTimeSlot) {
				return '--:--';
			}

			// TODO: this is wrong. en language can have both 12 and 24 hour formats, based on country (for example
			// us and gb). country suffix needs to be added, like en-us or en-gb
			const startTime = this.getVisibleDate(this.eventStartDate);
			const endTime = this.getVisibleDate(this.eventEndDate);

			return `${startTime} - ${endTime}`;
		},
		dayNames() {
			const week = [];
			const today = new Date();

			today.setDate((today.getDate() - today.getDay()));
			for (let i = 0; i < 7; i += 1) {
				today.setDate(today.getDate() + 1);
				week.push(new Date(today).toLocaleDateString(this.getLanguage, {
					weekday: 'short',
				}));
			}

			return week;
		},
		formattedSelectedDate() {
			const formattedStartDate = this.selectedDate?.toLocaleDateString(this.language);

			if (this.eventStartDate?.toDateString() !== this.eventEndDate?.toDateString()) {
				const formattedEndDate = this.eventEndDate.toLocaleDateString(this.language);

				return `${formattedStartDate} - ${formattedEndDate}`;
			}

			return formattedStartDate;
		},
		selectedMonthAndWeekday() {
			if (!this.selectedDate) {
				return null;
			}

			const monthDay = this.selectedDate?.toLocaleDateString(this.getLanguage, {
				month: 'long',
				day: 'numeric',
			});
			const weekday = this.selectedDate?.toLocaleDateString(this.getLanguage, {
				weekday: 'long',
			});

			return `${weekday}, ${monthDay}`;
		},
		getLanguage() {
			return this.language === 'br' ? 'pt-BR' : this.language;
		},
	},

	watch: {
		async selectedDate() {
			this.selectedTimeSlot = null;
			this.isTimeSelected = false;
			await this.loadTimeSlots();
		},
	},

	async created() {
		if (this.isModalEnabled) {
			this.setDefaultData();
		}
	},

	methods: {
		...mapActions('ecommerce', [
			'setShoppingCartOpen',
			'setSelectedBookingId',
			'setShoppingCartItems',
		]),
		closeEcommerceModal() {
			this.setSelectedBookingId(null);
			this.$refs.modal.handleCloseModalAction();
		},
		async setDefaultData() {
			await this.loadAvailability();

			// get first available date from the calendar
			if (this.disabledDates.some((date) => date.toDateString() === this.selectedDate.toDateString())) {
				const remainingMonthDays = this.getAllDaysInCurrentMonth();
				const availableDates = remainingMonthDays.filter(
					(date) => !this.disabledDates.some((disabled) => disabled.toDateString() === date.toDateString()),
				).sort((a, b) => new Date(a.date) - new Date(b.date));

				this.selectedDate = availableDates.shift();
			}

			await this.loadTimeSlots();
		},
		async handleSubmit() {
			if (getIsInIframe()) {
				this.openEcommerceModal('EcommerceMessageButtonDisabled');

				return;
			}

			const selectedBookingClone = {
				...this.selectedBookingProduct,
			};

			const { timeZone } = Intl.DateTimeFormat().resolvedOptions();

			selectedBookingClone.variants[0].booking_event = {
				...selectedBookingClone.variants[0].booking_event,
				time_slot: this.selectedTimeSlot,
				time_zone: timeZone,
				length: selectedBookingClone.variants[0].booking_event.length,
				length_unit: selectedBookingClone.variants[0].booking_event.length_unit,
				date: this.selectedDate,
			};

			if (this.isCartVisible) {
				this.isCheckoutLoading = true;
				this.setShoppingCartItems([
					...this.shoppingCartItems,
					selectedBookingClone,
				]);

				this.setShoppingCartOpen(true);
				this.closeEcommerceModal();
			} else {
				await this.initiateCheckout([selectedBookingClone]).then(() => {
					this.isCheckoutLoading = false;
					this.closeEcommerceModal();
				});
			}
		},
		selectTimeSlot(time) {
			this.isTimeSelected = true;
			this.selectedTimeSlot = time;
		},
		async loadTimeSlots() {
			this.isSlotsLoading = true;

			const date = new Intl.DateTimeFormat('lt').format(this.selectedDate);

			this.timeSlots = await getTimeSlots(this.bookingEvent.id, date).then((slots) => {
				this.isSlotsLoading = false;

				return slots;
			});
		},
		async loadAvailability({ data = {} } = {}) {
			this.isCalendarLoading = true;

			const date = Object.keys(data).length ? new Date(data.year, data.month) : this.selectedDate;
			const dateTo = new Date(date.getFullYear(), date.getMonth() + 1, 0);

			this.disabledDates = await getAvailability({
				bookingId: this.bookingEvent.id,
				fromDate: new Intl.DateTimeFormat('lt').format(date),
				toDate: new Intl.DateTimeFormat('lt').format(dateTo),
			}).then((response) => {
				this.isCalendarLoading = false;

				return response.map((disabledDate) => {
					const dateParts = disabledDate.split('-');

					// date-only string has to be split and passed as separate arguments to correctly return new Date()
					return new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
				});
			});
		},
		getAllDaysInCurrentMonth() {
			const month = new Date().getMonth();
			const date = new Date(new Date().getFullYear(), month, new Date().getDate());

			const dates = [];

			while (date.getMonth() === month) {
				dates.push(new Date(date));
				date.setDate(date.getDate() + 1);
			}

			return dates;
		},
		getVisibleDate(date) {
			return date.toLocaleTimeString(this.language, {
				hour: '2-digit',
				minute: '2-digit',
			});
		},
	},
});
</script>

<style lang="scss">
// extension's variable overwrite
// has to go before style import

/* stylelint-disable scss/dollar-variable-pattern */
$dp__cell_border_radius: 100px;
$dp__cell_size: 40px;
$dp__font_family: inherit;
$dp__row_margin: 0;
$dp__font_size: 14px;

/* stylelint-disable-next-line scss/at-import-partial-extension */
@import "@vuepic/vue-datepicker/src/VueDatePicker/style/main.scss";
@import "@zyro-inc/site-modules/scss/mixins/transitions/loading-animation";

$calendar-max-width: 360px;

.ecommerce-booking-modal {
	position: relative;
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 600px;
	overflow: hidden;
	background-color: $color-gray-light;
	border-radius: 15px;

	&__content {
		display: flex;
		height: 100%;
		overflow: hidden;
	}

	&__info {
		display: flex;
		flex: 0 1 35%;
		flex-direction: column;
		padding: 40px 48px;
		text-align: left;
		background-color: $color-light;
		border-right: 1px solid $color-gray-border;
	}

	&__title,
	&__time-title {
		margin-bottom: 24px;
		font-size: 20px;
		line-height: 1.4;
	}

	&__icons {
		display: flex;
		flex-direction: column;
	}

	&__text-wrapper {
		display: flex;
		align-items: center;
		margin-bottom: 16px;
		color: $color-gray;
	}

	&__text {
		margin-left: 8px;
		font-size: 14px;
		font-weight: normal;
		line-height: 1.43;
		overflow-wrap: anywhere;
	}

	&__icon {
		width: 20px;
		height: 20px;
	}

	&__availability {
		width: 100%;
		max-width: 688px;
		padding: 40px 56px;
		padding-right: 8px;
		text-align: left;
	}

	&__calendar-wrapper {
		display: flex;
		width: 100%;
		height: 100%;
	}

	&__selected-day {
		height: 100%;
		min-height: 48px;
		margin-bottom: 8px;
		font-size: 14px;
		word-break: break-word;
	}

	&__time-wrapper {
		display: flex;
		flex-direction: column;
		width: 100%;
		padding-bottom: 24px;
		margin-left: 24px;
	}

	&__time-slot-wrapper {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		width: 100%;
		height: 100%;

		// padding needed for box shadow to not be cut off
		padding: 2px;
		padding-right: 16px;
		overflow: auto;
	}

	&__time-slot-loader {
		align-self: center;
		width: 16px;
		height: 16px;
		margin-right: 16px;
		border: 2px solid $color-gray;
		border-top: 2px solid $color-gray-light;
		border-radius: 50%;
		animation: loading 0.8s linear infinite;
	}

	&__time-slot {
		box-sizing: border-box;
		display: flex;
		justify-content: center;
		width: 100%;
		max-width: 200px;
		padding: 10px 4px;
		margin-bottom: 8px;
		font-family: inherit;
		cursor: pointer;
		background-color: $color-light;
		border: 1px solid $color-gray-border;
		border-radius: 5px;
		transition: all 0.2s ease-in-out;

		&:hover,
		&:focus,
		&--active {
			background-color: $color-meteorite-light;
		}

		&:focus,
		&--active {
			color: $color-azure;
			box-shadow: 0 0 0 2px $color-azure;
		}
	}

	&__buttons {
		display: flex;
		justify-content: flex-end;
		padding: 16px 24px;
		background-color: $color-light;
		border-top: 1px solid $color-gray-border;
	}

	&__button {
		padding: 8px 24px;
		font-family: inherit;
		font-size: 14px;
		line-height: 1.4;
		color: $color-dark;
		border-radius: 5px;
		transition: max-width 0.2s ease;

		@include loading-animation;

		&:not(:disabled) {
			cursor: pointer;
		}

		&--save {
			color: $color-light;
			background-color: $color-azure;

			&:disabled {
				background-color: $color-gray;
			}
		}

		&:first-child {
			margin-right: 12px;
		}
	}
}

.ecommerce-booking-modal-calendar {
	height: fit-content;

	&--loading {
		$loader-size: 48px;

		position: relative;
		filter: opacity(30%);

		&::after {
			position: absolute;
			top: 50%;
			left: calc(50% - $loader-size / 2);
			z-index: 1;
			width: $loader-size;
			height: $loader-size;
			content: "";
			border: 4px solid $color-gray;
			border-top: 4px solid $color-light;
			border-radius: 50%;
			transform: translate(-50%, -50%);
			animation: loading 0.8s linear infinite;
		}
	}

	.dp {
		&__instance_calendar {
			padding: 20px;
		}

		&__calendar_header {
			font-weight: normal;
		}

		&__calendar_header_item {
			display: flex;
			align-items: center;
			justify-content: center;
			margin: 4px;
			text-transform: capitalize;
		}

		&__calendar_header_separator {
			display: none;
		}

		&__cell_inner {
			margin: 4px;
			font-weight: bold;
		}

		&__cell_disabled {
			color: $color-gray;
			text-decoration: line-through;
		}

		&__today {
			border: none;
		}

		&__active_date {
			color: $color-azure;
			background: rgba($color-azure, 0.1);
			border: 2px solid $color-azure;
		}

		&__date_hover:hover {
			background: rgba($color-azure, 0.1);
		}
	}
}

@media screen and (max-width: 760px) {
	.ecommerce-booking-modal {
		justify-content: space-between;
		width: 100vw;
		height: 100vh;
		max-height: unset;
		overflow: auto;
		border-radius: 0;

		&__info {
			position: sticky;
			flex: auto;
			padding: 24px 16px 8px;
			border-right: unset;
			border-bottom: 1px solid $color-gray-border;
		}

		&__content {
			flex-direction: column;
		}

		&__availability {
			display: flex;
			flex-direction: column;
			width: auto;
			max-width: unset;
			padding: 24px 16px;
			overflow: auto;
		}

		&__icons {
			flex-direction: row;
		}

		&__text-wrapper {
			&:first-child {
				padding-right: 8px;
				margin-right: 8px;
				border-right: 1px solid $color-gray;
			}
		}

		&__title {
			/* stylelint-disable-next-line value-no-vendor-prefix */
			display: -webkit-box;
			max-width: 90%;
			margin-bottom: 16px;
			overflow: hidden;
			font-size: 16px;
			text-overflow: ellipsis;
			white-space: normal;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
		}

		&__time-title {
			width: 100%;
			max-width: $calendar-max-width;
			margin: 0 auto 16px;
		}

		&__calendar-wrapper {
			flex-direction: column;
			align-items: center;
		}

		&__time-wrapper {
			width: 100%;
			max-width: $calendar-max-width;
			padding: 0;
			margin: 0;
		}

		&__time-slot-wrapper {
			padding: 2px;
		}

		&__time-slot-loader {
			margin: 16px;
		}

		&__time-slot {
			max-width: none;
		}

		&__selected-day {
			min-height: unset;
		}
	}

	.ecommerce-booking-modal-calendar {
		width: 100%;
		max-width: $calendar-max-width;
		margin-bottom: 24px;
	}
}

@media screen and (max-width: 360px) {
	.ecommerce-booking-modal-calendar {
		.dp {
			&__cell_inner,
			&__calendar_header_item {
				margin: 0;
			}
		}
	}
}

@keyframes loading {
	0% {
		transform: rotate(0deg);
	}

	100% {
		transform: rotate(360deg);
	}
}
</style>
