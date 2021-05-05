import { FormArray, ValidatorFn } from '@angular/forms';

/**
 * Checks if total size of files exceeded max size.
 *
 * Returned error: { areFilesTooLarge: true }
 * @param maxSize Max size of all files in bytes
 * @returns Validator function
 */
export function sizeValidator(maxSize: number): ValidatorFn {
	return (formArray: FormArray) => {
		if (formArray.invalid) return null;
		const totalSize = (<File[]>formArray.value).reduce((size, file) => {
			return size + file.size;
		}, 0);
		const isValid = totalSize <= maxSize;

		return isValid
			? null
			: {
					areFilesTooLarge: true,
					maxSize,
			  };
	};
}

/**
 * Checks if a file exceeded max size
 * @param maxSize Max size of a single file in bytes
 * @returns Validator function
 */
export function singleSizeValidator(maxSize: number): ValidatorFn {
	return (formArray: FormArray) => {
		const isValid = (<File[]>formArray.value).every(
			file => file.size <= maxSize
		);

		return isValid
			? null
			: {
					isFileTooLarge: true,
					maxSize,
			  };
	};
}

/** Helper function that transforms mega bytes to bytes. */
export function MB(mb: number) {
	return mb * 1024 * 1024;
}
