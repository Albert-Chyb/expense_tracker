import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

type TProgressSpinnerMode = 'progress' | 'infinity';

@Component({
	selector: 'progress-spinner',
	templateUrl: './progress-spinner.component.html',
	styleUrls: ['./progress-spinner.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'[style.width]': `diagonal + 'px'`,
	},
})
export class ProgressSpinnerComponent {
	private _radius = 45;

	@Input('mode') mode: TProgressSpinnerMode = 'infinity';
	@Input('max') maxValue = 100;
	@Input('diagonal') diagonal: number = 120;
	@Input('value') value = 45;

	@Input('radius')
	set radius(value: number) {
		this._radius = ~~this._limitToRange(value, 0, 50);
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

	private _limitToRange(value: number, min: number, max: number) {
		return Math.max(Math.min(value, max), min);
	}
}
