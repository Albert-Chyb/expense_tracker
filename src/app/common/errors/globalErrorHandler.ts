import { ErrorsService } from './../../services/errors/errors.service';
import { ErrorHandler, Injectable } from '@angular/core';

import { environment } from './../../../environments/environment';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
	constructor(private readonly _errors: ErrorsService) {}

	handleError(error: any): void {
		if (!environment.production) {
			console.error(error);
		} else {
			this._errors.notifyUser('An error occurred');
			/*
                Here, an unhandled error would be automatically reported to some service.
            */
		}
	}
}
