import { ErrorsService } from './../../services/errors/errors.service';
import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
	constructor(private readonly _errors: ErrorsService) {}

	handleError(error: any): void {
		this._errors.notifyUser('An error occurred');

		console.error(error);
	}
}
