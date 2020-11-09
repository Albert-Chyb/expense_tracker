import { transition, trigger, useAnimation } from '@angular/animations';
import {
	Component,
	ComponentFactoryResolver,
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
	constructor(private readonly _componentFactory: ComponentFactoryResolver) {}

	@ViewChild('overlayContent', { read: ViewContainerRef, static: true })
	content: ViewContainerRef;

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
