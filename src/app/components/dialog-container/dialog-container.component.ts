import { DIALOG_SERVICE } from './../../common/models/dialog';
import { ComponentPortal, ComponentType } from '@angular/cdk/portal';
import { Component, Inject, Injector, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { DIALOG_DATA, DIALOG_REF } from 'src/app/common/models/dialog';
@Component({
	template: '<ng-template [cdkPortalOutlet]="portal"></ng-template>',
})
export class DialogContainerComponent implements OnInit {
	constructor(
		private readonly _injector: Injector,
		@Inject(DIALOG_DATA) private readonly _data: any
	) {}

	private readonly _afterClosed = new Subject<any>();
	private readonly _dialog = this._injector.get(DIALOG_SERVICE);
	portal: ComponentPortal<any>;

	/**
	 * Inserts dialog component into dialog container.
	 *
	 * @param DialogContentComponent Dialog component class
	 */
	insertContent(DialogContentComponent: ComponentType<any>) {
		const injector = this._createInjectorForContent();
		this.portal = new ComponentPortal(DialogContentComponent, null, injector);
	}

	/**
	 * Closes dialog and broadcast this action in afterClosed observer with data
	 * passed in the service.
	 */
	async close() {
		await this._dialog.close();
		this._afterClosed.next(this._data);
	}

	/**
	 * Closes dialog and broadcast this action in afterClosed observer with data
	 * passed in the argument.
	 */
	async closeWith(data: any) {
		await this._dialog.close();
		this._afterClosed.next(data);
	}

	ngOnInit() {}
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
