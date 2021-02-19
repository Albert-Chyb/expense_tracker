import { ValidatorFn } from '@angular/forms';

const MAX_TIMESTAMP = 8640000000000000;
const MIN_TIMESTAMP = -8640000000000000;

export class DateRange {
	constructor(minDate?: Date, maxDate?: Date) {
		this.min = minDate ?? new Date(MIN_TIMESTAMP);
		this.max = maxDate ?? new Date(MAX_TIMESTAMP);
	}

	min: Date;
	max: Date;
}

export const isDateWithinRange = (dates: DateRange): ValidatorFn => control => {
	const { min, max } = dates;
	let date: Date;

	if (control.value instanceof Date) date = control.value;
	else if (Date.parse(control.value))
		date = new Date(Date.parse(control.value));
	else return null;

	const isValid = date >= min && date <= max;

	return isValid && control.valid
		? null
		: {
				dateNotInRange: true,
		  };
};
