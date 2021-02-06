import { InjectionToken } from '@angular/core';

export interface IOverlaySettings {
	/** Indicates if overlay should be transparent */
	transparent: boolean;
}
export const OVERLAY_SETTINGS = new InjectionToken('OVERLAY_SETTINGS');
