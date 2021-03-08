import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { Cacheable } from 'src/app/common/cash/cashable';

import { IClosedPeriod, IOpenedPeriod } from './../../common/models/period';
import { UserService } from './../user/user.service';

interface QuerySettings {
	limit?: number;
	orderDirection?: 'asc' | 'desc';
}
const DEFAULT_QUERY_SETTINGS: QuerySettings = {
	limit: null,
	orderDirection: 'desc',
};

@Injectable({
	providedIn: 'root',
})
export class PeriodsService {
	constructor(
		private readonly _afStore: AngularFirestore,
		private readonly _user: UserService
	) {}

	/**
	 * Gets currently active period.
	 */

	getCurrent(): Observable<IOpenedPeriod> {
		return this._user.getUid$().pipe(
			switchMap(uid =>
				this._afStore
					.collection('users')
					.doc(uid)
					.collection<IOpenedPeriod>('periods', ref =>
						ref.where('isClosed', '==', false)
					)
					.valueChanges({ idField: 'id' })
					.pipe(map(periods => periods[0]))
			)
		);
	}

	/**
	 * Ends current period.
	 */

	endCurrent(): Promise<void> {
		return this._user
			.getUid$()
			.pipe(
				switchMap(uid =>
					this.getCurrent().pipe(
						first(),

						switchMap(period =>
							this._afStore.doc(`users/${uid}/periods/${period.id}`).update({
								'date.end': firebase.firestore.FieldValue.serverTimestamp(),
							})
						)
					)
				)
			)
			.toPromise();
	}

	/**
	 * If current period is closed but not yet sealed, this function can re-open current period.
	 */

	openCurrent(): Promise<void> {
		return this._user
			.getUid$()
			.pipe(
				switchMap(uid =>
					this.getCurrent().pipe(
						first(),
						switchMap(period =>
							this._afStore
								.doc(`users/${uid}/periods/${period.id}`)
								.update({ 'date.end': firebase.firestore.FieldValue.delete() })
						)
					)
				)
			)
			.toPromise();
	}

	/**
	 * Gets all closed periods.
	 */

	@Cacheable({
		tableName: 'closedPeriods',
	})
	getAllClosed(settings?: QuerySettings): Observable<IClosedPeriod[]> {
		const { limit, orderDirection } = Object.assign(
			{ ...DEFAULT_QUERY_SETTINGS },
			settings
		);

		return this._user.getUid$().pipe(
			switchMap(uid =>
				this._afStore
					.doc(`users/${uid}`)
					.collection<IClosedPeriod>('periods', ref => {
						let query = ref
							.where('isClosed', '==', true)
							.orderBy('date.start', orderDirection);

						if (limit) query = query.limit(limit);

						return query;
					})
					.valueChanges({ idField: 'id' })
			)
		);
	}

	getClosedBetween(startAt: Date, endAt: Date): Observable<IClosedPeriod[]> {
		return this._user.getUid$().pipe(
			switchMap(uid =>
				this._afStore
					.collection<IClosedPeriod>(`users/${uid}/periods`, ref =>
						ref
							.where('isClosed', '==', true)
							.where('date.start', '>=', startAt)
							.where('date.start', '<=', endAt)
					)
					.valueChanges({ idField: 'id' })
			)
		);
	}
}
