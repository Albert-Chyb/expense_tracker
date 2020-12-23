import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CheckboxComponent } from './../../components/checkbox/checkbox.component';
import { FormErrorsDirective } from './../../directives/form-errors/form-errors.directive';
import { StyledInputComponent } from './../../components/styled-input/styled-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Pages } from './../../common/routing/routesUrls';
import { UserService } from './../../services/user/user.service';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from './../../../environments/environment';
import { AngularFireModule } from '@angular/fire';
import {
	ComponentFixture,
	inject,
	TestBed,
	waitForAsync,
} from '@angular/core/testing';

import { SetupAccountComponent } from './setup-account.component';
import { Router } from '@angular/router';
import { FormErrorsComponent } from 'src/app/components/form-errors/form-errors.component';
import { ZippyContentComponent } from 'src/app/components/zippy-components/zippy-content/zippy-content.component';
import { ZippyStaticComponent } from 'src/app/components/zippy-components/zippy-static/zippy-static.component';
import { ZippyComponent } from 'src/app/components/zippy-components/zippy/zippy.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('SetupAccountComponent', () => {
	let component: SetupAccountComponent;
	let fixture: ComponentFixture<SetupAccountComponent>;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [
					SetupAccountComponent,
					StyledInputComponent,
					FormErrorsComponent,
					FormErrorsDirective,
					ZippyComponent,
					ZippyStaticComponent,
					ZippyContentComponent,
					CheckboxComponent,
				],
				imports: [
					AngularFireModule.initializeApp(environment.firebase),
					RouterTestingModule,
					ReactiveFormsModule,
					FormsModule,
					MatFormFieldModule,
					MatSelectModule,
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
