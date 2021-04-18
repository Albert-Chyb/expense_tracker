import {
	AfterContentInit,
	ChangeDetectionStrategy,
	Component,
	ContentChildren,
	ElementRef,
	Input,
	QueryList,
	Renderer2,
	ViewChild,
} from '@angular/core';

import { SwipeActionsCancelSideEffects } from './cancel-side-effects.directive';
import {
	SwipeActionLeftDirective,
	SwipeActionRightDirective,
} from './swipe-action.directive';

@Component({
	selector: 'swipe-actions',
	templateUrl: './swipe-actions.component.html',
	styleUrls: ['./swipe-actions.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SwipeActionsComponent implements AfterContentInit {
	constructor(private readonly _renderer: Renderer2) {}

	/** How far front element can be moved away from each side. (In %, relative to the container) */
	@Input('threshold') threshold = 0.3;
	/** The distance after which front will automatically move to the max distance. (In %, relative to the threshold) */
	@Input('snapAfter') snapThreshold = 0.15;

	@ViewChild('front') frontEl: ElementRef<HTMLElement>;
	@ViewChild('container') containerEl: ElementRef<HTMLElement>;

	@ContentChildren(SwipeActionsCancelSideEffects, { descendants: true })
	sideEffectsElements: QueryList<SwipeActionsCancelSideEffects>;

	@ContentChildren(SwipeActionLeftDirective)
	leftActions: QueryList<SwipeActionLeftDirective>;

	@ContentChildren(SwipeActionRightDirective)
	rightActions: QueryList<SwipeActionRightDirective>;

	/** Distance from the left side. Does not include change in position while is dragged (In px) */
	private _distance = 0;
	/** Max distance that front element can be moved by. (In px) */
	private _maxDistance: number;
	/** Width of the front element */
	private _width: number;
	/** If front element is during animation */
	private _isTransitioning = false;
	/** If a click was preceded with a pan event. */
	private _ghostClick = false;

	onPanStart() {
		const { width } = this._containerEl.getBoundingClientRect();
		this._width = width;
		this._maxDistance = width * this.threshold;
	}

	onPanMove($event: HammerInput) {
		if ($event.isFinal) {
			this._ghostClick = true;
		}
		const { deltaX } = $event;
		const distance = deltaX + this._distance;
		const side = this._getSide(distance);

		if (!this._isInRange(distance)) return;

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
			return this._animateTranslate(this._maxDistance * newSide);
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
			this._animateTranslate(distance);
		}
	}

	snap(side: 'left' | 'right') {
		const direction = side === 'left' ? 1 : -1;
		const distance = this._maxDistance * direction;

		this._animateTranslate(distance);
	}

	close() {
		this._animateTranslate(0);
	}

	ngAfterContentInit() {
		this.sideEffectsElements?.forEach(el => {
			el.swipeActionsRef = this;
			el.onClick.subscribe(() => (this._ghostClick = false));
		});

		this.rightActions?.forEach((action, index, { length }) => {
			action.position = length - index;
			action.move(5);
		});

		this.leftActions?.forEach((action, index, { length }) => {
			action.position = index + 1;
			action.zIndex = length - index;
			action.move(-5);
		});
	}

	/** Informs if any actions are currently visible. */
	get isOpened() {
		return Math.abs(this._distance) > 0 || this._isTransitioning;
	}

	/** If a click was preceded with a pan event. */
	get ghostClick() {
		return this._ghostClick;
	}

	/** Returns 1 or -1 depending on which side the distance describes. */
	private _getSide(distance: number): number {
		return distance > 0 ? 1 : -1;
	}

	private _getSideName(distance: number): 'left' | 'right' {
		return distance > 0 ? 'left' : 'right';
	}

	/** Moves the front element to the given distance with an animation. */
	private async _animateTranslate(distance: number) {
		if (!this._isInRange(distance)) return;

		const snapClass = 'swipe-actions__front--is-snapping';

		this._isTransitioning = true;
		this._frontEl.classList.add(snapClass);
		this.leftActions.forEach(action => action.enableAnimation());
		this.rightActions.forEach(action => action.enableAnimation());

		this._setTranslate(distance);
		this._distance = distance;

		return new Promise<void>(resolve => {
			setTimeout(() => {
				this._frontEl.classList.remove(snapClass);
				this.leftActions.forEach(action => action.disableAnimation());
				this.rightActions.forEach(action => action.disableAnimation());
				this._isTransitioning = false;
				resolve();
			}, 200);
		});
	}

	private _easing(x: number) {
		return x;
	}

	/** Sets translateX() property on the front element. */
	private _setTranslate(distance: number) {
		const moveByFront = (distance / this._width) * 100;
		const moveByActions = (distance / this._maxDistance) * 100;

		this._renderer.setStyle(
			this._frontEl,
			'transform',
			`translateX(${moveByFront}%)`
		);

		// We continue to move actions after they are out of view, because browser seems to throttle events when they occur very quickly.
		// For this reason a part of actions might still be visible after quick pan.
		// 20% percent seems to fix this issue.
		if (moveByActions > -20) {
			this.leftActions.forEach(action => action.move(moveByActions));
		}

		if (moveByActions < 20) {
			this.rightActions.forEach(action => action.move(moveByActions));
		}

		if (moveByActions === 0) {
			// Sometimes CSS rounds pixels up, and it cosses actions to be a bit visible (like 1 px).
			// This is why when front element is not moved at all, we move all actions a little bit further.
			this.leftActions.forEach(action => action.move(-5));
			this.rightActions.forEach(action => action.move(5));
		}
	}

	/** Checks if the given distance is within allowed range. */
	private _isInRange(distance: number) {
		return (
			distance >= this._maxLeftDistance && distance <= this._maxRightDistance
		);
	}

	/** Informs if actions on the left side can be shown. */
	get hasLeftActions() {
		return !!this.leftActions.length;
	}

	/** Informs if actions on the right side can be shown. */
	get hasRightActions() {
		return !!this.rightActions.length;
	}

	/** Max distance that element can be moved from left side to the left direction. */
	private get _maxLeftDistance() {
		return this.hasRightActions ? -this._maxDistance : 0;
	}

	/** Max distance that element can be moved from left side to the right direction. */
	private get _maxRightDistance() {
		return this.hasLeftActions ? this._maxDistance : 0;
	}

	private get _frontEl(): HTMLElement {
		return this.frontEl.nativeElement;
	}

	private get _containerEl(): HTMLElement {
		return this.containerEl.nativeElement;
	}
}
