import {
	async,
	ComponentFixture,
	inject,
	TestBed,
} from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Pages } from 'src/app/common/routing/routesUrls';
import { FormErrorsComponent } from 'src/app/components/form-errors/form-errors.component';
import { TransactionsService } from 'src/app/services/transactions/transactions.service';
import { UserService } from 'src/app/services/user/user.service';
import { environment } from 'src/environments/environment';

import { periodsServiceTestProvider } from './../../common/test-stubs/periods.service-stub';
import { transactionsGroupsServiceTestProvider } from './../../common/test-stubs/transactions-groups.service-stub';
import { LoaderComponent } from './../../components/loader/loader.component';
import { StyledInputComponent } from './../../components/styled-input/styled-input.component';
import { FormErrorsDirective } from './../../directives/form-errors/form-errors.directive';
import { AddTransactionComponent } from './add-transaction.component';

describe('AddTransactionComponent', () => {
	let component: AddTransactionComponent;
	let fixture: ComponentFixture<AddTransactionComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				AddTransactionComponent,
				StyledInputComponent,
				FormErrorsDirective,
				FormErrorsComponent,
				LoaderComponent,
			],
			imports: [
				AngularFireModule.initializeApp(environment.firebase),
				RouterTestingModule,
				MatFormFieldModule,
				MatSelectModule,
				MatDatepickerModule,
				ReactiveFormsModule,
				MatNativeDateModule,
				MatInputModule,
				NoopAnimationsModule,
			],
			providers: [
				MatDatepickerModule,
				transactionsGroupsServiceTestProvider,
				periodsServiceTestProvider,
			],
		}).compileComponents();
	}));

	beforeEach(() => {
		spyOnProperty(TestBed.inject(UserService), 'id').and.returnValue('id');
		fixture = TestBed.createComponent(AddTransactionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('addTransaction', () => {
		it('should call service to add transaction with form value', inject(
			[TransactionsService],
			async (transactions: TransactionsService) => {
				const form = {
					value: 'aaa',
				} as any;
				const spy = spyOn(transactions, 'add').and.returnValue(
					Promise.resolve() as any
				);

				component.form = form;
				component.addTransaction();

				expect(spy).toHaveBeenCalledWith(form.value);
			}
		));

		it('should redirect user to the home page', inject(
			[Router, TransactionsService],
			async (router: Router, transactions: TransactionsService) => {
				spyOn(transactions, 'add').and.returnValue(Promise.resolve() as any);
				const spy = spyOn(router, 'navigateByUrl').and.returnValue(
					Promise.resolve(true)
				);

				await component.addTransaction();

				expect(spy).toHaveBeenCalledWith(Pages.Home);
			}
		));
	});
});
