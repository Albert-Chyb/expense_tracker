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
import { OverlayModule } from '@angular/cdk/overlay';

@NgModule({
	declarations: [
		DatepickerComponent,
		DatepickerInputDirective,
		DatepickerManager,
		TriggerDatepickerDirective,
	],
	imports: [CommonModule, ButtonModule, RippleModule, OverlayModule],
	exports: [
		DatepickerComponent,
		DatepickerInputDirective,
		DatepickerManager,
		TriggerDatepickerDirective,
	],
})
export class DatepickerModule {}
