import { FormFieldLabelComponent } from './form-field-label/form-field-label.component';
import { FormFieldComponent } from './form-field/form-field.component';
import { FormFieldInputDirective } from './form-field-input.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
	declarations: [
		FormFieldInputDirective,
		FormFieldComponent,
		FormFieldLabelComponent,
	],
	imports: [CommonModule],
	exports: [
		FormFieldInputDirective,
		FormFieldComponent,
		FormFieldLabelComponent,
	],
})
export class FormFieldModule {}
