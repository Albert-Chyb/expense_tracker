import { DIALOG_SERVICE } from './../../common/models/dialog';
import { ComponentType } from '@angular/cdk/portal';
import { Injectable, Injector } from '@angular/core';

import { DIALOG_DATA } from '../../common/models/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { OverlayService } from '../overlay/overlay.service';
import { DialogContainerComponent } from './../../components/dialog-container/dialog-container.component';

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
			providers: [
				{ provide: DIALOG_DATA, useValue: data },
				{ provide: DIALOG_SERVICE, useValue: this },
			],
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
