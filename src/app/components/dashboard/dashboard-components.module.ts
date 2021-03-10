import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';

import { CurrentWeekChartComponent } from './current-week-chart/current-week-chart.component';
import { GroupedOutcomesChartComponent } from './grouped-expenses-chart/grouped-outcomes-chart.component';
import { PeriodsChartComponent } from './periods-chart/periods-chart.component';

@NgModule({
	declarations: [
		CurrentWeekChartComponent,
		GroupedOutcomesChartComponent,
		PeriodsChartComponent,
	],
	imports: [CommonModule, NgxEchartsModule],
	exports: [
		CurrentWeekChartComponent,
		GroupedOutcomesChartComponent,
		PeriodsChartComponent,
	],
})
export class DashboardComponentsModule {}
