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
		end?: Date;

		/**
		 * Date when period was started.
		 */
		start: Date;
	};

	/**
	 * Indicates if period was closed permanently.
	 * Present only in closed period.
	 * Note that there can be only one period that is not closed.
	 */
	isClosed?: boolean;

	/**
	 * Total saved amount in given period.
	 * Present only in closed period.
	 */
	saved?: number;

	/**
	 * Total spent amount in given period.
	 * Present only in closed period.
	 */
	spent?: number;

	/**
	 * Main balance when period was closed permanently.
	 * Present only in closed period.
	 */
	balance?: number;

	id?: string;
}
