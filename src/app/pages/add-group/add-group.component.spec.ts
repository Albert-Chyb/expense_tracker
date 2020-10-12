import { ReactiveFormsModule } from '@angular/forms';
import { FormErrorsDirective } from './../../directives/form-errors/form-errors.directive';
import { TransactionCardComponent } from './../../components/transaction-card/transaction-card.component';
import { FormErrorsComponent } from './../../components/form-errors/form-errors.component';
import { StyledInputComponent } from './../../components/styled-input/styled-input.component';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGroupComponent } from './add-group.component';

describe('AddGroupComponent', () => {
	let component: AddGroupComponent;
	let fixture: ComponentFixture<AddGroupComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				AddGroupComponent,
				StyledInputComponent,
				FormErrorsComponent,
				TransactionCardComponent,
				FormErrorsDirective,
			],
			imports: [
				AngularFireModule.initializeApp(environment.firebase),
				RouterTestingModule,
				ReactiveFormsModule,
			],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AddGroupComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
