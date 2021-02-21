import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from 'src/environments/environment';

import { TestingProviders } from './../../common/test-stubs/testing-providers';
import { LoaderComponent } from './../../components/loader/loader.component';
import { ManageTransactionComponent } from './manage-transaction.component';

describe('ManageTransactionComponent', () => {
	let component: ManageTransactionComponent;
	let fixture: ComponentFixture<ManageTransactionComponent>;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [ManageTransactionComponent, LoaderComponent],
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
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(ManageTransactionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
