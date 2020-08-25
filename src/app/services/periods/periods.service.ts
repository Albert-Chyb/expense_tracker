import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestore } from 'firebase';
import { Observable } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';

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
		return this._afStore
			.collection('users')
			.doc(this._user.id)
			.collection<IOpenedPeriod>('periods', ref =>
				ref.where('isClosed', '==', false)
			)
			.valueChanges({ idField: 'id' })
			.pipe(map(periods => periods[0]));
	}

	/**
	 * Ends current period.
	 */

	endCurrent(): Promise<void> {
		return this.getCurrent()
			.pipe(
				first(),
				switchMap(period =>
					this._afStore
						.doc(`users/${this._user.id}/periods/${period.id}`)
						.update({ 'date.end': firestore.FieldValue.serverTimestamp() })
				)
			)
			.toPromise();
	}

	/**
	 * If current period is closed but not yet sealed, this function can re-open current period.
	 */

	openCurrent(): Promise<void> {
		return this.getCurrent()
			.pipe(
				first(),
				switchMap(period =>
					this._afStore
						.doc(`users/${this._user.id}/periods/${period.id}`)
						.update({ 'date.end': firestore.FieldValue.delete() })
				)
			)
			.toPromise();
	}

	/**
	 * Gets all closed periods.
	 */

	getAllClosed(): Observable<IClosedPeriod[]> {
		return this._afStore
			.doc(`users/${this._user.id}`)
			.collection<IClosedPeriod>('periods', ref =>
				ref.where('isClosed', '==', true)
			)
			.valueChanges({ idField: 'id' });
	}
}
