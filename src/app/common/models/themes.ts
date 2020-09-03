/**
 * Names of supported themes.
 * Technically theme with auto name does not exists,
 * but it tells the app that theme should be picked based on device theme.
 */
export type SupportedThemeName = 'light' | 'dark' | 'auto';

/**
 * Contains classed associated with given theme.
 */
export enum ThemeClass {
	Light = 'theme--light',
	Dark = 'theme--dark',
}

/**
 * Contains names of themes.
 */
export enum ThemeName {
	Light = 'light',
	Dark = 'dark',
}

/**
 * Represents theme.
 */
export interface ITheme {
	class: ThemeClass;
	name: ThemeName;
}

/**
 * Represents enum of themes.
 */
export interface IThemes {
	Dark: ITheme;
	Light: ITheme;
}

/**
 * Enum of themes.
 * Exported as freezed constant because TS does not support objects in enums.
 */
export const Themes: IThemes = Object.freeze({
	Dark: {
		class: ThemeClass.Dark,
		name: ThemeName.Dark,
	},
	Light: {
		class: ThemeClass.Light,
		name: ThemeName.Light,
	},
});
