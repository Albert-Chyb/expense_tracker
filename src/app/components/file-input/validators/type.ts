import { FormArray, ValidatorFn } from '@angular/forms';

export function typeValidator(types: string[]): ValidatorFn {
	return (formArray: FormArray) => {
		if (formArray.invalid) return null;
		const files = formArray.value as File[];
		const isValid = files.every(file => types.includes(file.type));

		return isValid
			? null
			: {
					isNotAllowedType: true,
			  };
	};
}
