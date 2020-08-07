import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class FormErrorsService {
	constructor() {}

	private readonly messages = {};

	add(errorName: string, message: string): FormErrorsService {
		this.messages[errorName] = message;
		return this;
	}

	get(errorName: string): string {
		return this.messages[errorName];
	}
}
