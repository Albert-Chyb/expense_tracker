import {
	Directive,
	ElementRef,
	HostBinding,
	HostListener,
	OnInit,
	Renderer2,
	RendererStyleFlags2,
} from '@angular/core';

type RippleProperty = 'x' | 'y' | 'size' | 'duration' | 'color';

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
		this.isRippling = true;
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
		this.setRippleProperty(
			'color',
			this.idealTextColor(
				getComputedStyle(this._host.nativeElement).backgroundColor
			)
		);
	}

	private setRippleProperty(varName: RippleProperty, value: string): void {
		this._renderer.setStyle(
			this._host.nativeElement,
			`--ripple-${varName}`,
			value,
			RendererStyleFlags2.DashCase
		);
	}

	private idealTextColor(bgColor) {
		const nThreshold = 105;
		const components = this.getRGBComponents(bgColor);
		const bgDelta =
			components.R * 0.299 + components.G * 0.587 + components.B * 0.114;

		return 255 - bgDelta < nThreshold ? '#000000' : '#ffffff';
	}

	private getRGBComponents(color) {
		const r = color.substring(1, 3);
		const g = color.substring(3, 5);
		const b = color.substring(5, 7);

		return {
			R: parseInt(r, 16),
			G: parseInt(g, 16),
			B: parseInt(b, 16),
		};
	}
}
