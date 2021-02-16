import { ValidatorFn, AbstractControl } from '@angular/forms';

/**
 * Checks if value of the control is a valid date string.
 * @returns invalidDate - Name of the error
 */
export const isValidDate: ValidatorFn = (control: AbstractControl) => {
	return !!Date.parse(control.value) && control.valid
		? null
		: {
				invalidDate: true,
		  };
};
