import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ThemesService } from './../../../services/themes/themes.service';

@Component({
	selector: 'dashboard-current-week-chart',
	templateUrl: './current-week-chart.component.html',
	styleUrls: ['./current-week-chart.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrentWeekChartComponent {
	constructor(private readonly _theme: ThemesService) {}

	private _data: number[] = [];

	ngOnInit() {}

	@Input('data')
	set data(value: number[]) {
		this._validateData(value);
		this._data = value;
	}
	get data(): number[] {
		return this._data;
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
					data: this.data,
				},
				{
					name: 'Średnie wydatki',
					type: 'line',
					data: new Array(7).fill(this._average(this.data)),
				},
			],
		};
	}

	get theme() {
		return this._theme.currentThemeName;
	}

	private _average(numbers: number[]) {
		return numbers.reduce((prev, curr) => (prev += curr), 0) / numbers.length;
	}

	private _validateData(data: number[]) {
		if (data.length !== 7)
			throw new Error('The data array should have length of 7.');
	}
}
