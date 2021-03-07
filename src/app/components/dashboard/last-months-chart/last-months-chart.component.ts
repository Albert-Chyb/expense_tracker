import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
	selector: 'last-months-chart',
	templateUrl: './last-months-chart.component.html',
	styleUrls: ['./last-months-chart.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LastMonthsChartComponent {
	constructor() {}

	private _data: number[][] = [[], []];

	@Input('data')
	set data(value: number[][]) {
		this._validateData(value);

		this._data = value;
	}
	get data(): number[][] {
		return this._data;
	}

	get options() {
		return {
			tooltip: {},
			yAxis: {},
			xAxis: {
				data: new Array(6).fill(''),
			},
			series: [
				{
					name: 'Wydatki',
					data: this._outcomes,
					type: 'bar',
				},
				{
					name: 'Przychody',
					data: this._incomes,
					type: 'bar',
				},
			],
		};
	}

	private get _incomes(): number[] {
		return this.data[0];
	}

	private get _outcomes(): number[] {
		return this.data[1];
	}

	private _validateData(data: number[][]) {
		if (data.length !== 2)
			throw new Error('The data array should have two members.');
		if (data[0].length !== data[1].length)
			throw new Error('The arrays inside data should have equal lengths.');
	}
}
