import { ValidatorFn } from '@angular/forms';

/**
 *  Checks if a control with a name from the first argument has a value lesser than a control with a name from the second argument.
 *  The validator expects that controls contain numbers.
 *
 *  Checks if a <= b
 * @param aName First control name
 * @param bName Second control name
 * @returns isTooLarge error.
 */
export function lesserThanValidator(aName: string, bName: string): ValidatorFn {
	return control => {
		const controlA = control.get(aName);
		const controlB = control.get(bName);
		const a = Number(controlA.value ?? -Infinity);
		const b = Number(controlB.value ?? Infinity);
		const isValid = a <= b;
		const error = isValid ? null : { isTooLarge: { aName, bName } };

		return error;
	};
}
