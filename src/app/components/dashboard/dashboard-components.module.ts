import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';

import { CurrentWeekChartComponent } from './current-week-chart/current-week-chart.component';
import { GroupedExpensesChartComponent } from './grouped-expenses-chart/grouped-expenses-chart.component';
import { PeriodsChartComponent } from './periods-chart/periods-chart.component';

@NgModule({
	declarations: [
		CurrentWeekChartComponent,
		GroupedExpensesChartComponent,
		PeriodsChartComponent,
	],
	imports: [CommonModule, NgxEchartsModule],
	exports: [
		CurrentWeekChartComponent,
		GroupedExpensesChartComponent,
		PeriodsChartComponent,
	],
})
export class DashboardComponentsModule {}
