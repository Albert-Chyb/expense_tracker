import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	DatepickerComponent,
	DatepickerManager,
	TriggerDatepickerDirective,
} from './datepicker/datepicker.component';
import { DatepickerInputDirective } from './datepicker-value-accessor';

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
