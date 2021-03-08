import { IClosedPeriod } from './../../../common/models/period';
import { EChartsOption } from 'echarts';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
	selector: 'last-months-chart',
	templateUrl: './last-months-chart.component.html',
	styleUrls: ['./last-months-chart.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LastMonthsChartComponent {
	private _data: number[][] = [[], []];
	private readonly _datePipe = new DatePipe(navigator.language);

	@Input('data')
	set data(value: IClosedPeriod[]) {
		this._data = this._transformPeriods(value);
	}

	get options(): EChartsOption {
		return {
			tooltip: {},
			yAxis: {},
			xAxis: {
				data: this._labels,
				axisLabel: {
					rotate: 45,
				},
			},
			series: [
				{
					name: 'Wydatki',
					data: this._expenses,
					type: 'bar',
				},
				{
					name: 'Przychody',
					data: this._incomes,
					type: 'bar',
				},
			],
			grid: {
				containLabel: true,
			},
		};
	}

	get hasData(): boolean {
		return this._data.every(a => a.length > 0);
	}

	private get _incomes(): number[] {
		return this._data[0];
	}

	private get _expenses(): number[] {
		return this._data[1];
	}

	private get _labels(): string[] {
		return this._data[2] as any;
	}

	private _transformPeriods(periods: IClosedPeriod[]) {
		return periods.reduce(
			(prev: any[][], curr) => {
				const { incomes, outcomes, date } = curr;

				prev[0].unshift(incomes);
				prev[1].unshift(outcomes);
				prev[2].unshift(
					`${this._datePipe.transform(
						date.start.toDate?.(),
						'MMM'
					)} - ${this._datePipe.transform(date.end.toDate?.(), 'MMM')}` as any
				);

				return prev;
			},
			[[] as number[], [] as number[], [] as string[]]
		);
	}
}
