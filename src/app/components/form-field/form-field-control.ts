import { NgControl } from '@angular/forms';
import { Subject, Observable } from 'rxjs';
export interface FormFieldControl {
	/** Indicates if label of the form field should be placed on top or in middle. */
	shouldLabelFloat: boolean;

	/** Current value of the control. */
	value: any;

	/** Exposed standard NgControl. */
	ngControl: NgControl;

	/** Triggers parent change detection whenever emits a value. */
	onStateChange: Observable<void>;

	/** Called every time when user clicked on the container */
	onContainerClick(): void;
}
