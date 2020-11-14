import { ComponentType } from '@angular/cdk/portal';
import {
	Component,
	ComponentFactoryResolver,
	ComponentRef,
	ElementRef,
	Inject,
	Injectable,
	InjectionToken,
	Injector,
	ViewChild,
	ViewContainerRef,
} from '@angular/core';
import { Subject } from 'rxjs';

import { OverlayService } from './overlay/overlay.service';

export const DIALOG_DATA = new InjectionToken('DIALOG_DATA');
export const DIALOG_REF = new InjectionToken('DIALOG_REF');

@Component({
	template: '<ng-template #dialogContent></ng-template>',
})
export class DialogContainerComponent {
	constructor(
		private readonly _componentFactory: ComponentFactoryResolver,
		private readonly _injector: Injector,
		private readonly _dialog: DialogService,
		@Inject(DIALOG_DATA) private readonly _data: any
	) {}

	@ViewChild('dialogContent', { static: true, read: ViewContainerRef })
	content: ViewContainerRef;

	private readonly _afterClosed = new Subject<any>();

	insertContent(
		DialogContentComponent: any
	): ComponentRef<typeof DialogContentComponent> {
		const factory = this._componentFactory.resolveComponentFactory(
			DialogContentComponent
		);
		const injector = Injector.create({
			parent: this._injector,
			providers: [{ provide: DIALOG_REF, useValue: this }],
		});

		return this.content.createComponent(factory, 0, injector);
	}

	close() {
		this._afterClosed.next(this._data);
		this._dialog.close();
	}

	closeWith(data: any) {
		this._afterClosed.next(data);
		this._dialog.close();
	}

	get afterClosed() {
		return this._afterClosed.pipe();
	}
}

@Injectable({
	providedIn: 'root',
})
export class DialogService {
	constructor(
		private readonly _overlay: OverlayService,
		private readonly _injector: Injector,
		private readonly _componentFactory: ComponentFactoryResolver
	) {}

	private _currentDialog: ComponentRef<DialogContainerComponent>;

	/**
	 * Opens a dialog.
	 * You can pass any data to the dialog and reference it by injection token.
	 * @param DialogComponent Dialog Component class
	 * @param data Data to pass in DIALOG_DATA injection token
	 */
	open<T>(DialogComponent: ComponentType<T>, data: any) {
		const injector = Injector.create({
			parent: this._injector,
			providers: [{ provide: DIALOG_DATA, useValue: data }],
		});
		const factory = this._componentFactory.resolveComponentFactory(
			DialogContainerComponent
		);
		const dialogContainer = factory.create(injector);

		this._currentDialog = dialogContainer;
		dialogContainer.instance.insertContent(DialogComponent);
		this._overlay.open(dialogContainer);

		return dialogContainer.instance;
	}

	close() {
		this._currentDialog.destroy();
		this._overlay.close();
	}
}
