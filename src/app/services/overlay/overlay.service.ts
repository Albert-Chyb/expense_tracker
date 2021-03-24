import {
	ComponentPortal,
	ComponentType,
	DomPortalOutlet,
} from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import {
	ApplicationRef,
	ComponentFactoryResolver,
	ComponentRef,
	EmbeddedViewRef,
	Inject,
	Injectable,
	Injector,
	RendererFactory2,
	TemplateRef,
} from '@angular/core';
import { Subject } from 'rxjs';
import { first } from 'rxjs/operators';

import { OVERLAY_SERVICE } from '../../common/models/overlay';
import { OverlayComponent } from './../../components/overlay/overlay.component';
import { IOverlaySettings, OVERLAY_SETTINGS } from './overlay';

const DEFAULT_SETTINGS: IOverlaySettings = {
	transparent: false,
};

@Injectable({
	providedIn: 'root',
})
export class OverlayService {
	constructor(
		private readonly _componentResolver: ComponentFactoryResolver,
		private readonly _injector: Injector,
		private readonly _appRef: ApplicationRef,

		@Inject(DOCUMENT)
		private readonly _docRef: Document,

		readonly _rendererFactory: RendererFactory2
	) {}

	/**
	 * Allows listening for clicks on overlay.
	 */
	public onClick$ = new Subject<MouseEvent>();
	private _isOpened = false;
	private _overlayRef: OverlayComponent;
	private readonly _portalHost = new DomPortalOutlet(
		this._docRef.body,
		this._componentResolver,
		this._appRef,
		this._injector
	);

	/**
	 * Opens overlay. You can pass a class of a component that will be created and inserted
	 * into the overlay view. Also you can pass your own injector that will be used
	 * during component creating.
	 *
	 * Overlay can be opened only once, if you'll try to
	 * open it while another instance is already opened nothing will happen, and
	 * method will return null.
	 *
	 * @param Component Component class to create and insert into overlay
	 * @param injector Injector that will be used to create passed Component
	 * @returns Reference of the created component
	 */
	open<T>(
		Component?: ComponentType<T>,
		injector?: Injector,
		settings?: IOverlaySettings
	): ComponentRef<T>;
	open<T>(
		Component?: TemplateRef<T>,
		injector?: Injector,
		settings?: IOverlaySettings
	): EmbeddedViewRef<T>;
	open<T>(
		Component?: ComponentType<T> | TemplateRef<T>,
		injector?: Injector,
		settings: IOverlaySettings = DEFAULT_SETTINGS
	): ComponentRef<T> | EmbeddedViewRef<T> | null {
		if (this._isOpened) return null;
		this._isOpened = true;

		const portal = new ComponentPortal(
			OverlayComponent,
			null,
			this._createInjectorForOverlayComponent(settings)
		);

		const component = portal.attach(this._portalHost);
		this._overlayRef = component.instance;

		if (Component)
			return component.instance.insertComponent(Component, injector);
	}

	/**
	 * Closes currently opened overlay and destroys all components within.
	 * @returns Promise resolved when overlay animations on leave are done.
	 */
	async close(): Promise<void> {
		if (!this._isOpened) return null;

		this._portalHost.detach();
		await this._overlayRef.onAnimationEnd$.pipe(first()).toPromise();
		this._overlayRef = null;
		this._isOpened = false;
	}

	/** Indicates whether the overlay is opened or closed. */
	get isOpened(): boolean {
		return this._isOpened;
	}

	private _createInjectorForOverlayComponent(settings: IOverlaySettings) {
		return Injector.create({
			parent: this._injector,
			providers: [
				{ provide: OVERLAY_SERVICE, useValue: this },
				{
					provide: OVERLAY_SETTINGS,
					useValue: settings,
				},
			],
		});
	}
}
