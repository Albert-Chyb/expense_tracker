import { AbstractControl } from '@angular/forms';

/**
 * Defines when errors are displayed to the user.
 * If match() method returns true errors will not be rendered.
 */

export interface IStateMatcher {
	match(control: AbstractControl): boolean;
}

/**
 * Default state matcher for form errors component.
 */

export class StateMatcher implements IStateMatcher {
	match(control: AbstractControl): boolean {
		return control.valid || control.untouched;
	}
}

export class FileBtnStateMatcher implements IStateMatcher {
	match(control: AbstractControl) {
		return control.valid;
	}
}
