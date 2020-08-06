import { TransactionsGroupsService } from './../transactions-groups/transactions-groups.service';
import { Injectable } from '@angular/core';
import {
	AngularFirestore,
	AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

import { ITransaction } from './../../common/models/transaction';
import { PeriodsService } from './../periods/periods.service';
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
	) {
		this.init();
	}

	private _transactionsRef: AngularFirestoreCollection<ITransaction>;

	/**
	 * Gets all transactions in current period of currently logged in user.
	 */

	getAllCurrent(): Observable<ITransaction[]> {
		return this._periods.getCurrent().pipe(
			switchMap(period =>
				this._afStore
					.collection('users')
					.doc(this._user.id)
					.collection<ITransaction>('transactions', ref =>
						ref.where('date', '>=', period.date.start).orderBy('date', 'desc')
					)
					.valueChanges()
					.pipe(
						map(transactions => this.normalizeTransactionsDate(transactions))
					)
			)
		);
	}

	/**
	 * Saves transaction on the server.
	 * Automatically replaces transaction id in group field with actual data of the group.
	 * @param transaction Transaction object to save on the server
	 */

	async add(transaction: ITransaction) {
		const group = await this._groups
			.get((transaction.group as any) as string)
			.pipe(take(1))
			.toPromise();

		transaction.group = group;
		return this._transactionsRef.add(transaction);
	}

	/**
	 * Initialization logic
	 */

	private init() {
		console.warn('TRANSACTION SERVICE => this reference is no dynamic !');
		this._transactionsRef = this._afStore
			.collection('users')
			.doc(this._user.id)
			.collection<ITransaction>('transactions');
	}

	private normalizeTransactionsDate(
		transactions: ITransaction[]
	): ITransaction[] {
		return transactions.map(transaction => {
			transaction.date = (transaction.date as any).toDate();
			return transaction;
		});
	}
}
