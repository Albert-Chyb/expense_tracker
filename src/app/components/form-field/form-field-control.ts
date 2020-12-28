import { NgControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';

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
	onContainerClick(): void {}
}
