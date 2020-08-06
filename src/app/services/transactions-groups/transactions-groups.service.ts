import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { ITransactionGroup } from './../../common/models/group';
import {
	AngularFirestore,
	DocumentReference,
	AngularFirestoreCollection,
	DocumentData,
	DocumentChangeAction,
} from '@angular/fire/firestore';
import { UserService } from './../user/user.service';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
	providedIn: 'root',
})
export class TransactionsGroupsService {
	constructor(
		private readonly _user: UserService,
		private readonly _afStore: AngularFirestore
	) {}

	/** Gets all transactions groups that user currently have. */

	getAll(): Observable<ITransactionGroup[]> {
		return this._afStore
			.doc(`users/${this._user.id}`)
			.collection<ITransactionGroup>('groups')
			.snapshotChanges()
			.pipe(
				map(docs => {
					return docs.map(this.includeDocId.bind(this));
				})
			);
	}

	/**
	 * Gets one transactions group with given id.
	 * @param id Id of transaction group to get.
	 */

	get(id: string): Observable<ITransactionGroup> {
		return this._afStore
			.doc<ITransactionGroup>(`users/${this._user.id}/groups/${id}`)
			.snapshotChanges()
			.pipe(map(doc => ({ ...doc.payload.data(), id: doc.payload.id })));
	}

	private includeDocId<T>(doc: DocumentChangeAction<T>) {
		const data = doc.payload.doc.data();
		const id = doc.payload.doc.id;
		return { ...data, id };
	}
}
