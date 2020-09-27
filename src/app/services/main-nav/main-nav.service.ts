import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { NavbarButton } from 'src/app/common/models/navbarButton';

@Injectable({
	providedIn: 'root',
})
export class MainNavService {
	constructor() {}

	private readonly _changeButtonBroadcaster$ = new Subject<NavbarButton>();
	private readonly _resetButtonBroadcaster$ = new Subject<void>();

	/**
	 * Replaces default button with new one.
	 * @param newButton New button that will replace current one.
	 */
	changeButton(newButton: NavbarButton) {
		this._changeButtonBroadcaster$.next(newButton);
	}

	/**
	 * Resets navbar button to default state.
	 */
	resetButton() {
		this._resetButtonBroadcaster$.next();
	}

	/**
	 * Broadcasts new value when service requests changing button.
	 */
	get changeButtonBroadcaster$() {
		return this._changeButtonBroadcaster$;
	}

	/**
	 * Broadcasts every time when service requests resetting button to default one.
	 */
	get resetButtonBroadcaster$() {
		return this._resetButtonBroadcaster$;
	}
}
