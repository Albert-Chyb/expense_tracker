import { TransactionsGroupsService } from './../../services/transactions-groups/transactions-groups.service';
import { Provider } from '@angular/core';
import { of } from 'rxjs';

export class TransactionsGroupsServiceStub {
	getAll() {
		return of([]);
	}

	get(id) {
		return of();
	}

	delete(id) {
		return Promise.resolve();
	}

	add(obj) {
		return Promise.resolve();
	}
}

export const transactionsGroupsServiceTestProvider: Provider = {
	provide: TransactionsGroupsService,
	useClass: TransactionsGroupsServiceStub,
};
