import {
	Directive,
	ElementRef,
	HostBinding,
	HostListener,
	OnInit,
	Renderer2,
	RendererStyleFlags2,
} from '@angular/core';

type RippleProperty = 'x' | 'y' | 'size' | 'duration';

@Directive({
	selector: '[ripple], .btn:not(.no-ripple), .ripple',
})
export class RippleDirective implements OnInit {
	constructor(
		private readonly _host: ElementRef<HTMLElement>,
		private readonly _renderer: Renderer2
	) {}

	private isRippling: boolean = false;
	private readonly ripplingClass = 'ripple--is-rippling';
	private readonly animationDuration = 500;

	@HostListener('mousedown', ['$event']) positionRipple($event: MouseEvent) {
		if (this.isRippling) return null;
		const { offsetX, offsetY } = $event;
		const { nativeElement } = this._host;
		const { width, height } = this._host.nativeElement.getBoundingClientRect();
		const rippleSize = width > height ? width : height;

		this.setRippleProperty('x', `${offsetX - rippleSize / 2}px`);
		this.setRippleProperty('y', `${offsetY - rippleSize / 2}px`);
		this.setRippleProperty('size', `${rippleSize}px`);

		this._renderer.addClass(nativeElement, this.ripplingClass);

		setTimeout(() => {
			this._renderer.removeClass(nativeElement, this.ripplingClass);
			this.isRippling = false;
		}, this.animationDuration);
	}
	@HostBinding('class.ripple') isEnabled: boolean = true;

	ngOnInit(): void {
		this.setRippleProperty('duration', `${this.animationDuration}ms`);
	}

	private setRippleProperty(varName: RippleProperty, value: string): void {
		this._renderer.setStyle(
			this._host.nativeElement,
			`--ripple-${varName}`,
			value,
			RendererStyleFlags2.DashCase
		);
	}
}
