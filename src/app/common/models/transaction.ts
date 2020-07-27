import { ITransactionGroup } from './group';

/**
 * Represents one transaction in database.
 */
export interface ITransaction {
	/**
	 * Amount of spent or received money.
	 * Can be negative or positive, but never equals 0.
	 */
	amount: number;

	/**
	 * Date of when transaction was made.
	 */
	date: any;

	/**
	 * Description of transaction.
	 */
	description: string;

	/**
	 * Group that transaction belongs to.
	 */
	group: ITransactionGroup;
}
