import { ClueComponent } from './../../components/clue/clue.component';
import { LoaderComponent } from './../../components/loader/loader.component';
import { TransactionCardComponent } from './../../components/transaction-card/transaction-card.component';
import { SummaryCardComponent } from './../../components/summary-card/summary-card.component';
import { UserService } from 'src/app/services/user/user.service';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
	let component: HomeComponent;
	let fixture: ComponentFixture<HomeComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				HomeComponent,
				SummaryCardComponent,
				TransactionCardComponent,
				LoaderComponent,
				ClueComponent,
			],
			imports: [AngularFireModule.initializeApp(environment.firebase)],
		}).compileComponents();
	}));

	beforeEach(() => {
		spyOnProperty(TestBed.inject(UserService), 'id').and.returnValue('id');
		fixture = TestBed.createComponent(HomeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
