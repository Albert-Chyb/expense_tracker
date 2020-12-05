import { first } from 'rxjs/operators';
import { ConfirmDialogData } from './../../components/confirm-dialog/confirm-dialog.component';
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
		return this._overlay.close();
	}
}

/**
 * Exposes injector for elements that cannot use standard dependency injection.
 * It has to be injected as soon as possible to any angular element (for instance AppModule class).
 */
@Injectable()
export class ExposedInjector {
	private static _injector: Injector;
	constructor(injector: Injector) {
		ExposedInjector._injector = injector;
	}

	static get injector() {
		if (!ExposedInjector._injector) {
			throw new Error(
				'Tried to access injector before it was injected into ExposedInjector.'
			);
		}

		return ExposedInjector._injector;
	}
}

/**
 * Annotated method will have to be confirmed by confirm dialog before it will be called.
 * @param data ConfirmDialogData that will be passed to dialog
 */
export function Confirmable(data: ConfirmDialogData) {
	return (target: any, key: string, descriptor: PropertyDescriptor) => {
		const originalMethod = descriptor.value;

		descriptor.value = function (...args: any[]) {
			const dialogService = ExposedInjector.injector.get(DialogService);
			const dialogRef = dialogService.openConfirm(data.title, data.description);
			dialogRef.afterClosed.pipe(first()).subscribe((isConfirmed: boolean) => {
				if (isConfirmed) {
					return originalMethod.apply(this, args);
				}
			});
		};

		return descriptor;
	};
}
