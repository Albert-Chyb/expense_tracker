import {
	DynamicQuery,
	FirestoreFieldPath,
	FirestoreOrderByDirection,
	FirestoreWhereFilterOp,
} from './models';

/**
 * Filters documents for given condition.
 * @param fieldName Field to run query against
 * @param filter Comparison sign
 * @param value Searching value
 */
export function where(
	fieldName: FirestoreFieldPath,
	filter: FirestoreWhereFilterOp,
	value: any
) {
	return new DynamicQuery('where', [fieldName, filter, value]);
}

/**
 * Orders document by given field name in given direction.
 * @param field Field to run query against
 * @param direction Order direction
 */
export function orderBy(
	field: FirestoreFieldPath,
	direction: FirestoreOrderByDirection
) {
	return new DynamicQuery('orderBy', [field, direction]);
}

/**
 * Sets limit how many documents to retrieve.
 * @param limit Max number of returned documents
 */
export function limit(limit: number) {
	return new DynamicQuery('limit', [limit]);
}

/**
 * Returns documents between two values.
 * @param field Field to run the query against
 * @param start Left edge of the interval
 * @param end Right edge of the interval
 * @param closedInterval Indicates if the edge values should be included in the response. (e.g. Lower than or Lower or equal)
 */
export function between(
	field: FirestoreFieldPath,
	start: any,
	end: any,
	closedInterval = true
) {
	const startComparison: FirestoreWhereFilterOp = closedInterval ? '>=' : '>';
	const endComparison: FirestoreWhereFilterOp = closedInterval ? '<=' : '<';

	return [
		new DynamicQuery('where', [field, startComparison, start]),
		new DynamicQuery('where', [field, endComparison, end]),
	];
}
