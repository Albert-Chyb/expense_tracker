import {
	Component,
	ElementRef,
	EventEmitter,
	Input,
	Output,
	ViewChild,
} from '@angular/core';

@Component({
	selector: 'select-option',
	templateUrl: './select-option.component.html',
	styleUrls: ['./select-option.component.scss'],
	host: {
		'(click)': '_onClick()',
		'[id]': 'id',
		'[attr.aria-selected]': 'isSelected',
		role: 'option',
	},
})
export class SelectOptionComponent {
	constructor(private readonly _hostRef: ElementRef<HTMLElement>) {}

	/** Text inside of the option */
	get displayValue() {
		return this._elementRef.nativeElement.textContent;
	}

	/** Indicates if the option is selected. */
	private _isSelected: boolean = false;

	/** Indicates if the option is focused. */
	private _isFocused: boolean = false;

	/** Id of the option */
	id: string = `select-option-${window['uniqueNumber']++}`;

	/** Value of the option */
	@Input('value') value: string | number = '';

	/** Fired when clicked on the option */
	@Output('onChoose') onChoose = new EventEmitter<SelectOptionComponent>();

	/** Implementation logic, do not use. */
	@ViewChild('option', { static: true }) _elementRef: ElementRef<HTMLElement>;

	/** Marks option as focused */
	focus() {
		this._isFocused = true;
	}

	/** Marks options as blurred */
	blur() {
		this._isFocused = false;
	}

	/** Marks option as selected */
	select() {
		this._isSelected = true;
	}

	/** Marks option as unselected */
	unselect() {
		this._isSelected = false;
	}

	/** Scrolls option into the view */
	scrollIntoView() {
		this._hostRef.nativeElement.scrollIntoView();
	}

	/** Indicates if the option is focused. */
	get isFocused() {
		return this._isFocused;
	}

	/** Indicates if the option is selected. */
	get isSelected() {
		return this._isSelected;
	}

	private _onClick() {
		this.onChoose.emit(this);
	}
}
