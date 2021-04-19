import { FormSelectModule } from './../../components/form-select/form-select.module';
import {
	ComponentFixture,
	inject,
	TestBed,
	waitForAsync,
} from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from './../../../environments/environment';
import { Pages } from './../../common/routing/routesUrls';
import { CheckboxComponent } from './../../components/checkbox/checkbox.component';
import { FormFieldModule } from './../../components/form-field/form-field.module';
import { UserService } from './../../services/user/user.service';
import { SetupAccountComponent } from './setup-account.component';

describe('SetupAccountComponent', () => {
	let component: SetupAccountComponent;
	let fixture: ComponentFixture<SetupAccountComponent>;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [SetupAccountComponent, CheckboxComponent],
				imports: [
					AngularFireModule.initializeApp(environment.firebase),
					RouterTestingModule,
					ReactiveFormsModule,
					FormsModule,
					FormFieldModule,
					FormSelectModule,
					NoopAnimationsModule,
				],
			}).compileComponents();
		})
	);

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
				} as any;
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
