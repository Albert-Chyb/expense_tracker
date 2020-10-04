import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import groupBy from 'src/app/common/helpers/groupBy';
import isToday from 'src/app/common/helpers/isToday';
import { Pages } from 'src/app/common/routing/routesUrls';

import { FirestoreTimestamp } from './../../common/models/firestoreTimestamp';
import { ITransaction } from './../../common/models/transaction';
import { IUser } from './../../common/models/user';
import { TransactionsService } from './../../services/transactions/transactions.service';
import { UserService } from './../../services/user/user.service';

@Component({
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
	constructor(
		private readonly _transactions: TransactionsService,
		private readonly _user: UserService
	) {}

	data$: Observable<{
		transactions: [string, ITransaction[]][];
		user: IUser;
	}>;
	incomes: number = 0;
	outcomes: number = 0;
	readonly Pages = Pages;
	readonly isToday = isToday;

	ngOnInit() {
		this.setupData();
	}

	get savings(): number {
		return this.incomes - this.outcomes;
	}

	private setupData() {
		const groupedTransactions$ = this._transactions.getAllCurrent().pipe(
			tap(this.calculateStatistics.bind(this)),
			map(transactions =>
				groupBy(transactions, 'date', this.dateNormalizer.bind(this))
			),
			map(transactions =>
				Array.from(transactions).sort((a: any, b: any) => b[0] - a[0])
			)
		);
		const user$ = this._user.user$;

		this.data$ = combineLatest([groupedTransactions$, user$]).pipe(
			map(([transactions, user]) => ({ transactions, user }))
		);
	}

	private dateNormalizer(data: FirestoreTimestamp): number {
		return data.toDate().setHours(0, 0, 0, 0);
	}

	private calculateStatistics(transactions: ITransaction[]) {
		const statistics = {
			incomes: 0,
			outcomes: 0,
		};

		transactions.forEach(transaction => {
			const type = transaction.amount > 0 ? 'incomes' : 'outcomes';
			statistics[type] += transaction.amount;

			return statistics;
		});

		this.incomes = statistics.incomes;
		this.outcomes = statistics.outcomes * -1;
	}
}
