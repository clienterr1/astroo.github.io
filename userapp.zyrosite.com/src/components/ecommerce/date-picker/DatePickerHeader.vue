<template>
	<div class="date-picker-header">
		<button
			class="date-picker-header__button"
			@click="onPreviousClick"
		>
			<img
				class="date-picker-header__arrow"
				:src="arrowLeft"
			>
		</button>
		{{ calendarTitle }}
		<button
			class="date-picker-header__button"
			@click="onNextClick"
		>
			<img
				class="date-picker-header__arrow date-picker-header__arrow--next"
				:src="arrowLeft"
			>
		</button>
	</div>
</template>

<script>
import arrowLeft from '@/assets/icons/arrow-left.svg';

export default {
	props: {
		month: {
			type: Number,
			default: 0,
		},
		year: {
			type: Number,
			default: 0,
		},
		customProps: {
			type: Object,
			default: null,
		},
	},
	emits: ['update-month-year'],
	data() {
		return {
			arrowLeft,
		};
	},
	computed: {
		getLanguage() {
			return this.customProps.language === 'br' ? 'pt-BR' : this.customProps.language;
		},
		calendarTitle() {
			const date = new Date(this.year, this.month);

			return date.toLocaleDateString(this.getLanguage, {
				year: 'numeric',
				month: 'long',
			});
		},
	},
	methods: {
		onNextClick() {
			let tempMonth = this.month;
			let tempYear = this.year;

			if (this.month === 11) {
				tempMonth = 0;
				tempYear = this.year + 1;
			} else {
				tempMonth += 1;
			}

			this.updateDate(tempMonth, tempYear);
		},
		onPreviousClick() {
			let tempMonth = this.month;
			let tempYear = this.year;

			if (this.month === 0) {
				tempMonth = 11;
				tempYear = this.year - 1;
			} else {
				tempMonth -= 1;
			}

			this.updateDate(tempMonth, tempYear);
		},
		updateDate(month, year) {
			this.$emit('update-month-year', {
				instance: 0,
				month,
				year,
			});
		},
	},
};
</script>

<style lang="scss" scoped>
.date-picker-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	margin-bottom: 20px;
	font-size: 14px;

	&__button {
		cursor: pointer;
	}

	&__arrow {
		&--next {
			transform: rotate(180deg);
		}
	}
}
</style>
