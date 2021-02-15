import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	DatepickerComponent,
	DatepickerInputDirective,
} from './datepicker/datepicker.component';

@NgModule({
	declarations: [DatepickerComponent, DatepickerInputDirective],
	imports: [CommonModule],
	exports: [DatepickerComponent, DatepickerInputDirective],
})
export class DatepickerModule {}
