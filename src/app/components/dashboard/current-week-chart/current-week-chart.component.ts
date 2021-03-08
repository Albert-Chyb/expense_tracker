import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ITransaction } from 'src/app/common/models/transaction';

@Component({
	selector: 'dashboard-current-week-chart',
	templateUrl: './current-week-chart.component.html',
	styleUrls: ['./current-week-chart.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrentWeekChartComponent {
	private _data: number[] = [];
	private _numberOfTransactions = 0;

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
				data: ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'Sb', 'Nd'],
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

	get hasExpenses() {
		return this._data.some(n => n > 0);
	}

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
			console.log(prev);
			return prev;
		}, new Array(7).fill(0));
	}
}
