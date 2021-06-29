import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType } from '@angular/cdk/portal';
import { ComponentRef, Injectable, Injector } from '@angular/core';
import { first } from 'rxjs/operators';
import { DIALOG_DATA } from '../../common/models/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogData } from './../../components/confirm-dialog/confirm-dialog.component';
import { DialogContainerComponent } from './../../components/dialog-container/dialog-container.component';

@Injectable({
	providedIn: 'root',
})
export class DialogService {
	constructor(
		private readonly _injector: Injector,
		private readonly _cdkOverlay: Overlay
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
		const injector = this._buildInjectorForDialog(data);
		const [overlay, { instance: dialogContainer }] =
			this._buildOverlay(injector);

		dialogContainer.insertComponent(DialogComponent, overlay);

		return dialogContainer;
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

	/**
	 * Creates overlay.
	 *
	 * @param injector Injector that will be used to create DialogContainerComponent
	 * @returns Array with OverlayRef as a first element and ComponentRef as a second
	 */
	private _buildOverlay(
		injector: Injector
	): [OverlayRef, ComponentRef<DialogContainerComponent>] {
		const overlay = this._cdkOverlay.create(this._buildOverlayConfig());
		const attachment = overlay.attach(
			new ComponentPortal(DialogContainerComponent, null, injector)
		);

		return [overlay, attachment];
	}

	/**
	 * Builds config for the overlay.
	 *
	 * @returns Overlay config
	 */
	private _buildOverlayConfig(): OverlayConfig {
		return {
			hasBackdrop: true,
			positionStrategy: this._cdkOverlay
				.position()
				.global()
				.centerHorizontally()
				.centerVertically(),
			scrollStrategy: this._cdkOverlay.scrollStrategies.block(),
		};
	}

	/**
	 * Creates injector with additional providers for dialog container component.
	 *
	 * @param data Data to make available in dialog component.
	 */
	private _buildInjectorForDialog(data: any): Injector {
		return Injector.create({
			parent: this._injector,
			providers: [{ provide: DIALOG_DATA, useValue: data }],
		});
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
