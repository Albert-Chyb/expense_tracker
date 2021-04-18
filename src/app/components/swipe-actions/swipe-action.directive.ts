import { Renderer2, ElementRef, Directive } from '@angular/core';

export abstract class SwipeAction {
	constructor(
		private readonly renderer: Renderer2,
		private readonly hostRef: ElementRef
	) {}

	private readonly _animationClass = 'swipe-actions__action--is-snapping';
	private _isAnimationEnabled = false;
	private _zIndex: number;
	private _position: number;
	protected _side: number;

	move(distance: number) {
		this.renderer.setStyle(
			this._el,
			'transform',
			`translateX(${(100 * this._side + distance) * this._position}%)`
		);
	}

	enableAnimation() {
		if (this._isAnimationEnabled) return;

		this.renderer.addClass(this._el, this._animationClass);
		this._isAnimationEnabled = true;
	}

	disableAnimation() {
		if (!this._isAnimationEnabled) return;

		this.renderer.removeClass(this._el, this._animationClass);
		this._isAnimationEnabled = false;
	}

	set zIndex(value: number) {
		this._zIndex = value;
		this.renderer.setStyle(this._el, 'z-index', value);
	}
	get zIndex() {
		return this._zIndex;
	}

	set position(value: number) {
		this._position = value;
	}
	get position() {
		return this._position;
	}

	get isAnimationEnabled() {
		return this._isAnimationEnabled;
	}

	private get _el() {
		return this.hostRef.nativeElement;
	}
}

@Directive({
	selector: 'button[swipe-action-left]',
	host: {
		class: 'swipe-actions__action',
	},
})
export class SwipeActionLeftDirective extends SwipeAction {
	constructor(renderer: Renderer2, hostRef: ElementRef) {
		super(renderer, hostRef);
		this._side = -1;
	}
}

@Directive({
	selector: 'button[swipe-action-right]',
	host: {
		class: 'swipe-actions__action',
	},
})
export class SwipeActionRightDirective extends SwipeAction {
	constructor(renderer: Renderer2, hostRef: ElementRef) {
		super(renderer, hostRef);
		this._side = 1;
	}
}
