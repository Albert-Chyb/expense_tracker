import { GroupIconComponent } from './../../components/group-icon/group-icon.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TransactionCardComponent } from './../../components/transaction-card/transaction-card.component';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddGroupComponent } from './add-group.component';

describe('AddGroupComponent', () => {
	let component: AddGroupComponent;
	let fixture: ComponentFixture<AddGroupComponent>;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [
					AddGroupComponent,
					TransactionCardComponent,
					GroupIconComponent,
				],
				imports: [
					AngularFireModule.initializeApp(environment.firebase),
					RouterTestingModule,
					ReactiveFormsModule,
				],
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(AddGroupComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
