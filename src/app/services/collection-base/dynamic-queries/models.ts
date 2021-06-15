import firebase from 'firebase';

export type FirestoreQueries = keyof firebase.firestore.Query;
export type FirestoreWhereFilterOp = firebase.firestore.WhereFilterOp;
export type FirestoreOrderByDirection = firebase.firestore.OrderByDirection;
export type FirestoreFieldPath = firebase.firestore.FieldPath | string;

export type DynamicQueryParams = [FirestoreQueries, ...any[]];
export type WhereDynamicQueryParams = [
	FirestoreFieldPath,
	FirestoreWhereFilterOp,
	any
];
export type OrderByDynamicQueryParams = [
	FirestoreFieldPath,
	FirestoreOrderByDirection
];
export type LimitDynamicQueryParams = [number];
export type StartAfterDynamicQueryParams = [any];

export class DynamicQuery {
	constructor(_name: 'where', _params: WhereDynamicQueryParams);
	constructor(_name: 'orderBy', _params: OrderByDynamicQueryParams);
	constructor(_name: 'limit', _params: LimitDynamicQueryParams);
	constructor(_name: 'startAfter', _params: StartAfterDynamicQueryParams);
	constructor(
		private readonly _name: FirestoreQueries,
		private readonly _params: any[]
	) {}

	get name(): string {
		return this._name;
	}

	get args() {
		return this._params;
	}
}
