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
	 * Gets all transactions groups that user have.
	 */

	getAll(): Observable<ITransactionGroup[]> {
		return this._afStore
			.doc(`users/${this._user.id}`)
			.collection<ITransactionGroup>('groups')
			.valueChanges({ idField: 'id' });
	}

	/**
	 * Gets one transactions group with given id.
	 * @param id Id of a transaction group.
	 */

	get(id: string): Observable<ITransactionGroup> {
		return this._afStore
			.doc<ITransactionGroup>(`users/${this._user.id}/groups/${id}`)
			.snapshotChanges()
			.pipe(includeDocId());
	}

	/**
	 * Deletes transaction from database.
	 * @param id Id of an transaction
	 */

	delete(id: string): Promise<void> {
		if (!id) throw new Error('No ID of an group was passed !');
		return this._afStore.doc(`users/${this._user.id}/groups/${id}`).delete();
	}

	/**
	 * Creates group in database.
	 * @param group Group to save in database
	 */

	add(group: ITransactionGroup): Promise<DocumentReference> {
		return this._afStore
			.doc(`users/${this._user.id}`)
			.collection('groups')
			.add(group);
	}
}
