import { IClosedPeriod } from '../../../common/models/period';
import { EChartsOption } from 'echarts';
import {
	ChangeDetectionStrategy,
	Component,
	Inject,
	Input,
	LOCALE_ID,
} from '@angular/core';
import { DatePipe } from '@angular/common';

/**
 * Renders a chart that visualizes received periods.
 */
@Component({
	selector: 'periods-chart',
	templateUrl: './periods-chart.component.html',
	styleUrls: ['./periods-chart.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeriodsChartComponent {
	constructor(@Inject(LOCALE_ID) private readonly _locale: string) {}

	private _data: number[][] = [[], []];
	private readonly _datePipe = new DatePipe(this._locale);

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

	private get _incomes(): number[] {
		return this._data[0];
	}

	private get _expenses(): number[] {
		return this._data[1];
	}

	private get _labels(): string[] {
		return this._data[2] as any;
	}

	/** Transforms periods into chart data type. */
	private _transformPeriods(periods: IClosedPeriod[]) {
		return periods.reduce(
			(prev: any[][], period) => {
				const { incomes, outcomes, date } = period;

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
