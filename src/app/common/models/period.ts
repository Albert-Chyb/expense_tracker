import { FirestoreTimestamp } from './firestoreTimestamp';
import firebase from 'firebase/app';
/**
 * Represents one period in database.
 * Period describes form when to when user want to monitor his budget.
 */

export interface IClosedPeriod {
	/**
	 * Specific dates for period.
	 */
	date: {
		/**
		 * Date when period was ended.
		 * Present only in ended period.
		 */
		end: FirestoreTimestamp;

		/**
		 * Date when period was started.
		 */
		start: FirestoreTimestamp;
	};

	/**
	 * Indicates if period was closed permanently.
	 * Note that there can be only one period that is not closed.
	 */
	isClosed: true;

	/**
	 * Total saved amount in given period.
	 * Present only in closed period.
	 */
	incomes: number;

	/**
	 * Total spent amount in given period.
	 * Present only in closed period.
	 */
	outcomes: number;

	/**
	 * Main balance when period was closed permanently.
	 * Present only in closed period.
	 */
	balance: number;

	/**
	 * Id of an period.
	 */
	id?: string;
}

export interface IOpenedPeriod {
	/**
	 * Specific dates for period.
	 */
	date: {
		/**
		 * Date when period was ended.
		 * Present only in period that was closed manually.
		 */
		end?: FirestoreTimestamp;

		/**
		 * Date when period was started.
		 */
		start: FirestoreTimestamp;
	};

	isClosed: false;

	/**
	 * Id of an period.
	 */
	id?: string;
}

export class Period {
	/**
	 * Creates an empty opened period.
	 */
	static buildOpened(): IOpenedPeriod {
		return {
			date: {
				start: firebase.firestore.FieldValue.serverTimestamp() as FirestoreTimestamp,
			},
			isClosed: false,
		};
	}
}
