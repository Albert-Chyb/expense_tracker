import { DeviceTheme } from '../../common/models/device';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
	providedIn: 'root',
})
export class DeviceService {
	constructor() {
		this.listenForThemeChanges();
	}
	private readonly _theme$: Subject<MediaQueryListEvent> = new Subject();

	/**
	 * Returns device's current theme.
	 */
	get theme(): DeviceTheme {
		const { matches } = matchMedia('(prefers-color-scheme: dark)');
		if (matches) return 'dark';
		else return 'light';
	}

	/**
	 * Allows listening for device theme changing.
	 */
	get theme$(): Observable<DeviceTheme> {
		return this._theme$.pipe(
			map(({ matches }) => (matches ? 'dark' : 'light'))
		);
	}

	/**
	 * Checks if app is installed on device as PWA.
	 */
	get isInstalledOnDevice() {
		return matchMedia('(display-mode: standalone)').matches;
	}

	private listenForThemeChanges(): void {
		const themeChanges = matchMedia('(prefers-color-scheme: dark)');
		const listener = ($event: MediaQueryListEvent) => this._theme$.next($event);

		if (themeChanges.addEventListener) {
			themeChanges.addEventListener('change', listener.bind(this));
		} else {
			// Safari does not support addEventListener on matchMedia.
			themeChanges.addListener(listener.bind(this));
		}
	}
}
