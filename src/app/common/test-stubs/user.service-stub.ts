import { UserService } from './../../services/user/user.service';
import { Provider } from '@angular/core';
import { of } from 'rxjs';

export class UserServiceStub {
	update(param: any) {
		return Promise.resolve();
	}

	updateSettings() {
		return Promise.resolve();
	}

	createData() {
		return Promise.resolve();
	}

	user$ = of({
		settings: {},
	});
	id = 'id';
	get hasCreatedData$() {
		return of(false);
	}
	hasCreatedData = Promise.resolve(false);
	isLoggedIn$ = of(false);

	getUid$() {
		return of('id');
	}
}

export const userServiceTestProvider: Provider = {
	provide: UserService,
	useClass: UserServiceStub,
};
