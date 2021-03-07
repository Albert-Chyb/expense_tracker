import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import * as echarts from 'echarts';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import DARK_THEME from 'src/app/common/charts/dark-theme';
import { TransactionsService } from 'src/app/services/transactions/transactions.service';

import { ITransaction } from './../../common/models/transaction';
import { PeriodsService } from './../../services/periods/periods.service';

// TODO: Find a better place for this line.
echarts.registerTheme('dark', DARK_THEME);

// TODO: Make every chart as separate component
// TODO: Finish querying periods between 2 dates

@Component({
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
	constructor(
		private readonly _transactions: TransactionsService,
		private readonly _periods: PeriodsService
	) {}

	ngOnInit(): void {
		this._getTransactionsInCurrentWeek().pipe(
			map(transactions =>
				transactions.reduce((prev, transaction: ITransaction) => {
					const date = transaction.date.toDate();
					const weekDay = date.getDay();

					prev[weekDay] += transaction.amount;
					return prev;
				}, new Array(7).fill(0))
			)
		);
		// .subscribe(console.log);

		this._periods.getAllClosed().pipe(
			map(periods => {
				return periods.reduce(
					(prev: number[][], curr, index) => {
						const { incomes, outcomes } = curr;

						prev[0].push(incomes);
						prev[1].push(outcomes);

						return prev;
					},
					[[], []]
				);
			})
		);
		// .subscribe(console.log);
	}

	private _getTransactionsInCurrentWeek(): Observable<ITransaction[]> {
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		// Gets day of the week, assuming that Monday is the first day of the week.
		const getWeekDay = () => {
			return (today.getDay() || 7) - 1;
		};

		const weekBeginning = new Date(
			today.getFullYear(),
			today.getMonth(),
			today.getDate() - getWeekDay()
		);

		const weekEnding = new Date(
			today.getFullYear(),
			today.getMonth(),
			today.getDate() + (6 - getWeekDay())
		);

		return this._transactions.getBetween(weekBeginning, weekEnding);
	}
}
