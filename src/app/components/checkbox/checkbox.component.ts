import { Component, forwardRef, Input, Provider } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const valueAccessorProvider: Provider = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => CheckboxComponent),
	multi: true,
};

@Component({
	selector: 'checkbox',
	templateUrl: './checkbox.component.html',
	styleUrls: ['./checkbox.component.scss'],
	providers: [valueAccessorProvider],
})
export class CheckboxComponent implements ControlValueAccessor {
	@Input('labelId') id: string;
	@Input('checked') isChecked: boolean = false;
	@Input('disabled') isDisabled: boolean = false;

	private onChange: (value: boolean) => void;
	private onTouched: () => void;

	writeValue(isChecked: boolean): void {
		this.isChecked = isChecked;
	}

	registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}

	setDisabledState?(isDisabled: boolean): void {
		this.isDisabled = isDisabled;
	}

	check(isChecked: boolean) {
		if (this.isDisabled) return null;
		this.onChange(isChecked);
		this.onTouched();
	}
}
