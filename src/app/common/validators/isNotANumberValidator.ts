import { ValidatorFn, FormControl, ValidationErrors } from '@angular/forms';

/**
 * Checks if a value is a number. If it does returns null, else { isNaN: true }
 */

export function isNotANumber(control: FormControl): ValidationErrors | null {
	if (!control.value) return null;

	const isValid = typeof control.value === 'number';

	return isValid ? null : { isNaN: true };
}
