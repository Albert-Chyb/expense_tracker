import { ErrorHandler } from '@angular/core';

import { environment } from './../../../environments/environment';

export class GlobalErrorHandler implements ErrorHandler {
	handleError(error: any): void {
		if (!environment.production) {
			console.error(error);
		} else {
			/*
                Here, an unhandled error would be automatically reported to some service.
            */
		}
	}
}
