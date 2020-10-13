import { TransactionsService } from './../../services/transactions/transactions.service';
import { Provider } from '@angular/core';
import { of } from 'rxjs';
export class TransactionsServiceStub {
	getAllCurrent() {
		return of([]);
	}

	get(id) {
		return of({});
	}

	add() {
		return Promise.resolve();
	}

	update() {
		return Promise.resolve();
	}

	delete() {
		return Promise.resolve();
	}
}

export const transactionsServiceTestProvider: Provider = {
	provide: TransactionsService,
	useClass: TransactionsServiceStub,
};
