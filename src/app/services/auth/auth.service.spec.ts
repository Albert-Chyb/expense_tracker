import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
	beforeEach(() =>
		TestBed.configureTestingModule({
			imports: [AngularFireModule.initializeApp(environment.firebase)],
		})
	);

	it('should be created', () => {
		const service: AuthService = TestBed.get(AuthService);
		expect(service).toBeTruthy();
	});
});
