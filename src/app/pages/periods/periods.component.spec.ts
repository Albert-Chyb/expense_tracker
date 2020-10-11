import { UserService } from './../../services/user/user.service';
import { environment } from './../../../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodsComponent } from './periods.component';

describe('PeriodsComponent', () => {
	let component: PeriodsComponent;
	let fixture: ComponentFixture<PeriodsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [PeriodsComponent],
			imports: [AngularFireModule.initializeApp(environment.firebase)],
		}).compileComponents();
	}));

	beforeEach(() => {
		spyOnProperty(TestBed.inject(UserService), 'id').and.returnValue('id');

		fixture = TestBed.createComponent(PeriodsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
