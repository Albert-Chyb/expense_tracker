import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	DatepickerComponent,
	DatepickerInputDirective,
	DatepickerManager,
	TriggerDatepickerDirective,
} from './datepicker/datepicker.component';

@NgModule({
	declarations: [
		DatepickerComponent,
		DatepickerInputDirective,
		DatepickerManager,
		TriggerDatepickerDirective,
	],
	imports: [CommonModule],
	exports: [
		DatepickerComponent,
		DatepickerInputDirective,
		DatepickerManager,
		TriggerDatepickerDirective,
	],
})
export class DatepickerModule {}
