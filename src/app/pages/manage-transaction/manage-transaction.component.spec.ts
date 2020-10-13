import { periodsServiceTestProvider } from './../../common/test-stubs/periods.service-stub';
import { transactionsGroupsServiceTestProvider } from './../../common/test-stubs/transactions-groups.service-stub';
import { UserService } from 'src/app/services/user/user.service';
import { LoaderComponent } from './../../components/loader/loader.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { StyledInputComponent } from './../../components/styled-input/styled-input.component';
import { FormErrorsDirective } from './../../directives/form-errors/form-errors.directive';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTransactionComponent } from './manage-transaction.component';
import { FormErrorsComponent } from 'src/app/components/form-errors/form-errors.component';

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
			],
			providers: [
				transactionsGroupsServiceTestProvider,
				transactionsGroupsServiceTestProvider,
				periodsServiceTestProvider,
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
