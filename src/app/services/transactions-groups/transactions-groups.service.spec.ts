import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { TestBed } from '@angular/core/testing';

import { TransactionsGroupsService } from './transactions-groups.service';

describe('TransactionsGroupsService', () => {
	beforeEach(() =>
		TestBed.configureTestingModule({
			imports: [AngularFireModule.initializeApp(environment.firebase)],
		})
	);

	it('should be created', () => {
		const service: TransactionsGroupsService = TestBed.get(
			TransactionsGroupsService
		);
		expect(service).toBeTruthy();
	});
});
