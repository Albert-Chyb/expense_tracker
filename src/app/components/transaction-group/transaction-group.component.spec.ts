import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { By } from '@angular/platform-browser';
import { TransactionsGroupsService } from 'src/app/services/transactions-groups/transactions-groups.service';

import { environment } from './../../../environments/environment';
import { ITransactionGroup } from './../../common/models/group';
import { GroupIconComponent } from './../group-icon/group-icon.component';
import { TransactionGroupComponent } from './transaction-group.component';

describe('TransactionGroupComponent', () => {
	let component: TransactionGroupComponent;
	let fixture: ComponentFixture<TransactionGroupComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TransactionGroupComponent, GroupIconComponent],
			imports: [AngularFireModule.initializeApp(environment.firebase)],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TransactionGroupComponent);
		component = fixture.componentInstance;

		component.group = {
			icon: {
				name: 'car',
				type: 'fab',
			},
			id: 'a',
		} as any;

		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('bindings', () => {
		let group: ITransactionGroup;

		beforeEach(() => {
			group = {
				name: 'b',
				icon: {
					name: 'car',
					type: 'fab',
				},
				id: 'a',
			};
		});

		it('should display current group name', () => {
			const de = fixture.debugElement.query(By.css('.group__name'));
			const el: HTMLParagraphElement = de.nativeElement;

			component.group = group;
			fixture.detectChanges();

			expect(el.innerText).toBe(group.name);
		});

		it('should call delete() method on confirm event from dialog', () => {
			component.isEditable = true;
			fixture.detectChanges();

			const de = fixture.debugElement.query(By.css('.btn'));
			const el: HTMLParagraphElement = de.nativeElement;
			const spy = spyOn(component, 'delete');

			el.dispatchEvent(new Event('confirm'));

			expect(spy).toHaveBeenCalled();
		});

		it('should show group actions when isEditable property is set to true', () => {
			component.isEditable = true;
			fixture.detectChanges();

			const de = fixture.debugElement.query(By.css('.group__actions'));
			const el: HTMLParagraphElement = de.nativeElement;

			expect(el).toBeTruthy();
		});
	});

	describe('delete', () => {
		it('should call service to delete group from the database', () => {
			const groupsService: TransactionsGroupsService = TestBed.inject(
				TransactionsGroupsService
			);
			const spy = spyOn(groupsService, 'delete').and.returnValue(
				Promise.resolve()
			);

			component.delete();

			expect(spy).toHaveBeenCalledWith('a');
		});
	});
});
