import { userServiceTestProvider } from './../../common/test-stubs/user.service-stub';
import { Pages } from './../../common/routing/routesUrls';
import { of, Observable } from 'rxjs';
import { UserService } from './../../services/user/user.service';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from './../../../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { TestBed, async, inject } from '@angular/core/testing';

import { DataAvailableGuard } from './data-available.guard';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({})
class TestComponent {}

describe('DataAvailableGuard', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [DataAvailableGuard, userServiceTestProvider],
			imports: [
				AngularFireModule.initializeApp(environment.firebase),
				RouterTestingModule.withRoutes([
					{
						path: 'setup-account',
						component: TestComponent,
					},
				]),
			],
		});
	});

	it('should give access to users that created initialization data', inject(
		[DataAvailableGuard, UserService],
		(guard: DataAvailableGuard, user: UserService) => {
			spyOnProperty(user, 'hasCreatedData$').and.returnValue(of(true));

			(guard.canActivate(null, null) as Observable<boolean>).subscribe(
				hasAccess => {
					expect(hasAccess).toBeTruthy();
				}
			);
		}
	));

	it('should refuse access to users that did not create initialization data', inject(
		[DataAvailableGuard, UserService],
		(guard: DataAvailableGuard, user: UserService) => {
			spyOnProperty(user, 'hasCreatedData$').and.returnValue(of(false));

			(guard.canActivate(null, null) as Observable<boolean>).subscribe(
				hasAccess => {
					expect(hasAccess).toBeFalsy();
				}
			);
		}
	));

	it('should redirect user to setup-account page if user did not create initialization data', inject(
		[DataAvailableGuard, UserService, Router],
		(guard: DataAvailableGuard, user: UserService, router: Router) => {
			spyOnProperty(user, 'hasCreatedData$').and.returnValue(of(false));
			const spy = spyOn(router, 'navigateByUrl').and.returnValue(
				Promise.resolve(true)
			);

			(guard.canActivate(null, null) as Observable<boolean>).subscribe(() => {
				expect(spy).toHaveBeenCalledWith(Pages.SetupAccount);
			});
		}
	));
});
