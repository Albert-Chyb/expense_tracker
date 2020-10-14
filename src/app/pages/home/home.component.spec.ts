import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from 'src/environments/environment';

import { TestingProviders } from './../../common/test-stubs/testing-providers';
import { ClueComponent } from './../../components/clue/clue.component';
import { LoaderComponent } from './../../components/loader/loader.component';
import { SummaryCardComponent } from './../../components/summary-card/summary-card.component';
import { TransactionCardComponent } from './../../components/transaction-card/transaction-card.component';
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
			imports: [
				AngularFireModule.initializeApp(environment.firebase),
				RouterTestingModule,
			],
			providers: [
				TestingProviders.TransactionsService,
				TestingProviders.UserService,
			],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(HomeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
