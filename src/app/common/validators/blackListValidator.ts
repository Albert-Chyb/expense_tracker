import { ValidatorFn, FormControl, ValidationErrors } from '@angular/forms';

export function blackListValidator(...values: any[]): ValidatorFn {
	return function (control: FormControl): ValidationErrors | null {
		const isValid = !values.includes(control.value);

		return isValid ? null : { blackList: { disallowedValues: values } };
	};
}
