import { ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';

/**
 * Allows form control to only have certain values.
 * Returns { whiteList: true } error if value is not allowed.
 * @param allowedValues Allowed values.
 */

export function whiteListValidator(...allowedValues: any[]): ValidatorFn {
	return function (control: AbstractControl): ValidationErrors | null {
		const isValid = allowedValues.includes(control.value);

		return isValid ? null : { whiteList: true };
	};
}
