import { DatePipe, TitleCasePipe } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	Inject,
	Input,
	LOCALE_ID,
} from '@angular/core';
import { ITransaction } from 'src/app/common/models/transaction';

/**
 * Visualizes received transactions assigning stats to week days.
 *
 * Note that it uses transaction date to determine the day of the week,
 * but does not check if a transaction is in fact in current week.
 */

@Component({
	selector: 'dashboard-current-week-chart',
	templateUrl: './current-week-chart.component.html',
	styleUrls: ['./current-week-chart.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrentWeekChartComponent {
	constructor(@Inject(LOCALE_ID) private readonly _locale: string) {}
	private _data: number[] = [];
	private _numberOfTransactions = 0;

	private readonly _datePipe = new DatePipe(this._locale);
	private readonly _capitalizePipe = new TitleCasePipe();

	@Input('data')
	set data(value: ITransaction[]) {
		// The chart displays only expenses.
		const filtered = value.filter(t => t.amount < 0);

		// In order to calculate the average we need to memorize
		// how many transactions were received.
		this._numberOfTransactions = filtered.length;

		// Finally transform transactions into chart data format.
		this._data = this._transformTransactions(filtered);
	}

	get options() {
		return {
			tooltip: {},
			yAxis: {},
			xAxis: {
				data: new Array(7)
					.fill('')
					.map((v, index) =>
						this._datePipe.transform(new Date(2021, 2, index + 1), 'EEEEEE')
					)
					.map(name => this._capitalizePipe.transform(name)),
			},
			series: [
				{
					name: 'Wydatki',
					type: 'bar',
					data: this._data,
				},
				{
					name: 'Średnie wydatki',
					type: 'line',
					data: new Array(7).fill(this._average()),
				},
			],
		};
	}

	/** Calculates average expenses */
	private _average() {
		const average =
			this._data.reduce((prev, curr) => (prev += curr), 0) /
			this._numberOfTransactions;
		return average.toFixed(2);
	}

	/**
	 * Transforms array of transactions into chart data format.
	 * @param transactions Transactions to include in the chart
	 * @returns Array of numbers that will end up in chart.
	 */
	private _transformTransactions(transactions: ITransaction[]): number[] {
		return transactions.reduce((prev: number[], transaction) => {
			const date = transaction.date.toDate();
			const weekDay = (date.getDay() || 7) - 1;

			prev[weekDay] += Math.abs(transaction.amount);
			return prev;
		}, new Array(7).fill(0));
	}
}
