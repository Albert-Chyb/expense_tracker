import { ErrorsMessages } from './../../common/errors/errorsMessages';
import { ErrorsService } from './../../services/errors/errors.service';
import { AuthService } from './../../services/auth/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { ComponentFixture, TestBed, inject, waitForAsync } from '@angular/core/testing';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
	let component: LoginComponent;
	let fixture: ComponentFixture<LoginComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [LoginComponent],
			imports: [
				AngularFireModule.initializeApp(environment.firebase),
				RouterTestingModule,
			],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(LoginComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('loginWithGoogle', () => {
		it('should call service to login with google', inject(
			[AuthService],
			(auth: AuthService) => {
				const spy = spyOn(auth, 'loginWithGoogle').and.returnValue(
					Promise.resolve() as any
				);

				component.loginWithGoogle();

				expect(spy).toHaveBeenCalled();
			}
		));

		it('should call handleError() method if an error occurs', inject(
			[AuthService],
			async (auth: AuthService) => {
				spyOn(auth, 'loginWithGoogle').and.returnValue(Promise.reject());
				const spy = spyOn(component as any, 'handleError');

				await component.loginWithGoogle();

				expect(spy).toHaveBeenCalled();
			}
		));
	});

	describe('handleError', () => {
		it('should rethrow an error if an unknown error is passed', () => {
			const error = { code: 'a' } as any;

			expect(() => component['handleError'](error)).toThrow(error);
		});

		it('should inform user that login window was closed to early', inject(
			[ErrorsService],
			(errors: ErrorsService) => {
				const spy = spyOn(errors, 'notifyUser');
				const error = { code: 'auth/popup-closed-by-user' } as any;

				component['handleError'](error);

				expect(spy).toHaveBeenCalledWith(ErrorsMessages.PopupClosedByUser);
			}
		));

		it('should inform user that browser prevented opening the login window', inject(
			[ErrorsService],
			(errors: ErrorsService) => {
				const spy = spyOn(errors, 'notifyUser');
				const error = { code: 'auth/popup-blocked' } as any;

				component['handleError'](error);

				expect(spy).toHaveBeenCalledWith(ErrorsMessages.PopupBlocked);
			}
		));

		it('should inform user that there was too many opened login windows', inject(
			[ErrorsService],
			(errors: ErrorsService) => {
				const spy = spyOn(errors, 'notifyUser');
				const error = { code: 'auth/cancelled-popup-request' } as any;

				component['handleError'](error);

				expect(spy).toHaveBeenCalledWith(ErrorsMessages.CancelledPopupRequest);
			}
		));
	});
});
