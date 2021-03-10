import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ITransaction } from 'src/app/common/models/transaction';
import { TransactionsService } from 'src/app/services/transactions/transactions.service';

import { IClosedPeriod } from './../../common/models/period';
import { PeriodsService } from './../../services/periods/periods.service';

interface IStatistics {
	incomes: number;
	expenses: number;
}

interface IDashboardData {
	/** Transactions in the current week. */
	week: ITransaction[];

	/** Last 6 periods. */
	periods: IClosedPeriod[];

	/** Transactions in the current period. */
	transactions: ITransaction[];

	/** Information about the current period. */
	current: IStatistics;

	/** Information about the period prior to the current one. */
	last: IStatistics;

	/** Information about the current year. */
	year: IStatistics;
}

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

	data$: Observable<IDashboardData>;

	ngOnInit(): void {
		this.data$ = combineLatest([
			this._transactionsInCurrentWeek(),
			this._lastSixPeriods(),
			this._transactionsInCurrentPeriod(),
			this._periodsFromYearBeginning(),
		]).pipe(
			map(
				([
					week,
					periods,
					transactions,
					periodsFromYearBeginning,
				]): IDashboardData => ({
					week,
					periods,
					current: this._statsFromTransactions(transactions),
					year: this._statsFromPeriods(periodsFromYearBeginning),
					last: this._statsFromPeriods(periods[0] ? [periods[0]] : []),
					transactions,
				})
			)
		);
	}

	/**
	 * Returns transactions in current period.
	 * @Returns Observable of transactions
	 */
	private _transactionsInCurrentPeriod(): Observable<ITransaction[]> {
		return this._transactions.getAllCurrent();
	}

	/**
	 * Returns transactions that were made in current week.
	 * @returns Observable of transactions
	 */
	private _transactionsInCurrentWeek(): Observable<ITransaction[]> {
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		// Gets day index of the week, assuming that Monday is the first day of the week.
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

	/**
	 * Returns last six periods prior to the current one.
	 * @returns Observable of closed periods.
	 */
	private _lastSixPeriods(): Observable<IClosedPeriod[]> {
		return this._periods.getAllClosed({ limit: 6, orderDirection: 'desc' });
	}

	/**
	 * Returns all periods in current year.
	 * @returns Observable of closed periods
	 */
	private _periodsFromYearBeginning(): Observable<IClosedPeriod[]> {
		const yearBeginning = new Date(new Date().getFullYear(), 0, 1);
		const today = new Date();

		return this._periods.getClosedBetween(yearBeginning, today);
	}

	/**
	 * Calculates statistics from passed periods
	 * @param periods Array of periods
	 * @returns Statistics from periods
	 */
	private _statsFromPeriods(periods: IClosedPeriod[]): IStatistics {
		return periods.reduce(
			(prev, curr) => {
				prev.incomes += curr.incomes;
				prev.expenses += curr.outcomes;
				return prev;
			},
			{ incomes: 0, expenses: 0 } as IStatistics
		);
	}

	/**
	 * Calculates statistics from passed transactions
	 * @param transactions Array of transactions
	 * @returns Statistics from transactions
	 */
	private _statsFromTransactions(transactions: ITransaction[]): IStatistics {
		return transactions.reduce(
			(prev, curr) => {
				const type: 'income' | 'outcome' =
					curr.amount > 0 ? 'income' : 'outcome';

				prev[type] += curr.amount;
				return prev;
			},
			{ incomes: 0, expenses: 0 } as IStatistics
		);
	}
}
