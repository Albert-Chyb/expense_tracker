import { Component } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';
import { UserService } from 'src/app/services/user/user.service';

import { environment } from './../../../environments/environment';
import { Pages } from './../../common/routing/routesUrls';
import { DataUnavailableGuard } from './data-unavailable.guard';

@Component({})
class TestComponent {}

describe('DataUnavailableGuard', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [DataUnavailableGuard],
			imports: [
				AngularFireModule.initializeApp(environment.firebase),
				RouterTestingModule.withRoutes([
					{
						path: '',
						component: TestComponent,
					},
				]),
			],
		});
	});

	it('should give access to users that did not creat initialization data', inject(
		[DataUnavailableGuard, UserService, Router],
		(guard: DataUnavailableGuard, user: UserService) => {
			spyOnProperty(user, 'hasCreatedData$').and.returnValue(of(false));

			(guard.canActivate(null, null) as Observable<boolean>).subscribe(
				hasAccess => {
					expect(hasAccess).toBeTruthy();
				}
			);
		}
	));

	it('should refuse access to users that created initialization data', inject(
		[DataUnavailableGuard, UserService, Router],
		(guard: DataUnavailableGuard, user: UserService) => {
			spyOnProperty(user, 'hasCreatedData$').and.returnValue(of(true));

			(guard.canActivate(null, null) as Observable<boolean>).subscribe(
				hasAccess => {
					expect(hasAccess).toBeFalsy();
				}
			);
		}
	));

	it('should redirect user to home page if user created initialization data', inject(
		[DataUnavailableGuard, UserService, Router],
		(guard: DataUnavailableGuard, user: UserService, router: Router) => {
			spyOnProperty(user, 'hasCreatedData$').and.returnValue(of(true));
			const spy = spyOn(router, 'navigateByUrl');

			(guard.canActivate(null, null) as Observable<boolean>).subscribe(
				hasAccess => {
					expect(spy).toHaveBeenCalledWith(Pages.Home);
				}
			);
		}
	));
});
