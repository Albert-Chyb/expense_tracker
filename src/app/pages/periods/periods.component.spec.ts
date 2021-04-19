import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { RouterTestingModule } from '@angular/router/testing';

import { environment } from './../../../environments/environment';
import { TestingProviders } from './../../common/test-stubs/testing-providers';
import { ClueComponent } from './../../components/clue/clue.component';
import { LoaderComponent } from './../../components/loader/loader.component';
import { SummaryCardComponent } from './../../components/summary-card/summary-card.component';
import { PeriodsComponent } from './periods.component';

describe('PeriodsComponent', () => {
	let component: PeriodsComponent;
	let fixture: ComponentFixture<PeriodsComponent>;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [
					PeriodsComponent,
					ClueComponent,
					LoaderComponent,
					SummaryCardComponent,
				],
				imports: [
					AngularFireModule.initializeApp(environment.firebase),
					RouterTestingModule,
				],
				providers: [TestingProviders.PeriodsService],
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(PeriodsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
