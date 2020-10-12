import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TransactionGroupComponent } from './../../components/transaction-group/transaction-group.component';
import { ClueComponent } from './../../components/clue/clue.component';
import { RouterTestingModule } from '@angular/router/testing';
import { LoaderComponent } from './../../components/loader/loader.component';
import { UserService } from './../../services/user/user.service';
import { environment } from './../../../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { MainNavService } from './../../services/main-nav/main-nav.service';
import {
	async,
	ComponentFixture,
	TestBed,
	inject,
} from '@angular/core/testing';

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
		}).compileComponents();
	}));

	beforeEach(() => {
		spyOnProperty(TestBed.inject(UserService), 'id').and.returnValue('id');

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
