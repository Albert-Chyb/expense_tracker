import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class ErrorsService {
	constructor() {}

	/**
	 * Notifies user about an error.
	 * @param errorMessage Message to display to the user.
	 */
	notifyUser(errorMessage: string) {
		alert(errorMessage);
	}
}
