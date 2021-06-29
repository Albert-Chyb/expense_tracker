import { InjectionToken } from '@angular/core';

import { DialogContainerComponent } from './../../components/dialog-container/dialog-container.component';

export const DIALOG_DATA = new InjectionToken('DIALOG_DATA');
export const DIALOG_REF = new InjectionToken<DialogContainerComponent>(
	'DIALOG_REF'
);
