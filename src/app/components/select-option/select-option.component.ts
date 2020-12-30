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
	constructor(public readonly elementRef: ElementRef<HTMLElement>) {}

	/** Text inside of the option */
	get displayValue() {
		return this._elementRef.nativeElement.textContent;
	}

	/** Indicates if the option is currently selected. */
	isSelected: boolean = false;

	/** Indicates if the option is currently focused. */
	isFocused: boolean = false;

	/** Id of the option */
	id: string = `select-option-${window['uniqueNumber']++}`;

	/** Value of the option */
	@Input('value') value: string = '';

	/** Fired when clicked on the option */
	@Output('onChoose') onChoose = new EventEmitter<SelectOptionComponent>();

	/** Implementation logic, do not use. */
	@ViewChild('option', { static: true }) _elementRef: ElementRef<HTMLElement>;

	private _onClick() {
		this.onChoose.emit(this);
	}
}
