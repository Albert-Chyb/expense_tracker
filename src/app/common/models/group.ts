export type IFontAwesomeStylePrefix = 'fas' | 'far' | 'fal' | 'fad' | 'fab';

/**
 * Represents transaction group, like - food, party or health.
 */
export interface ITransactionGroup {
	/**
	 * Name of the transaction group.
	 */
	name: string;

	/**
	 * Icon of the transaction group.
	 */
	icon: ITransactionGroupIcon;

	/**
	 * Id of the group.
	 * Present only in a transaction.
	 */

	id?: string;
}

/**
 * Icon of a group.
 * Uses font awesome library.
 */

export interface ITransactionGroupIcon {
	/**
	 * Name of the icon.
	 * Like 'fa-coins', 'fa-flag'
	 */
	name: string;

	/**
	 * Type of group that the icon belongs to.
	 * For example 'fas' or 'fab'.
	 */
	type: IFontAwesomeStylePrefix;
}
