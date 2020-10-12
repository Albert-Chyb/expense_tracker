import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';

describe('UserService', () => {
	beforeEach(() =>
		TestBed.configureTestingModule({
			imports: [AngularFireModule.initializeApp(environment.firebase)],
		})
	);

	it('should be created', () => {
		const service: UserService = TestBed.get(UserService);
		expect(service).toBeTruthy();
	});
});
