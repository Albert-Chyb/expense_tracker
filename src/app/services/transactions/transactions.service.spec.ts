import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { TestBed, inject } from '@angular/core/testing';

import { TransactionsService } from './transactions.service';

describe('TransactionsService', () => {
	beforeEach(() =>
		TestBed.configureTestingModule({
			imports: [AngularFireModule.initializeApp(environment.firebase)],
		})
	);

	it('should be created', () => {
		const service: TransactionsService = TestBed.inject(TransactionsService);
		expect(service).toBeTruthy();
	});
});
