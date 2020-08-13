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

	/**
	 * User's current money balance.
	 */
	balance: number;

	/**
	 * Balance when user firstly created data.
	 */

	startingBalance: number;

	/**
	 * Id of an user
	 */
	uid?: string;
}
