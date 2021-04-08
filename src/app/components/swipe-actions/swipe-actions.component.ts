import {
	AfterContentInit,
	ChangeDetectionStrategy,
	Component,
	ContentChildren,
	Directive,
	ElementRef,
	HostListener,
	Input,
	QueryList,
	Renderer2,
	RendererStyleFlags2,
	ViewChild,
} from '@angular/core';

/**
 * When user stopped dragging the front element, the click event that was invoked by it, might trigger some actions.
 * (for instance routerLink might change the route). This is a helper directive that calls stopPropagation and preventDefault methods
 * on the event object. Make sure that element with this directive is a child of an element that triggers side effects.
 */
@Directive({ selector: '[cancel-side-effects]' })
export class SwipeActionsCancelSideEffects {
	@Input() swipeActionsRef: SwipeActionsComponent;

	@HostListener('click', ['$event']) preventSideEffects($event: MouseEvent) {
		if (this.swipeActionsRef.isOpened) {
			$event.stopPropagation();
			$event.preventDefault();
		}
	}
}

@Component({
	selector: 'swipe-actions',
	templateUrl: './swipe-actions.component.html',
	styleUrls: ['./swipe-actions.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SwipeActionsComponent implements AfterContentInit {
	constructor(private readonly _renderer: Renderer2) {}

	/** How far front element can be moved away from each side. (In %, relative to container) */
	@Input('threshold') threshold = 0.2;
	/** The distance after which front will automatically move to the max distance. (In %, relative to the threshold) */
	@Input('snap') snapThreshold = 0.15;

	@ViewChild('front') frontEl: ElementRef<HTMLElement>;
	@ViewChild('container') containerEl: ElementRef<HTMLElement>;
	@ContentChildren(SwipeActionsCancelSideEffects, { descendants: true })
	sideEffectsElements: QueryList<SwipeActionsCancelSideEffects>;

	// TODO: Content might have rounded corners, <- test it !

	/** Distance from the left side. Does not include change in position while is dragged (In px) */
	private _distance = 0;
	/** Max distance that front element can be moved by. (In px) */
	private _maxDistance: number;
	private _isTransitioning = false;

	onPanStart() {
		const { width } = this.containerEl.nativeElement.getBoundingClientRect();
		this._maxDistance = width * this.threshold;
		this._setSideWidth(this._maxDistance);
	}

	onPanMove($event: HammerInput) {
		const { deltaX } = $event;
		const distance = deltaX + this._distance;
		const side = this._getSide(distance);

		this._setTranslate(
			this._maxDistance *
				this._easing(Math.abs(distance) / this._maxDistance) *
				side
		);
	}

	onPanEnd($event: HammerInput) {
		let deltaX = $event.deltaX;
		let distance = this._distance;
		let newDistance = distance + deltaX;

		const isBeyondMaxDistance = Math.abs(newDistance) > this._maxDistance;
		const newSide = this._getSide(newDistance);
		const oldSide = this._getSide(distance);

		// If new distance is beyond max distance, the deltaX is not important.
		if (isBeyondMaxDistance) {
			return this._moveFront(this._maxDistance * newSide);
		}

		const changedSides = newSide !== oldSide;

		if (this.isOpened && changedSides) {
			deltaX = deltaX - distance * -1;
			newDistance = distance * -1 + deltaX;
			distance = 0;
		}

		// We are using deltaX to determine if user moved the front element with intention to toggle state.
		// If user moved front element by a small amount of pixels, we assume that he didn't want to toggle the current state.
		// Otherwise we should assume that he wants to toggle the current state.
		const shouldToggle =
			Math.abs(deltaX) > this._maxDistance * this.snapThreshold;

		if (shouldToggle) {
			// Should toggle its state.
			if (this.isOpened && !changedSides) {
				this.close();
			} else {
				this.snap(this._getSideName(newDistance));
			}
		} else {
			// Should remain it its state
			this._moveFront(distance);
		}
	}

	snap(side: 'left' | 'right') {
		const direction = side === 'left' ? 1 : -1;
		const distance = this._maxDistance * direction;

		this._moveFront(distance);
	}

	close() {
		this._moveFront(0);
	}

	ngAfterContentInit() {
		if (this.sideEffectsElements.length) {
			this.sideEffectsElements.forEach(el => (el.swipeActionsRef = this));
		}
	}

	get isOpened() {
		return Math.abs(this._distance) > 0 || this._isTransitioning;
	}

	private _getSide(distance: number): number {
		return distance > 0 ? 1 : -1;
	}

	private _getSideName(distance: number): 'left' | 'right' {
		return distance > 0 ? 'left' : 'right';
	}

	private async _moveFront(distance: number) {
		const snapClass = 'swipe-actions__front--is-snapping';

		this._isTransitioning = true;
		this._frontEl.classList.add(snapClass);
		this._setTranslate(distance);
		this._distance = distance;

		return new Promise<void>(resolve => {
			setTimeout(() => {
				this._frontEl.classList.remove(snapClass);
				this._isTransitioning = false;
				resolve();
			}, 200);
		});
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

	private _setSideWidth(width: number) {
		this._renderer.setStyle(
			this.containerEl.nativeElement,
			'--side-width',
			`${width}px`,
			RendererStyleFlags2.DashCase
		);
	}

	private get _frontEl(): HTMLElement {
		return this.frontEl.nativeElement;
	}
}
