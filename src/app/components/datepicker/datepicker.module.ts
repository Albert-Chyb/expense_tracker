import { RippleModule } from './../ripple/ripple.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ButtonModule } from './../buttons/button.module';
import { DatepickerInputDirective } from './datepicker-value-accessor';
import {
	DatepickerComponent,
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
	imports: [CommonModule, ButtonModule, RippleModule],
	exports: [
		DatepickerComponent,
		DatepickerInputDirective,
		DatepickerManager,
		TriggerDatepickerDirective,
	],
})
export class DatepickerModule {}
