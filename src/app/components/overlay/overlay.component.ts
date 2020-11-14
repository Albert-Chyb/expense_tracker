import { transition, trigger, useAnimation } from '@angular/animations';
import {
	AfterViewInit,
	Component,
	ComponentFactory,
	ComponentFactoryResolver,
	ComponentRef,
	HostListener,
	Injector,
	ViewChild,
	ViewContainerRef,
} from '@angular/core';

import { OVERLAY_SERVICE } from '../../common/models/overlay';
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

	private readonly _overlay = this._injector.get(OVERLAY_SERVICE);

	@ViewChild('overlayContent', { read: ViewContainerRef, static: true })
	content: ViewContainerRef;

	@HostListener('click', ['$event']) onClick($event: MouseEvent) {
		this._overlay.onClick$.next($event);
	}

	/**
	 * Inserts the component into overlay view using passed injector.
	 * Returns instance of that component.
	 * @param componentRef Class of a component to insert
	 * @param injector Injector that will be used when creating the component
	 */
	insertComponent<T>(componentRef: ComponentRef<T>) {
		this.content.insert(componentRef.hostView);
	}
}
