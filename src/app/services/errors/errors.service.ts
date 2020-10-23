import { Injectable, Injector } from '@angular/core';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable({
	providedIn: 'root',
})
export class ErrorsService {
	constructor(private readonly _injector: Injector) {}

	private get _notifications() {
		return this._injector.get(NotificationsService);
	}

	/**
	 * Notifies user about an error.
	 * @param errorMessage Message to display to the user.
	 */
	notifyUser(errorMessage: string) {
		this._notifications.danger(errorMessage);
	}
}
