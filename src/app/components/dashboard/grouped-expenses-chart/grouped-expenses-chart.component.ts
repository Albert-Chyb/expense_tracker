import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { EChartsOption } from 'echarts';

import { ITransaction } from './../../../common/models/transaction';

interface PieChartData {
	value: number;
	name: string;
}

/**
 * Visualizes expenses in transactions groups.
 */
@Component({
	selector: 'grouped-expenses-chart',
	templateUrl: './grouped-expenses-chart.component.html',
	styleUrls: ['./grouped-expenses-chart.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupedExpensesChartComponent {
	private _data: PieChartData[] = [];

	/** Array of transactions */
	@Input('data')
	set data(value: ITransaction[]) {
		this._data = this._transformTransactions(value.filter(t => t.amount < 0));
	}

	/** How many groups to include in the chart. */
	@Input('inView') inView: number = 6;

	get options(): EChartsOption {
		return {
			tooltip: {},
			series: [
				{
					name: 'Wydatki',
					data: this._data,
					type: 'pie',
					radius: ['40%', '70%'],
					label: {
						color: 'inherit',
					},
				},
			],
		};
	}

	/** Transforms transactions into chart data type. */
	private _transformTransactions(transactions: ITransaction[]): PieChartData[] {
		const result = transactions.reduce((prev, transaction) => {
			prev[transaction.group.id] ||= { name: transaction.group.name, value: 0 };
			prev[transaction.group.id].value += Math.abs(transaction.amount);

			return prev;
		}, {});

		return Object.values<PieChartData>(result)
			.sort((a, b) => b.value - a.value)
			.slice(0, this.inView);
	}
}
