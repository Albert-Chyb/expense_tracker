import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { TestBed } from '@angular/core/testing';

import { PeriodsService } from './periods.service';

describe('PeriodsService', () => {
	beforeEach(() =>
		TestBed.configureTestingModule({
			imports: [AngularFireModule.initializeApp(environment.firebase)],
		})
	);

	it('should be created', () => {
		const service: PeriodsService = TestBed.inject(PeriodsService);
		expect(service).toBeTruthy();
	});
});
