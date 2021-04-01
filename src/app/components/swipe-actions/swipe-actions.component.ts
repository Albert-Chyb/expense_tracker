import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	Directive,
	ElementRef,
	Input,
	Renderer2,
	ViewChild,
} from '@angular/core';

@Directive({
	selector: '[swipe-actions-front]',
})
export class SwipeActionsFrontDirective {}

@Component({
	selector: 'swipe-actions',
	templateUrl: './swipe-actions.component.html',
	styleUrls: ['./swipe-actions.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SwipeActionsComponent {
	constructor(
		private readonly _renderer: Renderer2,
		private readonly _changeDetector: ChangeDetectorRef
	) {}

	@Input('threshold') threshold = 0.2;
	@ViewChild('front') frontEl: ElementRef<HTMLElement>;

	private _lastDistance = 0;
	private _maxDistance: number;

	onPanStart($event: HammerInput) {
		const { width } = $event.target.getBoundingClientRect();
		this._maxDistance = width * this.threshold;
	}

	onPanMove($event: HammerInput) {
		const { deltaX } = $event;
		const distance = deltaX + this._lastDistance;
		if (Math.abs(distance) > this._maxDistance) return;
		const direction = distance > 0 ? 1 : -1;

		this._setTranslate(
			this._maxDistance *
				this._easing(Math.abs(distance) / this._maxDistance) *
				direction
		);
	}

	onPanEnd($event: HammerInput) {
		const lastDistance = this._lastDistance + $event.deltaX;

		if (Math.abs(lastDistance) > this._maxDistance) {
			const direction = lastDistance > 0 ? 1 : -1;

			this._lastDistance = this._maxDistance * direction;
		} else {
			this._lastDistance = lastDistance;
		}
	}

	private _easing(x: number) {
		return x * (2 - x);
	}

	private _setTranslate(value: number) {
		this._renderer.setStyle(this._el, 'transform', `translateX(${value}px)`);
	}

	private get _el(): HTMLElement {
		return this.frontEl.nativeElement;
	}
}
