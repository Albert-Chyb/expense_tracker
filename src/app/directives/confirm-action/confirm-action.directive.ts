import { DialogContainerComponent } from './../../components/dialog-container/dialog-container.component';
import { Observable, Subscription } from 'rxjs';
import { ConfirmDialogData } from './../../components/confirm-dialog/confirm-dialog.component';
import {
	Directive,
	EventEmitter,
	HostListener,
	Input,
	Output,
	OnDestroy,
} from '@angular/core';
import { DialogService } from 'src/app/services/dialog/dialog.service';

/**
 * Allows you to open confirm dialog by clicking on host button.
 * This can be used to make sure that user want to preform desired operation,
 * and to display some additional information.
 *
 * It takes object with two properties: title and description.
 *
 * Exposes 3 listeners: reject, confirm, action
 *
 * Reject event means that user clicked cancel button
 *
 * Confirm event means that user clicked OK button
 *
 * Action event is fired whenever two above happens with boolean representation of user choice.
 *
 * @example
 * ```html
 *  <button [confirmAction]="{
 *    title: 'Are you sure about this ?',
 *    description: 'This cannot be reversed !'
 * }"
 *    (reject)="onRejectMethod()"
 *    (confirm)="deleteItem()"
 *    (action)="onAnyChoice()"
 * >Delete this item</button>
 * ```
 * <button></button>
 */

@Directive({
	selector: '[confirmAction]',
})
export class ConfirmActionDirective implements OnDestroy {
	constructor(private readonly _dialog: DialogService) {}

	private _dialogRef: DialogContainerComponent;
	private _dialogSubscription: Subscription = new Subscription();

	@Output('reject') onReject = new EventEmitter();
	@Output('confirm') onConfirm = new EventEmitter();
	@Output('action') onAction = new EventEmitter();
	@Input('confirmAction') data: ConfirmDialogData;

	@HostListener('click') openConfirmDialog() {
		this._dialogRef = this._dialog.openConfirm(
			this.data.title,
			this.data.description
		);

		this._dialogSubscription.add(
			this._dialogRef.afterClosed.subscribe(
				this._onDialogCloseCallback.bind(this)
			)
		);
	}

	ngOnDestroy() {
		this._dialogSubscription.unsubscribe();
	}

	private _onDialogCloseCallback(status: boolean) {
		if (status) {
			this.onConfirm.emit();
		} else {
			this.onReject.emit();
		}

		this.onAction.emit(status);
	}
}
