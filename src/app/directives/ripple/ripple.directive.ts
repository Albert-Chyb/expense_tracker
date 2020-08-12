import {
	Directive,
	HostListener,
	HostBinding,
	ElementRef,
} from '@angular/core';

@Directive({
	selector: '[ripple], .btn:not(.no-ripple)',
})
export class RippleDirective {
	constructor(private readonly host: ElementRef<HTMLElement>) {}

	@HostListener('mousedown', ['$event']) positionRipple($event: MouseEvent) {
		if (this.isRippling) return null;
		const { offsetX, offsetY } = $event;

		this.host.nativeElement.style.setProperty('--ripple-x-pos', `${offsetX}px`);
		this.host.nativeElement.style.setProperty('--ripple-y-pos', `${offsetY}px`);

		this.isRippling = true;
		setTimeout(() => (this.isRippling = false), 500);
	}
	@HostBinding('class.ripple--is-rippling') isRippling: boolean = false;
	@HostBinding('class.ripple') isEnabled: boolean = true;
}
