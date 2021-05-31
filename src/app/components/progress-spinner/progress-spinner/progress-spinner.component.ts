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

	/** Mode of the progress spinner. It can be either progress or infinity. */
	@Input('mode') mode: TProgressSpinnerMode = 'infinity';

	/** When spinner is in the progress mode, this value represents 100%. */
	@Input('max') maxValue = 100;

	/** When spinner is in the progress mode, this is the current progress of an action. */
	@Input('value') value = 45;

	/** Sets diagonal (width) of the spinner. */
	@Input('diagonal') diagonal: number = 120;

	/** Sets radius of the inner circle. The lesser the radius, the bolder the border width. */
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
		let offset: number = this.strokeDasharray;

		if (this.mode === 'infinity') {
			offset *= 0.25;
		} else {
			offset *= Math.min(1 - this.value / this.maxValue, 1);
		}

		return Math.abs(~~offset);
	}

	private _limitToRange(value: number, min: number, max: number) {
		return Math.max(Math.min(value, max), min);
	}
}
