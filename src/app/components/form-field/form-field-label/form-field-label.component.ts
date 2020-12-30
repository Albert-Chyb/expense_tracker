import { Component } from '@angular/core';

@Component({
	selector: 'form-field-label',
	templateUrl: './form-field-label.component.html',
	styleUrls: ['./form-field-label.component.scss'],
})
export class FormFieldLabelComponent {
	id: string = `form-field-label-${window['uniqueNumber']++}`;
}
