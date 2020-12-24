import { merge, Subscription } from 'rxjs';
import { FormFieldInputDirective } from './../form-field-input.directive';
import {
	Component,
	OnInit,
	AfterContentInit,
	ContentChild,
	ChangeDetectorRef,
	HostListener,
	OnDestroy,
} from '@angular/core';

@Component({
	selector: 'form-field',
	templateUrl: './form-field.component.html',
	styleUrls: ['./form-field.component.scss'],
})
export class FormFieldComponent implements OnInit, AfterContentInit, OnDestroy {
	constructor(private readonly _changeDetector: ChangeDetectorRef) {}

	private readonly _subscriptions = new Subscription();

	@ContentChild(FormFieldInputDirective) input: FormFieldInputDirective;
	@HostListener('click') onClick() {
		this.input.onContainerClick();
	}

	ngOnInit(): void {
		this._changeDetector.detach();
	}

	ngOnDestroy(): void {
		this._subscriptions.unsubscribe();
	}

	ngAfterContentInit() {
		this._subscriptions.add(
			merge(
				this.input.ngControl.statusChanges,
				this.input.onStateChange
			).subscribe(this._onChildStateChange.bind(this))
		);

		this._changeDetector.detectChanges();
	}

	get shouldLabelFloat(): boolean {
		return this.input.shouldLabelFloat;
	}

	/** Should be called whenever change detection is required */
	private _onChildStateChange() {
		this._changeDetector.detectChanges();
	}

	get isValid() {
		return this.input.ngControl.valid;
	}

	get isInvalid() {
		return this.input.ngControl.invalid;
	}

	get isTouched() {
		return this.input.ngControl.touched;
	}
}
