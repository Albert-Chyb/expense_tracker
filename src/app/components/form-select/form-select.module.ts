import { SelectOptionComponent } from './select-option/select-option.component';
import {
	SelectComponent,
	SelectComponentControlDirective,
} from './select/select.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
	declarations: [
		SelectComponent,
		SelectOptionComponent,
		SelectComponentControlDirective,
	],
	imports: [CommonModule],
	exports: [
		SelectComponent,
		SelectOptionComponent,
		SelectComponentControlDirective,
	],
})
export class FormSelectModule {}
