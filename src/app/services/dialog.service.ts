import { ComponentPortal, ComponentType } from '@angular/cdk/portal';
import {
	Component,
	Inject,
	Injectable,
	InjectionToken,
	Injector,
	OnDestroy,
} from '@angular/core';
import { Subject } from 'rxjs';

import { ConfirmDialogComponent } from './../components/confirm-dialog/confirm-dialog.component';
import { OverlayService } from './overlay/overlay.service';

export const DIALOG_DATA = new InjectionToken('DIALOG_DATA');
export const DIALOG_REF = new InjectionToken('DIALOG_REF');

@Component({
	template: '<ng-template [cdkPortalOutlet]="portal"></ng-template>',
})
export class DialogContainerComponent implements OnDestroy {
	constructor(
		private readonly _injector: Injector,
		private readonly _dialog: DialogService,
		@Inject(DIALOG_DATA) private readonly _data: any
	) {}

	private readonly _afterClosed = new Subject<any>();
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
	close() {
		this._afterClosed.next(this._data);
		this._dialog.close();
	}

	/**
	 * Closes dialog and broadcast this action in afterClosed observer with data
	 * passed in the argument.
	 */
	closeWith(data: any) {
		this._afterClosed.next(data);
		this._dialog.close();
	}

	ngOnDestroy() {
		this._afterClosed.unsubscribe();
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

@Injectable({
	providedIn: 'root',
})
export class DialogService {
	constructor(
		private readonly _overlay: OverlayService,
		private readonly _injector: Injector
	) {}

	/**
	 * Opens a dialog component.
	 *
	 * Passed data can be later access inside of the dialog by DIALOG_DATA injection token.
	 *
	 * @param DialogComponent Dialog Component class
	 * @param data Data that will be available in the injection token
	 * @returns DialogContainerComponent
	 */
	open<T>(
		DialogComponent: ComponentType<T>,
		data?: any
	): DialogContainerComponent {
		const injector = Injector.create({
			parent: this._injector,
			providers: [{ provide: DIALOG_DATA, useValue: data }],
		});
		const dialogContainer = this._overlay.open(
			DialogContainerComponent,
			injector
		);

		dialogContainer.instance.insertContent(DialogComponent);

		return dialogContainer.instance;
	}

	/**
	 * Opens confirm dialog that is meant to replace standard window.confirm() dialog.
	 * @param title Title of the dialog
	 * @param description Description of the dialog
	 * @returns DialogContainerComponent
	 */
	openConfirm(title: string, description: string): DialogContainerComponent {
		return this.open(ConfirmDialogComponent, { title, description });
	}

	close() {
		this._overlay.close();
	}
}
