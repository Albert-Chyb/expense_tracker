import { RouterTestingModule } from '@angular/router/testing';
import { userServiceTestProvider } from './../../common/test-stubs/user.service-stub';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ZippyContentComponent } from './../../components/zippy-components/zippy-content/zippy-content.component';
import {
	async,
	ComponentFixture,
	inject,
	TestBed,
} from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from 'src/app/services/user/user.service';
import { environment } from 'src/environments/environment';

import { CheckboxComponent } from './../../components/checkbox/checkbox.component';
import { ZippyStaticComponent } from './../../components/zippy-components/zippy-static/zippy-static.component';
import { ZippyComponent } from './../../components/zippy-components/zippy/zippy.component';
import { ThemesService } from './../../services/themes/themes.service';
import { AppSettingsComponent } from './app-settings.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('AppSettingsComponent', () => {
	let component: AppSettingsComponent;
	let fixture: ComponentFixture<AppSettingsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				AppSettingsComponent,
				ZippyComponent,
				ZippyStaticComponent,
				ZippyContentComponent,
				CheckboxComponent,
			],
			imports: [
				AngularFireModule.initializeApp(environment.firebase),
				ReactiveFormsModule,
				MatFormFieldModule,
				MatSelectModule,
				FormsModule,
				NoopAnimationsModule,
				RouterTestingModule,
			],
			providers: [userServiceTestProvider],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AppSettingsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('updateSettings', () => {
		it('should call service to update settings with form value', inject(
			[UserService],
			(user: UserService) => {
				const form = {
					value: 'aaa',
					patchValue: () => null,
				} as any;
				const spy = spyOn(user, 'updateSettings').and.returnValue(
					Promise.resolve()
				);

				component.form = form;
				component.updateSettings();

				expect(spy).toHaveBeenCalledWith(form.value);
			}
		));
	});

	describe('changeTheme', () => {
		it('should call service to change app theme', inject(
			[ThemesService],
			(themes: ThemesService) => {
				const spy = spyOn(themes, 'switchToByName');

				component.changeTheme('a' as any);

				expect(spy).toHaveBeenCalledWith('a');
			}
		));
	});
});
