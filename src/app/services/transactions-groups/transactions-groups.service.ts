import { switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { includeDocId } from 'src/app/common/helpers/includeDocId';

import { ITransactionGroup } from './../../common/models/group';
import { UserService } from './../user/user.service';

@Injectable({
	providedIn: 'root',
})
export class TransactionsGroupsService {
	constructor(
		private readonly _user: UserService,
		private readonly _afStore: AngularFirestore
	) {}

	/**
	 * Returns all groups.
	 */

	getAll(): Observable<ITransactionGroup[]> {
		return this._user
			.getUid$()
			.pipe(
				switchMap(uid =>
					this._afStore
						.doc(`users/${uid}`)
						.collection<ITransactionGroup>('groups')
						.valueChanges({ idField: 'id' })
				)
			);
	}

	/**
	 * Returns one transactions group with given id.
	 * @param id Id of a transaction group.
	 */

	get(id: string): Observable<ITransactionGroup> {
		return this._user
			.getUid$()
			.pipe(
				switchMap(uid =>
					this._afStore
						.doc<ITransactionGroup>(`users/${uid}/groups/${id}`)
						.snapshotChanges()
						.pipe(includeDocId())
				)
			);
	}

	/**
	 * Deletes a transaction from database.
	 * @param id Id of an transaction
	 */

	async delete(id: string): Promise<void> {
		const uid = await this._user.getUid();
		return this._afStore.doc(`users/${uid}/groups/${id}`).delete();
	}

	/**
	 * Creates a group in database.
	 * @param group Group to save in database
	 */

	async add(group: ITransactionGroup): Promise<DocumentReference> {
		const uid = await this._user.getUid();
		return this._afStore.doc(`users/${uid}`).collection('groups').add(group);
	}
}
