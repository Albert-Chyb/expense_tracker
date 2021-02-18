import {
	IOverlaySettings,
	OVERLAY_SETTINGS,
} from './../../services/overlay/overlay';
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
	TemplatePortal,
} from '@angular/cdk/portal';
import {
	Component,
	ElementRef,
	HostListener,
	Inject,
	Injector,
	TemplateRef,
	ViewChild,
	ViewContainerRef,
} from '@angular/core';
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
		<div
			class="overlay"
			#overlay
			[ngClass]="{ 'overlay--transparent': settings.transparent }"
		>
			<ng-template [cdkPortalOutlet]="portal"> </ng-template>
		</div>
	`,
})
export class OverlayComponent {
	constructor(
		private readonly _injector: Injector,
		@Inject(OVERLAY_SETTINGS) public readonly settings: IOverlaySettings
	) {}

	private readonly _overlay = this._injector.get(OVERLAY_SERVICE);
	private _portal: ComponentPortal<any>;

	@ViewChild('overlay', { read: ViewContainerRef })
	overlayRef: ViewContainerRef;
	@ViewChild(CdkPortalOutlet, { static: true }) portalOutlet: CdkPortalOutlet;
	@HostListener('click', ['$event']) onClick($event: MouseEvent) {
		if ($event.target === this.overlayRef.element.nativeElement)
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
	insertComponent<T>(
		Component: ComponentType<T> | TemplateRef<T>,
		injector?: Injector
	) {
		const injectorToUse = injector || this._injector;

		if (Component instanceof TemplateRef) {
			return this.portalOutlet.attach(
				new TemplatePortal(Component, this.overlayRef)
			);
		} else {
			return this.portalOutlet.attach(
				new ComponentPortal(Component, null, injectorToUse)
			);
		}
	}

	/** Emits an AnimationEvent when animation of overlay ended */
	get onAnimationEnd$() {
		return this._onAnimationEnd.pipe();
	}

	get portal() {
		return this._portal;
	}
}
