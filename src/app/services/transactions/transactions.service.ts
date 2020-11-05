import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';

import { ITransaction } from './../../common/models/transaction';
import { PeriodsService } from './../periods/periods.service';
import { TransactionsGroupsService } from './../transactions-groups/transactions-groups.service';
import { UserService } from './../user/user.service';

@Injectable({
	providedIn: 'root',
})
export class TransactionsService {
	constructor(
		private readonly _afStore: AngularFirestore,
		private readonly _user: UserService,
		private readonly _periods: PeriodsService,
		private readonly _groups: TransactionsGroupsService
	) {}

	/**
	 * Gets all transactions in current period.
	 */

	getAllCurrent(): Observable<ITransaction[]> {
		return this._user.getUid$().pipe(
			switchMap(uid =>
				this._periods.getCurrent().pipe(
					switchMap(period =>
						this._afStore
							.doc(`users/${uid}`)
							.collection<ITransaction>('transactions', ref =>
								ref
									.where('date', '>=', period.date.start)
									.orderBy('date', 'desc')
							)
							.valueChanges({ idField: 'id' })
					)
				)
			)
		);
	}

	/**
	 * Gets transaction with given ID.
	 * @param id Id of a transaction
	 */

	get(id: string): Observable<ITransaction> {
		return this._user
			.getUid$()
			.pipe(
				switchMap(uid =>
					this._afStore
						.doc<ITransaction>(`users/${uid}/transactions/${id}`)
						.valueChanges()
				)
			);
	}

	/**
	 * Saves transaction in the database.
	 * Automatically replaces transaction id in group field with actual data of the group.
	 * @param transaction Transaction object to save on the server
	 * @param populateLocally If true (default) - group field will be populated before data is sent to database, if false - cloud function will take care of this behavior.
	 */

	async add(
		transaction: ITransaction,
		populateLocally = true
	): Promise<DocumentReference> {
		let data: ITransaction = transaction;
		if (populateLocally)
			data = await this.populateTransactionGroup(transaction);

		return this._afStore
			.collection('users')
			.doc(await this._user.getUid())
			.collection<ITransaction>('transactions')
			.add(data);
	}

	/**
	 * Updates a transaction in the database.
	 * @param id Id of the transaction
	 * @param transaction New transaction
	 * @param populateLocally If true (default) - group field will be populated before data is sent to database, if false - cloud function will take care of this.
	 */

	async update(
		id: string,
		transaction: ITransaction,
		populateLocally = true
	): Promise<void> {
		let data: ITransaction = transaction;
		if (populateLocally)
			data = await this.populateTransactionGroup(transaction);

		return this._afStore
			.doc(`users/${await this._user.getUid()}/transactions/${id}`)
			.update(data);
	}

	/**
	 * Deletes transaction from database.
	 * @param id Id of an transaction
	 */

	async delete(id: string): Promise<void> {
		return this._afStore
			.doc(`users/${await this._user.getUid()}/transactions/${id}`)
			.delete();
	}

	/**
	 * Replaces group property that contains id of an group with actual group data.
	 * @param transaction Transaction to populate.
	 */

	private async populateTransactionGroup(
		transaction: ITransaction
	): Promise<ITransaction> {
		const group = await this._groups
			.get((transaction.group as any) as string)
			.pipe(first())
			.toPromise();

		if (group) transaction.group = group;
		return transaction;
	}
}
