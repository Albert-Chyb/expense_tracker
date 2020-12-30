import { transition, trigger, useAnimation } from '@angular/animations';
import {
	AfterContentInit,
	Component,
	ContentChildren,
	Directive,
	forwardRef,
	HostListener,
	Injector,
	OnDestroy,
	OnInit,
	QueryList,
} from '@angular/core';
import {
	ControlValueAccessor,
	NG_VALUE_ACCESSOR,
	NgControl,
} from '@angular/forms';
import { Subject, Subscription } from 'rxjs';

import { fadeIn, fadeOut } from './../../animations';
import {
	FormFieldControl,
	IFormFieldRefs,
} from './../form-field/form-field-control';
import { SelectOptionComponent } from './../select-option/select-option.component';

@Component({
	selector: 'app-select',
	templateUrl: './select.component.html',
	styleUrls: ['./select.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => SelectComponent),
			multi: true,
		},
	],
	animations: [
		trigger('dropdownAnimation', [
			transition(':enter', useAnimation(fadeIn)),
			transition(':leave', useAnimation(fadeOut)),
		]),
	],
})
export class SelectComponent
	implements
		OnInit,
		FormFieldControl,
		ControlValueAccessor,
		AfterContentInit,
		OnDestroy {
	constructor(private readonly _injector: Injector) {}

	@ContentChildren(SelectOptionComponent)
	options: QueryList<SelectOptionComponent>;
	currentOption: SelectOptionComponent;

	private readonly _optionsSubscriptions = new Subscription();
	private _isOpened = false;
	private _currentlyFocusedOption: SelectOptionComponent;
	private _onChange: (value: string) => void;
	private _onTouched: () => void;
	private _isDisabled: boolean;
	private _initialValue: string;
	private _labelId: string;

	/** Id of the element that displays currently selected option. Mainly for aria attributes. */
	private _selectedOptionElID: string = `select-btn-${window[
		'uniqueNumber'
	]++}`;

	// ControlValueAccessor implementation
	writeValue(value: any): void {
		/*
			We can only select an option in AfterContentInit lifecycle hook.
			It would be too early to choose it here, so we store passed value in a variable
			and let ngAfterContentInit function handle this value later. 
		*/
		this._initialValue = value;
	}

	registerOnChange(fn: any): void {
		this._onChange = fn;
	}

	registerOnTouched(fn: any): void {
		this._onTouched = fn;
	}

	setDisabledState?(isDisabled: boolean): void {
		this._isDisabled = isDisabled;
	}
	// ^^^ ControlValueAccessor implementation ^^^

	// FormFieldControl implementation
	get shouldLabelFloat(): boolean {
		return this._isOpened || this.currentOption.value !== '';
	}

	get isFocused(): boolean {
		return this._isOpened;
	}

	onStateChange = new Subject<void>();

	ngControl: NgControl;

	onContainerClick(): void {
		this.toggle();
	}

	registerFormFieldRefs(refs: IFormFieldRefs) {
		this._labelId = refs.label.id;
	}
	// ^^^ FormFieldControl implementation ^^^

	/** Opens select dropdown */
	open() {
		if (!this._isOpened) {
			this._isOpened = true;
			this.focusOption(this.currentOption);
			this.onStateChange.next();
		}
	}

	/** Closes select dropdown */
	@HostListener('document:keydown.escape')
	close() {
		if (this._isOpened) {
			this._isOpened = false;
			this._currentlyFocusedOption.isFocused = false;
			this.onStateChange.next();
		}
	}

	/** Toggles select dropdown */
	toggle() {
		this._isOpened ? this.close() : this.open();
	}

	/** Focuses next option relative to the currently focused/selected option */
	@HostListener('document:keydown.arrowDown', ['$event'])
	focusNextOption($event: KeyboardEvent) {
		if (!this._isOpened) return;
		$event.preventDefault();

		this.moveFocus('down');
	}

	/** Focuses next option relative to the currently focused/selected option */
	@HostListener('document:keydown.arrowUp', ['$event'])
	focusPrevOption($event: KeyboardEvent) {
		if (!this._isOpened) return;
		$event.preventDefault();

		this.moveFocus('up');
	}

	@HostListener('document:keydown.home', ['$event'])
	focusFirstOption($event: KeyboardEvent) {
		if (!this._isOpened) return;
		$event.preventDefault();

		this.focusOption(this.options.first);
	}

	@HostListener('document:keydown.end', ['$event'])
	focusLastOption($event: KeyboardEvent) {
		if (!this._isOpened) return;
		$event.preventDefault();

		this.focusOption(this.options.last);
	}

	/** Selects currently focused option. */
	@HostListener('document:keydown.enter', ['$event'])
	chooseCurrentlyFocusedOption($event: KeyboardEvent) {
		if (!this._isOpened) return;
		$event.preventDefault();

		this.choose(this._currentlyFocusedOption);
		this.close();
	}

	/**
	 * Moves focus onto the next option in desired direction based on the currently focused option.
	 * @param direction Direction of the movement
	 */
	moveFocus(direction: 'up' | 'down') {
		const directionModifier = direction === 'up' ? -1 : 1;
		const optionsArray = this.options.toArray();
		const currentOptionIndex: number = optionsArray.indexOf(
			this._currentlyFocusedOption
		);
		const nextOptionIndex: number = currentOptionIndex + 1 * directionModifier;
		const canMoveFocus: boolean =
			direction === 'up'
				? nextOptionIndex >= 0
				: nextOptionIndex < this.options.length;

		if (canMoveFocus) this.focusOption(optionsArray[nextOptionIndex]);
	}

	/**
	 * Focuses the option and scrolls it into the view.
	 * @param newFocusedOption Option to be marked as focused.
	 */
	private focusOption(newFocusedOption: SelectOptionComponent) {
		if (this._currentlyFocusedOption)
			this._currentlyFocusedOption.isFocused = false;
		this._currentlyFocusedOption = newFocusedOption;
		this._currentlyFocusedOption.isFocused = true;
		this._currentlyFocusedOption.elementRef.nativeElement.scrollIntoView();
	}

	/**
	 * Chooses option.
	 * @param chosenOption Chosen option or its value.
	 */
	choose(chosenOption: SelectOptionComponent | string) {
		if (this.currentOption) {
			this.currentOption.isSelected = false;
			this._onTouched();
		}

		if (chosenOption instanceof SelectOptionComponent) {
			this.currentOption = chosenOption;
		} else if (typeof chosenOption === 'string') {
			const foundOption = this.options.find(
				option => option.value === chosenOption
			);

			if (!foundOption)
				throw new Error(
					`Option with given value (${chosenOption}) could not be found.`
				);

			this.currentOption = foundOption;
		}

		this.currentOption.isSelected = true;
		this._onChange(this.currentOption.value);
	}

	ngOnInit(): void {
		this.ngControl = this._injector.get(NgControl);
	}

	ngOnDestroy() {
		this._optionsSubscriptions.unsubscribe();
	}

	ngAfterContentInit() {
		this._bindListenersToOptions();

		// If we got specific value from form control we use as first option.
		this.choose(this._initialValue || this._determineFirstOption());
	}

	/** Unique ID for the element that displays currently selected option. */
	get selectedOptionElID(): string {
		return this._selectedOptionElID;
	}

	/** Indicates if select dropdown is opened. */
	get isOpened(): boolean {
		return this._isOpened;
	}

	/** Id of the form field label. */
	get labelId(): string {
		return this._labelId;
	}

	/**
	 * Determines which option should be displayed by default.
	 *
	 * Firstly an option without value has priority.
	 * If no such option is found then display first option from all of them.
	 */
	private _determineFirstOption() {
		let placeholderOption = this.options.find(option => option.value === '');
		let option: SelectOptionComponent = placeholderOption || this.options.first;

		return option;
	}

	/**
	 * Called when user clicked an option.
	 * @param chosenOption Option that was chose by user.
	 */
	private _onOptionChoose(chosenOption: SelectOptionComponent) {
		this.choose(chosenOption);
	}

	/** Called when there is a change in an option. */
	private _onOptionChange() {
		// Rebinding helps with cached data.
		this._bindListenersToOptions();
		this.onStateChange.next();
	}

	/** Binds methods to options. */
	private _bindListenersToOptions() {
		// Bind method to onChoose event.
		this.options.forEach(option =>
			this._optionsSubscriptions.add(
				option.onChoose.subscribe(this._onOptionChoose.bind(this))
			)
		);

		// Bind method to run every time there is a change in an option.
		this._optionsSubscriptions.add(
			this.options.changes.subscribe(this._onOptionChange.bind(this))
		);
	}
}

/** Directive helps with selecting it in form field with ContentChild decorator */
@Directive({
	selector: 'app-select',
	providers: [
		{
			provide: FormFieldControl,
			useExisting: SelectComponent,
		},
	],
})
export class SelectComponentControlDirective {}
