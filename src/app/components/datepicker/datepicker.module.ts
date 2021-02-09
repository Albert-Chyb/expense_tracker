import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatepickerComponent } from './datepicker/datepicker.component';

@NgModule({
	declarations: [DatepickerComponent],
	imports: [CommonModule],
	exports: [DatepickerComponent],
})
export class DatepickerModule {}
