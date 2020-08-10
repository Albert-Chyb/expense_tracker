import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { includeDocId } from 'src/app/common/helpers/includeDocId';
import { includeDocsIds } from 'src/app/common/helpers/includeDocsIds';

import { ITransactionGroup } from './../../common/models/group';
import { UserService } from './../user/user.service';
import { tap } from 'rxjs/operators';

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
			.pipe(includeDocsIds());
	}

	/**
	 * Gets one transactions group with given id.
	 * @param id Id of transaction group to get.
	 */

	get(id: string): Observable<ITransactionGroup> {
		return this._afStore
			.doc<ITransactionGroup>(`users/${this._user.id}/groups/${id}`)
			.snapshotChanges()
			.pipe(includeDocId());
	}
}
