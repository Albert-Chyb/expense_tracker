import {
	AnimationEvent,
	transition,
	trigger,
	useAnimation,
} from '@angular/animations';
import {
	CdkPortalOutlet,
	ComponentPortal,
	ComponentType,
} from '@angular/cdk/portal';
import { Component, HostListener, Injector, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';

import { OVERLAY_SERVICE } from '../../common/models/overlay';
import { fadeIn, fadeOut } from './../../animations';

@Component({
	styleUrls: ['./overlay.component.scss'],
	animations: [
		trigger('overlayAnimation', [
			transition(':enter', useAnimation(fadeIn)),
			transition(':leave', useAnimation(fadeOut)),
		]),
	],
	host: {
		'[@overlayAnimation]': '',
		'(@overlayAnimation.done)': '_onAnimationEnd.next($event)',
	},
	template: `
		<div class="overlay">
			<ng-template [cdkPortalOutlet]="portal"> </ng-template>
		</div>
	`,
})
export class OverlayComponent {
	constructor(private readonly _injector: Injector) {}

	private readonly _overlay = this._injector.get(OVERLAY_SERVICE);
	private _portal: ComponentPortal<any>;

	@ViewChild(CdkPortalOutlet, { static: true }) portalOutlet: CdkPortalOutlet;
	@HostListener('click', ['$event']) onClick($event: MouseEvent) {
		this._overlay.onClick$.next($event);
	}
	private readonly _onAnimationEnd = new Subject<AnimationEvent>();

	/**
	 * Inserts a component into the overlay.
	 *
	 * @param componentRef Class of a component to insert
	 * @param injector Injector that will be used when creating the component
	 * @returns instance of created component
	 */
	insertComponent<T>(Component: ComponentType<T>, injector?: Injector) {
		const injectorToUse = injector || this._injector;

		return this.portalOutlet.attach(
			new ComponentPortal(Component, null, injectorToUse)
		);
	}

	/** Emits an AnimationEvent when animation of overlay ended */
	get onAnimationEnd$() {
		return this._onAnimationEnd.pipe();
	}

	get portal() {
		return this._portal;
	}
}
