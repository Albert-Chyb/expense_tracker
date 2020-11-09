import { BehaviorSubject } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import {
	ApplicationRef,
	ComponentFactoryResolver,
	ComponentRef,
	EmbeddedViewRef,
	Inject,
	Injectable,
	InjectionToken,
	Injector,
	Renderer2,
	RendererFactory2,
} from '@angular/core';

import { OverlayComponent } from './../../components/overlay/overlay.component';

export const OVERLAY_SERVICE = new InjectionToken<OverlayService>(
	'OVERLAY_SERVICE'
);

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

	public onClick = new BehaviorSubject<MouseEvent>(null);
	private _isOpened = false;
	private _renderer: Renderer2;
	private _overlayRef: ComponentRef<OverlayComponent>;

	open<T>(Component?: any, injector = this._injector): T | null {
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

		if (Component)
			return component.instance.insertComponent<T>(Component, injector);
	}

	close() {
		if (!this._isOpened) return null;

		this._overlayRef.destroy();
		this._isOpened = false;
	}
}
