import { FormArray, ValidatorFn } from '@angular/forms';

export function limitValidator(maxNumber: number): ValidatorFn {
	return (formArray: FormArray) => {
		const isValid = formArray.length <= maxNumber;
		return isValid ? null : { tooManyFiles: true, allowedNumber: maxNumber };
	};
}
