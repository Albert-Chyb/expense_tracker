import { firestore } from 'firebase';
import { map, first, switchMap } from 'rxjs/operators';
import { IPeriod } from './../../common/models/period';
import { Observable } from 'rxjs';
import { UserService } from './../user/user.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { includeDocId } from 'src/app/common/helpers/includeDocId';
import { includeDocsIds } from 'src/app/common/helpers/includeDocsIds';

@Injectable({
	providedIn: 'root',
})
export class PeriodsService {
	constructor(
		private readonly _afStore: AngularFirestore,
		private readonly _user: UserService
	) {}

	/** Gets currently active period  */

	getCurrent(): Observable<IPeriod> {
		return this._afStore
			.collection('users')
			.doc(this._user.id)
			.collection<IPeriod>('periods', ref => ref.where('isClosed', '==', false))
			.snapshotChanges()
			.pipe(
				includeDocsIds(),
				map(periods => periods[0]),
				map(period => {
					period.date.start = (period.date.start as any).toDate();
					return period;
				})
			);
	}

	/**
	 * Ends current period.
	 */

	endCurrent() {
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

	openCurrent() {
		return this.getCurrent()
			.pipe(
				first(),
				switchMap(period =>
					this._afStore
						.doc(`users/${this._user.id}/periods/${period.id}`)
						.update({ 'date.end': null })
				)
			)
			.toPromise();
	}
}
