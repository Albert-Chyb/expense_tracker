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
	) {
		this.init();
	}

	private _groupsRef: AngularFirestoreCollection<ITransactionGroup>;

	/** Gets all transactions groups that user currently have. */

	getAll(): Observable<ITransactionGroup[]> {
		return this._groupsRef.snapshotChanges().pipe(
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
		return this._groupsRef
			.doc<ITransactionGroup>(id)
			.snapshotChanges()
			.pipe(map(doc => ({ ...doc.payload.data(), id: doc.payload.id })));
	}

	private init() {
		console.warn(
			'TRANSACTION-GROUPS => Update this reference every time user changes account'
		);
		// ! Update this reference every time user changes account !
		this._groupsRef = this._afStore
			.collection('users')
			.doc(this._user.id)
			.collection('groups');
	}

	private includeDocId<T>(doc: DocumentChangeAction<T>) {
		const data = doc.payload.doc.data();
		const id = doc.payload.doc.id;
		return { ...data, id };
	}
}
