import { ComponentType } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import {
	ApplicationRef,
	ComponentFactoryResolver,
	ComponentRef,
	EmbeddedViewRef,
	Inject,
	Injectable,
	Injector,
	Renderer2,
	RendererFactory2,
} from '@angular/core';
import { Subject } from 'rxjs';

import { OVERLAY_SERVICE } from '../../common/models/overlay';
import { OverlayComponent } from './../../components/overlay/overlay.component';

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
	) {
		this._renderer = _rendererFactory.createRenderer(null, null);
	}

	/**
	 * Allows listening for clicks on overlay.
	 */
	public onClick$ = new Subject<MouseEvent>();
	private _isOpened = false;
	private _renderer: Renderer2;
	private _overlayRef: ComponentRef<OverlayComponent>;

	/**
	 * Opens overlay. You can pass a class of a component that will be created and inserted
	 * into the overlay view. Also you can pass your own injector that will be used
	 * during component creating. Overlay can be opened only once, if you'll try to
	 * open it while another instance is already opened nothing will happen, and
	 * method will return null.
	 *
	 * It returns component instance in case you`ll need to access it later.
	 *
	 * @param contentComponentFactory Component class to create and insert into overlay
	 * @param injector Injector that will be used to create passed Component
	 */
	open(contentComponentFactory?: ComponentRef<any>) {
		if (this._isOpened) return null;

		const componentFactory = this._componentResolver.resolveComponentFactory(
			OverlayComponent
		);
		const overlayComponentInjector = Injector.create({
			parent: this._injector,
			providers: [{ provide: OVERLAY_SERVICE, useValue: this }],
		});
		const component = componentFactory.create(overlayComponentInjector);
		const componentView = component.hostView as EmbeddedViewRef<
			OverlayComponent
		>;

		this._overlayRef = component;
		this._appRef.attachView(component.hostView);
		this._renderer.appendChild(this._docRef.body, componentView.rootNodes[0]);
		this._isOpened = true;

		if (contentComponentFactory)
			return component.instance.insertComponent(contentComponentFactory);
	}

	/**
	 * Closes currently opened overlay.
	 */
	close() {
		if (!this._isOpened) return null;

		this._overlayRef.destroy();
		this._isOpened = false;
	}

	toggle() {
		if (this._isOpened) this.close();
		else this.open();
	}

	get isOpened(): boolean {
		return this._isOpened;
	}
}
