import { OverlayService } from './../../services/overlay/overlay.service';
import { InjectionToken } from '@angular/core';

/** Injection token that helps with circular dependency error. */
export const OVERLAY_SERVICE = new InjectionToken<OverlayService>(
	'OVERLAY_SERVICE'
);
