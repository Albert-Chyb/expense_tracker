import { Component, Inject } from '@angular/core';

import { DIALOG_DATA, DIALOG_REF } from '../../common/models/dialog';
import { DialogContainerComponent } from '../dialog-container/dialog-container.component';

export interface ConfirmDialogData {
	title: string;
	description: string;
}

@Component({
	templateUrl: './confirm-dialog.component.html',
	styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent {
	constructor(
		@Inject(DIALOG_DATA) private readonly _data: ConfirmDialogData,
		@Inject(DIALOG_REF) private readonly _dialogRef: DialogContainerComponent
	) {}

	get data() {
		return this._data;
	}

	confirm() {
		this._dialogRef.closeWith(true);
	}

	reject() {
		this._dialogRef.closeWith(false);
	}
}
