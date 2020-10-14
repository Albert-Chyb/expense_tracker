import { PeriodsServiceStub } from './periods.service-stub';
import { PeriodsService } from './../../services/periods/periods.service';
import { TransactionsGroupsServiceStub } from './transactions-groups.service-stub';
import { Provider } from '@angular/core';
import { TransactionsServiceStub } from './transactions.service-stub';
import { TransactionsService } from './../../services/transactions/transactions.service';
import { UserService } from '../../services/user/user.service';
import { UserServiceStub } from './user.service-stub';
import { TransactionsGroupsService } from '../../services/transactions-groups/transactions-groups.service';

export interface ITestingProviders {
	[key: string]: Provider;
}

export const TestingProviders = Object.freeze({
	UserService: {
		provide: UserService,
		useClass: UserServiceStub,
	},
	TransactionsService: {
		provide: TransactionsService,
		useClass: TransactionsServiceStub,
	},
	TransactionsGroupsService: {
		provide: TransactionsGroupsService,
		useClass: TransactionsGroupsServiceStub,
	},
	PeriodsService: {
		provide: PeriodsService,
		useClass: PeriodsServiceStub,
	},
});
