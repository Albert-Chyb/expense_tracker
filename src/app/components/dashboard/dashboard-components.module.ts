import { NgxEchartsModule } from 'ngx-echarts';
import { LastMonthsChartComponent } from './last-months-chart/last-months-chart.component';
import { GroupedOutcomesChartComponent } from './grouped-outcomes-chart/grouped-outcomes-chart.component';
import { CurrentWeekChartComponent } from './current-week-chart/current-week-chart.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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
