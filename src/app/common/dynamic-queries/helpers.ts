import {
	DynamicQuery,
	FirestoreFieldPath,
	FirestoreOrderByDirection,
	FirestoreWhereFilterOp,
} from './models';

export function where(
	fieldName: FirestoreFieldPath,
	filter: FirestoreWhereFilterOp,
	value: any
) {
	return new DynamicQuery('where', [fieldName, filter, value]);
}

export function orderBy(
	field: FirestoreFieldPath,
	direction: FirestoreOrderByDirection
) {
	return new DynamicQuery('orderBy', [field, direction]);
}

export function limit(limit: number) {
	return new DynamicQuery('limit', [limit]);
}

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
