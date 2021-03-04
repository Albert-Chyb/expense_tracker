import { ChangeDetectorRef, Directive, ElementRef, Input } from '@angular/core';
import {
	IRippleConfig,
	IRipplePositioningStrategy,
	IRippleProperty,
	RippleCenterPositioningStrategy,
	RippleDynamicPositioningStrategy,
	RipplePositioningStrategy,
	RipplePositioningStrategyName,
} from './ripple.models';

/**
 * Gives element ripple every time user clicks on it.
 * You should be aware of a few things that may break your styles:
 * 1. It uses ::before pseudo element
 * 2. It sets position to relative
 * 3. It sets overflow to hidden
 *
 * If those properties somehow collides with your styles, consider wrapping it
 * in a div, and attach the directive to it.
 */
@Directive({
	selector: '[ripple], [appButton]',
	host: {
		class: 'ripple',
		'(mousedown)': '_onHostClick($event)',
		'[class.ripple--rippling]': '_isRippling',
		'[style]': '_cssVariables',
	},
})
export class Ripple {
	constructor(
		private readonly _hostRef: ElementRef<HTMLElement>,
		private readonly _changeDetector: ChangeDetectorRef
	) {}

	/** The duration of the ripple animation. */
	private _duration = 300;

	/** Indicates if the ripple animation is currently playing. */
	private _isRippling = false;

	/** Object with css variables as keys. */
	private _cssVariables = {
		'--ripple-color': '#FFF',
		'--ripple-duration': `${this._duration}ms`,
		'--ripple-x': '0px',
		'--ripple-y': '0px',
		'--ripple-size': '50px',
	};

	/**
	 * How position of the ripple is calculated.
	 * If it's set to dynamic, the ripple is placed based on where user clicked.
	 * If it's set to center, the ripple always begins at the center of the element.
	 */
	@Input('position') position: RipplePositioningStrategyName = 'dynamic';

	/**
	 * Starts the ripple animation.
	 * @param config Information about ripple.
	 */
	ripple(config: IRippleConfig) {
		if (this._isRippling) return;
		const { x, y, size } = config;
		this._isRippling = true;

		this._setRippleProperties(
			{ name: 'x', value: `${x}px` },
			{ name: 'y', value: `${y}px` },
			{ name: 'size', value: `${size}px` },
			{ name: 'color', value: this._fontColor }
		);

		setTimeout(() => {
			this._isRippling = false;

			this._changeDetector.markForCheck();
		}, this._duration);
	}

	/**
	 * Changes CSS variables on the host element.
	 * @param props Properties to change.
	 */
	private _setRippleProperties(...props: IRippleProperty[]) {
		const changedVariables = props.reduce((prev, { name, value }) => {
			prev[`--ripple-${name}`] = value;
			return prev;
		}, {});

		this._cssVariables = Object.assign(
			{ ...this._cssVariables },
			changedVariables
		);
	}

	/**
	 * Called every time host element is clicked.
	 * It calculates position of the ripple as well as size of it from event object.
	 * @param $event MouseEvent
	 */
	private _onHostClick($event: MouseEvent) {
		const strategy: IRipplePositioningStrategy = this._getRipplePositioningStrategy(
			this.position
		) as any;
		const { x, y } = strategy.getPosition($event, this._el);
		const { width, height } = this._el.getBoundingClientRect();
		const size = Math.max(width, height);

		this.ripple({
			x: x - size / 2,
			y: y - size / 2,
			size,
		});
	}

	/**
	 * Returns associated with received name positioning strategy class
	 *
	 * @param strategy Name of a strategy
	 */
	private _getRipplePositioningStrategy(
		strategy: RipplePositioningStrategyName
	): RipplePositioningStrategy {
		switch (strategy) {
			case 'dynamic':
				return RippleDynamicPositioningStrategy;

			case 'center':
				return RippleCenterPositioningStrategy;

			default:
				throw new Error('RIPPLE: No positioning strategy with given name.');
		}
	}

	/** Host element. */
	private get _el(): HTMLElement {
		return this._hostRef.nativeElement;
	}

	private get _fontColor(): string {
		const { color } = getComputedStyle(this._el);
		return color;
	}
}
