import { ValidationErrors, AbstractControl } from '@angular/forms';

/**
 * Checks if control contains a valid font awesome icon template, like `<i class="fal fa-ad"></i>`;
 */

export function fontAwesomeIconTemplateValidator(
	control: AbstractControl
): ValidationErrors | null {
	if (!control.value) return null;
	const iconRegExp = new RegExp(
		/<i class="((fab)|(fas)|(far)|(fal)|(fad))+ fa-+.*"><\/i>/
	);
	const isValid = iconRegExp.test(control.value);

	return isValid ? null : { invalidFontAwesomeTemplate: true };
}
