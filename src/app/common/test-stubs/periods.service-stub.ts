import { PeriodsService } from './../../services/periods/periods.service';
import { Provider } from '@angular/core';
import { of } from 'rxjs';
export class PeriodsServiceStub {
	getCurrent() {
		return of({
			date: {
				end: {
					toDate: () => new Date(),
				},
				start: {
					toDate: () => new Date(),
				},
			},
		});
	}

	endCurrent() {
		return Promise.resolve();
	}

	openCurrent() {
		return Promise.resolve();
	}

	getAllClosed() {
		return of([]);
	}
}

export const periodsServiceTestProvider: Provider = {
	provide: PeriodsService,
	useClass: PeriodsServiceStub,
};
