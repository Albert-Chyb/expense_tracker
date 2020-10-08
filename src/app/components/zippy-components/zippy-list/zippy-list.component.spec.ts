import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZippyListComponent } from './zippy-list.component';

describe('ZippyListComponent', () => {
	let component: ZippyListComponent;
	let fixture: ComponentFixture<ZippyListComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ZippyListComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ZippyListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('ngAfterContentInit', () => {
		it('should call setUpListeners() method', () => {
			const spy = spyOn(component as any, 'setUpListeners');

			component.ngAfterContentInit();

			expect(spy).toHaveBeenCalled();
		});
	});

	describe('ngOnInit', () => {
		it('should unsubscribe from all subscriptions', () => {
			const spy = spyOn(component['zippersSubscriptions'], 'unsubscribe');

			component.ngOnDestroy();

			expect(spy).toHaveBeenCalled();
		});
	});

	describe('collapseOthers', () => {
		it('should set currentExpanded property with value passed in the argument if currentExpanded property has no value', () => {
			component['currentExpanded'] = null;

			component.collapseOthers('a' as any);

			expect(component['currentExpanded']).toBe('a' as any);
		});

		it('should collapse currently expanded zippy', () => {
			component['currentExpanded'] = {
				content: {
					collapse: () => null,
				},
			} as any;
			const spy = spyOn(component['currentExpanded'].content, 'collapse');

			component.collapseOthers({} as any);

			expect(spy).toHaveBeenCalled();
		});

		it('should set currentExpanded property with the value passed in the argument', () => {
			component['currentExpanded'] = {
				content: {
					collapse: () => null,
				},
			} as any;
			const zippy = {
				content: {
					collapse: () => null,
				},
			} as any;

			component.collapseOthers(zippy);

			expect(component['currentExpanded']).toBe(zippy);
		});
	});
});
