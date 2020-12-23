import { PortalModule } from '@angular/cdk/portal';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Component } from '@angular/core';
import { ComponentFixture, inject, TestBed, waitForAsync } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ExposedInjector } from 'src/app/services/dialog/dialog.service';

import { environment } from './../../../environments/environment';
import { Pages } from './../../common/routing/routesUrls';
import { TestingProviders } from './../../common/test-stubs/testing-providers';
import { LoaderComponent } from './../../components/loader/loader.component';
import { AuthService } from './../../services/auth/auth.service';
import { PeriodsService } from './../../services/periods/periods.service';
import { ProfileComponent } from './profile.component';

@Component({})
class TestComponent {}

describe('ProfileComponent', () => {
	let component: ProfileComponent;
	let fixture: ComponentFixture<ProfileComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ProfileComponent, LoaderComponent],
			imports: [
				AngularFireModule.initializeApp(environment.firebase),
				RouterTestingModule.withRoutes([
					{
						path: 'login',
						component: TestComponent,
					},
				]),
				BrowserAnimationsModule,
				PortalModule,
			],
			providers: [
				TestingProviders.UserService,
				TestingProviders.PeriodsService,
				ExposedInjector,
			],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ProfileComponent);
		component = fixture.componentInstance;
		TestBed.inject(ExposedInjector);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('endPeriod', () => {
		it('should call service to end current period', inject(
			[PeriodsService],
			(periods: PeriodsService) => {
				const spy = spyOn(periods as any, 'endCurrent').and.returnValue(
					Promise.resolve()
				);

				component['_endPeriod']();

				expect(spy).toHaveBeenCalled();
			}
		));
	});

	describe('openPeriod', () => {
		it('should call service to open current period', inject(
			[PeriodsService],
			(periods: PeriodsService) => {
				const spy = spyOn(periods, 'openCurrent').and.returnValue(
					Promise.resolve()
				);

				component['_openPeriod']();

				expect(spy).toHaveBeenCalled();
			}
		));
	});

	describe('logOut', () => {
		it('should call service to log out', inject(
			[AuthService],
			(auth: AuthService) => {
				const spy = spyOn(auth, 'logout').and.returnValue(Promise.resolve());

				component['_logOut']();

				expect(spy).toHaveBeenCalled();
			}
		));

		it('should redirect user to login page after logout', inject(
			[AuthService, Router],
			async (auth: AuthService, router: Router) => {
				spyOn(auth, 'logout').and.returnValue(Promise.resolve());
				const spy = spyOn(router, 'navigateByUrl').and.returnValue(
					Promise.resolve(true)
				);

				await component['_logOut']();

				expect(spy).toHaveBeenCalledWith(Pages.Login);
			}
		));
	});
});
