import { of } from 'rxjs';
import { TestingProviders } from './../../common/test-stubs/testing-providers';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { TransactionsService } from 'src/app/services/transactions/transactions.service';
import { ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
	let component: DashboardComponent;
	let fixture: ComponentFixture<DashboardComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [DashboardComponent],
			imports: [AngularFireModule.initializeApp(environment.firebase)],
			providers: [
				TestingProviders.UserService,
				TestingProviders.TransactionsService,
			],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(DashboardComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('_transactionsInCurrentWeek', () => {
		it('should call service to get all transaction from current week', inject(
			[TransactionsService],
			(transactions: TransactionsService) => {
				const spy = spyOn(transactions, 'getBetween').and.returnValue(of([]));
				const weekBeginning = new Date(2021, 2, 1);
				const weekEnding = new Date(2021, 2, 7);

				jasmine.clock().mockDate(new Date(2021, 2, 4));
				component['_transactionsInCurrentWeek']();

				expect(spy).toHaveBeenCalledWith(weekBeginning, weekEnding);
			}
		));
	});
});
