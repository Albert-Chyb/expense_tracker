import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';

import { CurrentWeekChartComponent } from './current-week-chart/current-week-chart.component';
import { GroupedOutcomesChartComponent } from './grouped-outcomes-chart/grouped-outcomes-chart.component';
import { LastMonthsChartComponent } from './last-months-chart/last-months-chart.component';

@NgModule({
	declarations: [
		CurrentWeekChartComponent,
		GroupedOutcomesChartComponent,
		LastMonthsChartComponent,
	],
	imports: [CommonModule, NgxEchartsModule],
	exports: [
		CurrentWeekChartComponent,
		GroupedOutcomesChartComponent,
		LastMonthsChartComponent,
	],
})
export class DashboardComponentsModule {}
