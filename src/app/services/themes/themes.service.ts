import { DeviceService } from './../device/device.service';
import { LocalStorageKeys } from './../../common/local-storage/local-storage-keys';
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';

import {
	ITheme,
	SupportedThemeName,
	Themes,
} from './../../common/models/themes';

@Injectable({
	providedIn: 'root',
})
export class ThemesService {
	constructor(
		private readonly _rendererFactory: RendererFactory2,
		@Inject(DOCUMENT) private readonly _docRef: Document,
		private readonly _device: DeviceService
	) {
		this._renderer = this._rendererFactory.createRenderer(null, null);

		if (!this._isAvailable) {
			// No theme set in local storage - use device theme by default.
			// Also assume that user is interested in auto changing theme based
			// on device theme.
			this.switchToByName('auto');
		} else {
			// If there is theme in local storage change app theme to it.
			this.switchTo(this.currentTheme);
		}

		this._device.theme$.subscribe(() => {
			if (this.isAutoThemeEnabled) this.switchToByName('auto');
		});
	}

	private _renderer: Renderer2;

	/**
	 * Switches the app`s theme to the selected one.
	 * @param theme Theme to switch to.
	 */
	switchTo(theme: ITheme): void {
		const { body } = this._docRef;

		// Remove old theme`s class.
		if (this._isAvailable)
			this._renderer.removeClass(body, this.currentTheme.class);

		// Add new theme`s class to body element.
		this._renderer.addClass(body, theme.class);

		// Save selected theme locally.
		this.saveTheme(theme.name);
	}

	/**
	 * Switches to theme associated with given name.
	 * If 'auto' name is passed, it starts listening to device theme changes,
	 * stops listening if any other name is passed.
	 * @param name Name of a theme to switch to.
	 */
	switchToByName(name: SupportedThemeName) {
		const theme = this.getByName(name);
		if (name === 'auto') this.enableAutoTheme();
		else this.disableAutoTheme();

		this.switchTo(theme);
	}

	/**
	 * Returns theme associated with given name.
	 * @param name Name of a theme.
	 */
	getByName(name: SupportedThemeName): ITheme {
		switch (name) {
			case 'light':
				return Themes.Light;

			case 'dark':
				return Themes.Dark;

			case 'auto':
				return this._deviceTheme;

			default:
				throw new Error('No theme with given name !');
		}
	}

	/**
	 * Saves theme name in local storage.
	 * @param name Theme to save locally.
	 */
	private saveTheme(name: SupportedThemeName): void {
		localStorage.setItem(LocalStorageKeys.Theme, name);
	}

	/**
	 * Allows device to change app theme.
	 */
	private enableAutoTheme(): void {
		localStorage.setItem(LocalStorageKeys.AutoTheme, 'on');
	}

	/**
	 * Forbids device to change app theme.
	 */
	private disableAutoTheme(): void {
		localStorage.setItem(LocalStorageKeys.AutoTheme, 'off');
	}

	/**
	 * Indicates if auto theme is enabled.
	 */
	get isAutoThemeEnabled(): boolean {
		return localStorage.getItem(LocalStorageKeys.AutoTheme) === 'on';
	}

	/**
	 * Returns current theme.
	 */
	get currentTheme(): ITheme {
		return this.getByName(this._savedThemeName);
	}

	/**
	 * Returns current theme name.
	 * If auto change theme is enabled it returns 'auto'.
	 * If it's not, returns default theme name.
	 */
	get currentThemeName(): SupportedThemeName {
		if (this.isAutoThemeEnabled) {
			return 'auto';
		}

		return this.currentTheme.name;
	}

	/**
	 * Checks if there is a theme saved locally.
	 */
	private get _isAvailable(): boolean {
		return !!localStorage.getItem(LocalStorageKeys.Theme);
	}

	/**
	 * Returns saved theme name.
	 */
	private get _savedThemeName(): SupportedThemeName {
		return localStorage.getItem(LocalStorageKeys.Theme) as SupportedThemeName;
	}

	/**
	 * Returns theme that is based on device theme.
	 */
	private get _deviceTheme(): ITheme {
		const themeName: SupportedThemeName = this._device.theme;
		return this.getByName(themeName);
	}
}
