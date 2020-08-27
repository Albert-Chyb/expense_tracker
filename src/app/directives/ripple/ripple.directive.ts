import {
	Directive,
	ElementRef,
	HostBinding,
	HostListener,
	Renderer2,
	RendererStyleFlags2,
} from '@angular/core';

@Directive({
	selector: '[ripple], .btn:not(.no-ripple), .ripple',
})
export class RippleDirective {
	constructor(
		private readonly _host: ElementRef<HTMLElement>,
		private readonly _renderer: Renderer2
	) {}

	private isRippling: boolean = false;
	private readonly ripplingClass = 'ripple--is-rippling';

	@HostListener('mousedown', ['$event']) positionRipple($event: MouseEvent) {
		if (this.isRippling) return null;
		const { offsetX, offsetY } = $event;
		const { nativeElement } = this._host;

		this._renderer.setStyle(
			nativeElement,
			'--ripple-x-pos',
			`${offsetX - 25}px`,
			RendererStyleFlags2.DashCase
		);
		this._renderer.setStyle(
			nativeElement,
			'--ripple-y-pos',
			`${offsetY - 25}px`,
			RendererStyleFlags2.DashCase
		);
		this._renderer.addClass(nativeElement, this.ripplingClass);

		setTimeout(() => {
			this._renderer.removeClass(nativeElement, this.ripplingClass);
			this.isRippling = false;
		}, 500);
	}
	@HostBinding('class.ripple') isEnabled: boolean = true;
}
