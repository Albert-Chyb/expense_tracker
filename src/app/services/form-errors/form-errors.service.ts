import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class FormErrorsService {
	constructor() {}

	private readonly errors = {};

	/**
	 * Associates error message with given error name.
	 * @param errorName Error name, must be the same as the one returned from form validator.
	 * @param message Message to display associated with given error name.
	 */

	add(errorName: string, message: string): FormErrorsService {
		this.errors[errorName] = message;
		return this;
	}

	/**
	 * Returns message associated with given error name.
	 * @param errorName Error name, must be the same as the one returned from form validator.
	 */

	get(errorName: string): string {
		return this.errors[errorName];
	}
}
