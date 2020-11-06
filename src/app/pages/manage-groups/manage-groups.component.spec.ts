import {
	async,
	ComponentFixture,
	inject,
	TestBed,
} from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { environment } from './../../../environments/environment';
import { TestingProviders } from './../../common/test-stubs/testing-providers';
import { ClueComponent } from './../../components/clue/clue.component';
import { LoaderComponent } from './../../components/loader/loader.component';
import { TransactionGroupComponent } from './../../components/transaction-group/transaction-group.component';
import { MainNavService } from './../../services/main-nav/main-nav.service';
import { UserService } from './../../services/user/user.service';
import { ManageGroupsComponent } from './manage-groups.component';

describe('ManageGroupsComponent', () => {
	let component: ManageGroupsComponent;
	let fixture: ComponentFixture<ManageGroupsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				ManageGroupsComponent,
				LoaderComponent,
				ClueComponent,
				TransactionGroupComponent,
			],
			imports: [
				AngularFireModule.initializeApp(environment.firebase),
				RouterTestingModule,
				BrowserAnimationsModule,
			],
			providers: [TestingProviders.TransactionsGroupsService],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ManageGroupsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('ngOnInit', () => {
		it('should change main navbar button', inject(
			[MainNavService],
			(nav: MainNavService) => {
				const spy = spyOn(nav, 'changeButton');

				component.ngOnInit();

				expect(spy).toHaveBeenCalled();
			}
		));
	});

	describe('ngOnDestroy', () => {
		it('should reset main navbar button', inject(
			[MainNavService],
			(nav: MainNavService) => {
				const spy = spyOn(nav, 'resetButton');

				component.ngOnDestroy();

				expect(spy).toHaveBeenCalled();
			}
		));
	});
});
