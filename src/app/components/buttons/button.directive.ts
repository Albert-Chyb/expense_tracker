import { Directive, HostBinding, Input } from '@angular/core';

import { Ripple } from './../ripple/ripple.directive';

export type ButtonType =
	| 'basic'
	| 'stroked'
	| 'filled'
	| 'fab'
	| 'icon'
	| 'none';
export type ButtonColor =
	| 'primary'
	| 'secondary'
	| 'danger'
	| 'success'
	| 'warning';

/** Which types of buttons should have ripple effect centered. */
export const BUTTONS_WITH_CENTERED_RIPPLE: ButtonType[] = ['icon'];

// !If [appButton] selector was changed/deleted,
// !this update should also be reflected on Ripple directive.
// So far I've not found a better method to attach ripple directive to every button,
// than adding the ButtonDirective selector directly to the Ripple directive.

@Directive({
	selector: '[appButton]',
})
export class ButtonDirective {
	constructor(private readonly _ripple: Ripple) {}

	private _type: ButtonType = 'filled';
	private _color: ButtonColor = '' as any;

	@Input('btnType')
	set type(value: ButtonType) {
		const shouldRippleBeCentered = BUTTONS_WITH_CENTERED_RIPPLE.includes(value);
		const ripplePosition = shouldRippleBeCentered ? 'center' : 'dynamic';
		this._type = value;
		this._ripple.position = ripplePosition;
	}
	get type() {
		return this._type;
	}

	@Input('btnColor')
	set color(value: ButtonColor) {
		this._color = value;
	}
	get color() {
		return this._color;
	}

	@HostBinding('class')
	private get _class(): string {
		const type = `${this.type}-btn`;
		const color = this._color ? `${this.type}-btn--${this._color}` : '';
		return type + ' ' + color;
	}
}
