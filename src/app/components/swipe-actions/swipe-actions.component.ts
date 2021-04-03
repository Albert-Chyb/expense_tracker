import {
	ChangeDetectionStrategy,
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
	constructor(private readonly _renderer: Renderer2) {}

	/** How far front element can be moved away from each side. (In %, relative to container) */
	@Input('threshold') threshold = 0.2;
	/** The distance after which front will automatically move to the max distance. (In %, relative to the threshold) */
	@Input('snap') snapThreshold = 0.3;
	@ViewChild('front') frontEl: ElementRef<HTMLElement>;

	// TODO: Prevent default behavior and stop propagation when front element is moving.
	// TODO: Add snapping

	/** Distance from the left side. Does not include change in position while is dragged (In px) */
	private _distance = 0;
	/** Max distance that front element can be moved by. (In px) */
	private _maxDistance: number;

	onPanStart($event: HammerInput) {
		const { width } = $event.target.getBoundingClientRect();
		this._maxDistance = width * this.threshold;
	}

	onPanMove($event: HammerInput) {
		const { deltaX } = $event;
		const distance = deltaX + this._distance;
		const direction = distance > 0 ? 1 : -1;

		this._setTranslate(
			this._maxDistance *
				this._easing(Math.abs(distance) / this._maxDistance) *
				direction
		);
	}

	onPanEnd($event: HammerInput) {
		const newDistance = this._distance + $event.deltaX;
		const isBeyondSnap =
			Math.abs(newDistance) > this._maxDistance * this.snapThreshold;

		if (isBeyondSnap) {
			this.open(newDistance > 0 ? 'left' : 'right');
		} else {
			this.close();
		}
	}

	open(side: 'left' | 'right') {
		const direction = side === 'left' ? 1 : -1;
		const distance = this._maxDistance * direction;

		this._moveFront(distance);
	}

	close() {
		this._moveFront(0);
	}

	private _moveFront(distance: number) {
		const snapClass = 'swipe-actions__front--is-snapping';

		this._frontEl.classList.add(snapClass);
		this._setTranslate(distance);
		this._distance = distance;

		setTimeout(() => this._frontEl.classList.remove(snapClass), 200);
	}

	private _easing(x: number) {
		return x;
	}

	private _setTranslate(distance: number) {
		if (Math.abs(distance) > this._maxDistance) return;
		this._renderer.setStyle(
			this._frontEl,
			'transform',
			`translateX(${distance}px)`
		);
	}

	private get _frontEl(): HTMLElement {
		return this.frontEl.nativeElement;
	}
}
