import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { FormErrorsComponent } from 'src/app/components/form-errors/form-errors.component';
import { UserService } from 'src/app/services/user/user.service';
import { environment } from 'src/environments/environment';

import { TestingProviders } from './../../common/test-stubs/testing-providers';
import { LoaderComponent } from './../../components/loader/loader.component';
import { StyledInputComponent } from './../../components/styled-input/styled-input.component';
import { FormErrorsDirective } from './../../directives/form-errors/form-errors.directive';
import { ManageTransactionComponent } from './manage-transaction.component';

describe('ManageTransactionComponent', () => {
	let component: ManageTransactionComponent;
	let fixture: ComponentFixture<ManageTransactionComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				ManageTransactionComponent,
				FormErrorsComponent,
				FormErrorsDirective,
				StyledInputComponent,
				LoaderComponent,
			],
			imports: [
				AngularFireModule.initializeApp(environment.firebase),
				RouterTestingModule,
				ReactiveFormsModule,
				MatFormFieldModule,
				MatSelectModule,
				MatDatepickerModule,
				MatInputModule,
				MatNativeDateModule,
				NoopAnimationsModule,
			],
			providers: [
				MatDatepickerModule,
				TestingProviders.TransactionsGroupsService,
				TestingProviders.TransactionsService,
				TestingProviders.PeriodsService,
			],
		}).compileComponents();
	}));

	beforeEach(() => {
		spyOnProperty(TestBed.inject(UserService), 'id').and.returnValue('id');
		fixture = TestBed.createComponent(ManageTransactionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
