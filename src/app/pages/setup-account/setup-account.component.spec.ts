import { Pages } from './../../common/routing/routesUrls';
import { UserService } from './../../services/user/user.service';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from './../../../environments/environment';
import { AngularFireModule } from '@angular/fire';
import {
	async,
	ComponentFixture,
	inject,
	TestBed,
} from '@angular/core/testing';

import { SetupAccountComponent } from './setup-account.component';
import { Router } from '@angular/router';

describe('SetupAccountComponent', () => {
	let component: SetupAccountComponent;
	let fixture: ComponentFixture<SetupAccountComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [SetupAccountComponent],
			imports: [
				AngularFireModule.initializeApp(environment.firebase),
				RouterTestingModule,
			],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SetupAccountComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('completeCreatingAccount', () => {
		it('should call createData() method of user service with form value', inject(
			[UserService],
			(user: UserService) => {
				const formData = {
					balance: 1,
				};
				const spy = spyOn(user, 'createData').and.returnValue(
					Promise.resolve()
				);

				(component.form as any) = {
					value: formData,
				};
				component.completeCreatingAccount();

				expect(spy).toHaveBeenCalledWith(formData);
			}
		));

		it('should navigate user to home page', inject(
			[UserService, Router],
			async (user: UserService, router: Router) => {
				spyOn(user, 'createData').and.returnValue(Promise.resolve());
				const spy = spyOn(router, 'navigateByUrl');

				await component.completeCreatingAccount();

				expect(spy).toHaveBeenCalledWith(Pages.Home);
			}
		));
	});
});
