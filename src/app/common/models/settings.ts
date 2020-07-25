/**
 * Represents user settings in database.
 */

export interface ISettings {
	/**
	 * Number of days after current period will be closed automatically.
	 */
	autoEndAfter: number;

	/**
	 * Indicates if auto closing periods is enabled for given user.
	 */
	autoEndPeriod: boolean;
}
