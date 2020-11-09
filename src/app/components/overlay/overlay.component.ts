import {
	OverlayService,
	OVERLAY_SERVICE,
} from './../../services/overlay/overlay.service';
import { transition, trigger, useAnimation } from '@angular/animations';
import {
	Component,
	ComponentFactoryResolver,
	HostListener,
	Injector,
	ViewChild,
	ViewContainerRef,
} from '@angular/core';

import { fadeIn, fadeOut } from './../../animations';

@Component({
	templateUrl: './overlay.component.html',
	styleUrls: ['./overlay.component.scss'],
	animations: [
		trigger('overlayAnimation', [
			transition(':enter', useAnimation(fadeIn)),
			transition(':leave', useAnimation(fadeOut)),
		]),
	],
	host: {
		'[@overlayAnimation]': '',
	},
})
export class OverlayComponent {
	constructor(
		private readonly _componentFactory: ComponentFactoryResolver,
		private readonly _injector: Injector
	) {}

	private readonly _overlay: OverlayService = this._injector.get(
		OVERLAY_SERVICE
	);

	@ViewChild('overlayContent', { read: ViewContainerRef, static: true })
	content: ViewContainerRef;

	@HostListener('click', ['$event']) onClick($event: MouseEvent) {
		this._overlay.onClick.next($event);
	}

	insertComponent<T>(Component: any, injector?: Injector): T {
		const componentFactory = this._componentFactory.resolveComponentFactory<T>(
			Component
		);

		const componentRef = this.content.createComponent(
			componentFactory,
			null,
			injector
		);

		return componentRef.instance as T;
	}
}
