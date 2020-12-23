import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GroupIconComponent } from './group-icon.component';

describe('GroupIconComponent', () => {
	let component: GroupIconComponent;
	let fixture: ComponentFixture<GroupIconComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [GroupIconComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(GroupIconComponent);
		component = fixture.componentInstance;

		component.type = 'neutral';
		component.icon = {
			name: 'car',
			type: 'fab',
		};

		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('classes', () => {
		it('should contain group icon type', () => {
			component.type = 'someType' as any;

			expect(component.classes).toContain('group-icon--someType');
		});

		it('should contain icon type', () => {
			component.icon = {
				name: '' as any,
				type: 'someType' as any,
			};

			expect(component.classes).toContain('someType');
		});

		it('should contain icon name', () => {
			component.icon = {
				name: 'someName' as any,
				type: '' as any,
			};

			expect(component.classes).toContain('someName');
		});
	});
});
