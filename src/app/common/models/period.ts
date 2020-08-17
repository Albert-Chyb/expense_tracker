import { firestore } from 'firebase/app';
import { Timestamp } from '@google-cloud/firestore';
/**
 * Represents one period in database.
 * Period describes form when to when user want to monitor his budget.
 */

export interface IPeriod {
	/**
	 * Specific dates for period.
	 */
	date: {
		/**
		 * Date when period was ended.
		 * Present only in ended period.
		 */
		end?: Timestamp;

		/**
		 * Date when period was started.
		 */
		start: Timestamp;
	};

	/**
	 * Indicates if period was closed permanently.
	 * Note that there can be only one period that is not closed.
	 */
	isClosed?: boolean;

	/**
	 * Total saved amount in given period.
	 * Present only in closed period.
	 */
	incomes?: number;

	/**
	 * Total spent amount in given period.
	 * Present only in closed period.
	 */
	outcomes?: number;

	/**
	 * Main balance when period was closed permanently.
	 * Present only in closed period.
	 */
	balance?: number;

	/**
	 * Id of an period.
	 */
	id?: string;
}
