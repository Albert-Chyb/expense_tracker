import {
	FORM_FIELD_ERRORS,
	Errors,
} from './components/form-field/form-field-errors.service';
import { NgModule } from '@angular/core';

const formFieldErrors: Errors = new Map([
	['required', 'To pole jest wymagane.'],
	['blackList', 'Wpisana wartość nie jest dozwolona.'],
	['maxlength', 'Wpisany text jest za długi.'],
	['isNaN', 'Wpisana wartość nie jest liczbą.'],
	[
		'invalidFontAwesomeTemplate',
		'Wpisana wartość nie jest poprawnym schematem ikony.',
	],
	['whiteList', 'Wpisana wartość nie jest dozwolona.'],
	['invalidDate', 'Wpisana wartość nie jest datą.'],
	['dateNotInRange', 'Wpisana data nie jest w dozwolonym przedziale.'],
]);

@NgModule({
	providers: [
		{
			provide: FORM_FIELD_ERRORS,
			useValue: formFieldErrors,
		},
	],
})
export class FormFieldErrorsModule {}
