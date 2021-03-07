import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { EChartsOption } from 'echarts';

@Component({
	selector: 'grouped-outcomes-chart',
	templateUrl: './grouped-outcomes-chart.component.html',
	styleUrls: ['./grouped-outcomes-chart.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupedOutcomesChartComponent {
	constructor() {}

	private _data: { value: number; name: string }[] = [];

	@Input('data')
	set data(value: { value: number; name: string }[]) {
		this._data = value;
	}
	get data(): { value: number; name: string }[] {
		return this._data;
	}

	get options(): EChartsOption {
		return {
			tooltip: {},
			series: [
				{
					name: 'Wydatki',
					data: this.data,
					type: 'pie',
					radius: ['40%', '70%'],
					label: {
						color: 'inherit',
					},
				},
			],
		};
	}
}
