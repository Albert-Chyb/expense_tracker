import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestore } from 'firebase';
import { Observable } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { Cacheable } from 'src/app/common/cash/cashable';

import { IClosedPeriod, IOpenedPeriod } from './../../common/models/period';
import { UserService } from './../user/user.service';

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
							this._afStore
								.doc(`users/${uid}/periods/${period.id}`)
								.update({ 'date.end': firestore.FieldValue.serverTimestamp() })
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
								.update({ 'date.end': firestore.FieldValue.delete() })
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
	getAllClosed(): Observable<IClosedPeriod[]> {
		return this._user.getUid$().pipe(
			switchMap(uid =>
				this._afStore
					.doc(`users/${uid}`)
					.collection<IClosedPeriod>('periods', ref =>
						ref.where('isClosed', '==', true)
					)
					.valueChanges({ idField: 'id' })
			)
		);
	}
}
