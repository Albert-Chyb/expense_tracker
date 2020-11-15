import { DialogContainerComponent } from './../../components/dialog-container/dialog-container.component';
import { InjectionToken } from '@angular/core';
import { DialogService } from '../../services/dialog/dialog.service';

export const DIALOG_DATA = new InjectionToken('DIALOG_DATA');
export const DIALOG_REF = new InjectionToken<DialogContainerComponent>(
	'DIALOG_REF'
);
export const DIALOG_SERVICE = new InjectionToken<DialogService>(
	'DIALOG_SERVICE'
);
