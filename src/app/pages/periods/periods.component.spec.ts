import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { RouterTestingModule } from '@angular/router/testing';

import { environment } from './../../../environments/environment';
import { TestingProviders } from './../../common/test-stubs/testing-providers';
import { ClueComponent } from './../../components/clue/clue.component';
import { LoaderComponent } from './../../components/loader/loader.component';
import { SummaryCardComponent } from './../../components/summary-card/summary-card.component';
import { ZippyContentComponent } from './../../components/zippy-components/zippy-content/zippy-content.component';
import { ZippyListComponent } from './../../components/zippy-components/zippy-list/zippy-list.component';
import { ZippyStaticComponent } from './../../components/zippy-components/zippy-static/zippy-static.component';
import { ZippyComponent } from './../../components/zippy-components/zippy/zippy.component';
import { UserService } from './../../services/user/user.service';
import { PeriodsComponent } from './periods.component';

describe('PeriodsComponent', () => {
	let component: PeriodsComponent;
	let fixture: ComponentFixture<PeriodsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				PeriodsComponent,
				ZippyComponent,
				ZippyListComponent,
				ZippyStaticComponent,
				ZippyContentComponent,
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
