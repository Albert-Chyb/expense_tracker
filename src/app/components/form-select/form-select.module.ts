import { SelectOptionComponent } from './select-option/select-option.component';
import { SelectComponent } from './select/select.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
	declarations: [SelectComponent, SelectOptionComponent],
	imports: [CommonModule],
	exports: [SelectComponent, SelectOptionComponent],
})
export class FormSelectModule {}
