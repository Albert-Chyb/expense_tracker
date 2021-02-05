import { Inject, Injectable, InjectionToken } from '@angular/core';

/**
 * Error of an form field control.
 * It`s a map with a name of the error and a message.
 * Name of an error is the value that is present in the errors object of an NgControl.
 * Message of an error is a text that will be shown in the template.
 */
export type Errors = Map<ErrorName, ErrorMessage>;
export type ErrorName = string;
export type ErrorMessage = string;

export const FORM_FIELD_ERRORS = new InjectionToken<Errors>(
	'FORM_FIELD_ERROR',
	{
		factory: () => new Map(),
	}
);

@Injectable({
	providedIn: 'root',
})
export class FormFieldErrorsService {
	constructor(@Inject(FORM_FIELD_ERRORS) private readonly _errors: Errors) {}

	/**
	 * Returns message associated with given error name.
	 * @param errorName The name of an error
	 */
	getMessage(errorName: ErrorName): string {
		if (this._errors.has(errorName)) return this._errors.get(errorName);

		return '';
	}
}
