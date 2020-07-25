import { ISettings } from './settings';

/**
 * Represents user in database.
 */

export interface IUser {
	/**
	 * Name of an user.
	 */
	name: string;

	/**
	 * User settings.
	 */
	settings: ISettings;
}
