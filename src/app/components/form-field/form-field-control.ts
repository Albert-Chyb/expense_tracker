import { FormFieldLabelComponent } from './form-field-label/form-field-label.component';
import { NgControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';

export interface IFormFieldRefs {
	label: FormFieldLabelComponent;
}

export abstract class FormFieldControl {
	/** Indicates if label of the form field should be placed on top or in middle. */
	shouldLabelFloat: boolean;

	/** Exposed standard NgControl. */
	ngControl: NgControl;

	/** Triggers parent change detection whenever emits a value. */
	onStateChange: Observable<void> | Subject<void>;

	/** Indicates if control is currently focused. */
	isFocused: boolean;

	/** Called every time when user clicked on the container */
	onContainerClick?(): void {}

	/**
	 * Allows to get reference to form fields component such as prefix or label.
	 */
	registerFormFieldRefs?(refs: IFormFieldRefs): void {}
}
