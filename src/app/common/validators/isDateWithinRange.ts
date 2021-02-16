import { ValidatorFn } from '@angular/forms';

export const isDateWithinRange = (dates: {
	min: Date;
	max: Date;
}): ValidatorFn => control => {
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
