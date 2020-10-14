import { TestingProviders } from './../../common/test-stubs/testing-providers';
import { periodsServiceTestProvider } from './../../common/test-stubs/periods.service-stub';
import { userServiceTestProvider } from './../../common/test-stubs/user.service-stub';
import { of } from 'rxjs';
import { Component, Injectable } from '@angular/core';
import {
	async,
	ComponentFixture,
	inject,
	TestBed,
} from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { environment } from './../../../environments/environment';
import { Pages } from './../../common/routing/routesUrls';
import { LoaderComponent } from './../../components/loader/loader.component';
import { AuthService } from './../../services/auth/auth.service';
import { PeriodsService } from './../../services/periods/periods.service';
import { UserService } from './../../services/user/user.service';
import { ProfileComponent } from './profile.component';

@Component({})
class TestComponent {}

describe('ProfileComponent', () => {
	let component: ProfileComponent;
	let fixture: ComponentFixture<ProfileComponent>;

	beforeEach(async(() => {
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
			],
			providers: [
				TestingProviders.UserService,
				TestingProviders.PeriodsService,
			],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ProfileComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('endPeriod', () => {
		it('should call service to end current period', inject(
			[PeriodsService],
			(periods: PeriodsService) => {
				const spy = spyOn(periods, 'endCurrent').and.returnValue(
					Promise.resolve()
				);

				component.endPeriod();

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

				component.openPeriod();

				expect(spy).toHaveBeenCalled();
			}
		));
	});

	describe('logOut', () => {
		it('should call service to log out', inject(
			[AuthService],
			(auth: AuthService) => {
				const spy = spyOn(auth, 'logout').and.returnValue(Promise.resolve());

				component.logOut();

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

				await component.logOut();

				expect(spy).toHaveBeenCalledWith(Pages.Login);
			}
		));
	});
});
