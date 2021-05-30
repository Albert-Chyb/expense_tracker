import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

type TProgressSpinnerMode = 'progress' | 'infinity';

// TODO: In progress mode, add background color for the unloaded part.

@Component({
	selector: 'progress-spinner',
	templateUrl: './progress-spinner.component.html',
	styleUrls: ['./progress-spinner.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressSpinnerComponent {
	private _radius = 45;
	private _value = 0;

	@Input('mode') mode: TProgressSpinnerMode = 'infinity';
	@Input('max') maxValue = 100;

	@Input('value')
	set value(newValue: number) {
		this._value = newValue;
	}
	get value() {
		return this._value;
	}

	@Input('radius')
	set radius(value: number) {
		this._radius = ~~Math.max(Math.min(value, 50), 0);
	}
	get radius() {
		return this._radius;
	}

	get strokeWidth(): number {
		return (50 - this.radius) * 2;
	}

	get strokeDasharray(): number {
		return ~~(2 * Math.PI * this.radius);
	}

	get strokeDashoffset(): number {
		let offset: number;

		if (this.mode === 'infinity') {
			offset = this.strokeDasharray * 0.25;
		} else {
			offset =
				this.strokeDasharray * Math.min(1 - this.value / this.maxValue, 1);
		}

		return Math.abs(~~offset);
	}
}
