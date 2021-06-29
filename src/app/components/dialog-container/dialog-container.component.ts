import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType } from '@angular/cdk/portal';
import { Component, Inject, Injector } from '@angular/core';
import { Subject } from 'rxjs';
import { DIALOG_DATA, DIALOG_REF } from 'src/app/common/models/dialog';

@Component({
	template: '<ng-template [cdkPortalOutlet]="portal"></ng-template>',
})
export class DialogContainerComponent {
	constructor(
		private readonly _injector: Injector,
		@Inject(DIALOG_DATA) private readonly _data: any
	) {}

	private readonly _afterClosed = new Subject<any>();
	portal: ComponentPortal<any>;
	overlay: OverlayRef;

	/**
	 * Inserts dialog component into dialog container.
	 *
	 * @param DialogContentComponent Dialog component class
	 * @param overlay Reference to the overlay
	 */
	insertComponent(
		DialogContentComponent: ComponentType<any>,
		overlay: OverlayRef
	) {
		const injector = this._createInjectorForContent();
		this.portal = new ComponentPortal(DialogContentComponent, null, injector);
		this.overlay = overlay;
	}

	/**
	 * Closes dialog and broadcast this action in afterClosed observer with data
	 * passed in the service.
	 */
	async close() {
		this.overlay.dispose();
		this._afterClosed.next(this._data);
	}

	/**
	 * Closes dialog and broadcast this action in afterClosed observer with data
	 * passed in the argument.
	 */
	async closeWith(data: any) {
		this.overlay.dispose();
		this._afterClosed.next(data);
	}

	/**
	 * Allows attaching callbacks when the dialog is closed.
	 */
	get afterClosed() {
		return this._afterClosed.pipe();
	}

	private _createInjectorForContent(): Injector {
		return Injector.create({
			parent: this._injector,
			providers: [{ provide: DIALOG_REF, useValue: this }],
		});
	}
}
