import { DatePipe, registerLocaleData } from '@angular/common';
import { By } from '@angular/platform-browser';
import { Provider } from '@angular/compiler/src/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';

import { DatepickerPages } from '../datepicker-pages';
import { DATEPICKER_INPUTS, DatepickerComponent } from './datepicker.component';
import { LOCALE_ID } from '@angular/core';
import localeEng from '@angular/common/locales/en';
registerLocaleData(localeEng);

const DATEPICKER_INPUTS_PROVIDER: Provider = {
	provide: DATEPICKER_INPUTS,
	useValue: {
		minDate: new Date(-8640000000000000),
		maxDate: new Date(8640000000000000),
		ngControl: {
			control: new FormControl(),
			valueChanges: new Subject(),
		},
	},
};

const ENG_LOCALE_PROVIDER: Provider = {
	provide: LOCALE_ID,
	useValue: 'en',
};

describe('DatepickerComponent', () => {
	let component: DatepickerComponent;
	let fixture: ComponentFixture<DatepickerComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [DatepickerComponent],
			providers: [DATEPICKER_INPUTS_PROVIDER, ENG_LOCALE_PROVIDER],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(DatepickerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('switchPage()', () => {
		it('should throw an error if an unknown page name was passed', () => {
			expect(() =>
				component.switchPage('someUnknownPageName' as any)
			).toThrowError();
		});

		it('should create new page and store it in the `_page` property', () => {
			const fakePageClass = class {
				constructor(name: any, host: any) {}
			};
			DatepickerPages.set('a' as any, fakePageClass);

			component.switchPage('a' as any);

			expect(component['_page']).toBeInstanceOf(fakePageClass);
		});
	});

	describe('onMainBtnClick()', () => {
		it('should change the page to chooseYearPage if the current page is chooseDayPage', () => {
			component.switchPage('chooseDay');
			const spy = spyOn(component, 'switchPage');

			component.onMainBtnClick();

			expect(spy).toHaveBeenCalledWith('chooseYear');
		});

		it('should change the page to chooseDayPage if the current page is different', () => {
			component.switchPage('chooseYear');
			const spy = spyOn(component, 'switchPage');

			component.onMainBtnClick();

			expect(spy).toHaveBeenCalledWith('chooseDay');
		});
	});

	describe('setNewDate()', () => {
		it('should set date with date build from passed argument', () => {
			component.date = new Date(2021, 0, 1);

			component.setNewDate({ year: 2011 });
			expect(component.year).toBe(2011);

			component.setNewDate({ month: 11 });
			expect(component.month).toBe(11);

			component.setNewDate({ day: 14 });
			expect(component.day).toBe(14);
		});

		it('should set the value of the NgControl to the newly created one', () => {
			const spy = spyOn(component['_ngControl'].control, 'setValue');

			component.setNewDate({ year: 2011, month: 0, day: 1 });

			expect(spy).toHaveBeenCalledWith(component.date);
		});
	});

	describe('next()', () => {
		it('should call next() method of the current page, if the current page can generate next set of date', () => {
			const spy = spyOn(component['_page'], 'next');
			spyOnProperty(component['_page'], 'canGenerateNext').and.returnValue(
				true
			);

			component.next();

			expect(spy).toHaveBeenCalled();
		});
	});

	describe('prev()', () => {
		it('should call prev() method of the current page, if the current page can generate previous set of date', () => {
			const spy = spyOn(component['_page'], 'prev');
			spyOnProperty(component['_page'], 'canGeneratePrev').and.returnValue(
				true
			);

			component.prev();

			expect(spy).toHaveBeenCalled();
		});
	});

	describe('onCellClick()', () => {
		it('should call select() method of the current page if value in the clicked cell is selectable', () => {
			spyOn(component, 'isSelectable').and.returnValue(true);
			const spy = spyOn(component['_page'], 'select');

			component.onCellClick(12);

			expect(spy).toHaveBeenCalledWith(12);
		});

		it('should change the page based on the available routes order', () => {
			spyOn(component, 'isSelectable').and.returnValue(true);
			const spy = spyOn(component, 'switchPage');

			component['_page'] = new (DatepickerPages.get('chooseDay'))(
				'chooseDay',
				component
			);
			component.onCellClick(12);
			expect(spy).toHaveBeenCalledWith('chooseDay');

			component['_page'] = new (DatepickerPages.get('chooseYear'))(
				'chooseYear',
				component
			);
			component.onCellClick(12);
			expect(spy).toHaveBeenCalledWith('chooseMonth');

			component['_page'] = new (DatepickerPages.get('chooseMonth'))(
				'chooseMonth',
				component
			);
			component.onCellClick(12);
			expect(spy).toHaveBeenCalledWith('chooseDay');
		});
	});

	describe('isInRange()', () => {
		it('should return a boolean value indicating if passed date is within valid range', () => {
			component.minDate = new Date(2021, 0, 1);
			component.maxDate = new Date(2021, 1, 1);

			expect(component.isInRange(new Date(2021, 0, 5))).toBeTruthy();
			expect(component.isInRange(new Date(2021, 0, 1))).toBeTruthy();
			expect(component.isInRange(new Date(2021, 1, 1))).toBeTruthy();
			expect(component.isInRange(new Date(2021, 1, 2))).toBeFalsy();
			expect(component.isInRange(new Date(2020, 11, 31))).toBeFalsy();
		});
	});

	describe('_determineDate()', () => {
		it('should return current date if passed parameter was falsy', () => {
			expect(component['_determineDate'](null)).toBe(component.date);
		});

		it('should return passed date if it is in valid range', () => {
			expect(component['_determineDate'](new Date(2011, 0, 1))).toEqual(
				new Date(2011, 0, 1)
			);
		});

		it('should return max date if passed date is grater than max date', () => {
			component.maxDate = new Date(2021, 0, 1);
			expect(component['_determineDate'](new Date(2021, 1, 1))).toBe(
				component.maxDate
			);
		});

		it('should return min date if passed date is lesser than min date', () => {
			component.minDate = new Date(2021, 0, 1);
			expect(component['_determineDate'](new Date(2020, 1, 1))).toBe(
				component.minDate
			);
		});
	});

	describe('Events bindings', () => {
		it('should call onMainBtnClick() if the button that displays date is clicked', () => {
			const spy = spyOn(component, 'onMainBtnClick');
			const de = fixture.debugElement.query(By.css('.datepicker__choose-date'));

			de.triggerEventHandler('click', null);

			expect(spy).toHaveBeenCalled();
		});

		it('should call next() method if button that generates next set of data is clicked', () => {
			const spy = spyOn(component, 'next');
			const de = fixture.debugElement.query(
				By.css('.datepicker__nav-btn--next')
			);

			de.triggerEventHandler('click', null);

			expect(spy).toHaveBeenCalled();
		});

		it('should call prev() method if button that generates previous set of data is clicked', () => {
			const spy = spyOn(component, 'prev');
			const de = fixture.debugElement.query(
				By.css('.datepicker__nav-btn--prev')
			);

			de.triggerEventHandler('click', null);

			expect(spy).toHaveBeenCalled();
		});

		it('should call onCellClick() if a table cell was clicked', () => {
			const spy = spyOn(component, 'onCellClick');
			const de = fixture.debugElement.query(
				By.css('td.table__cell:not(.table__cell--disabled)')
			);
			const nativeElement = de.nativeElement as HTMLElement;
			const cellValue = +nativeElement.textContent;

			de.triggerEventHandler('click', null);

			expect(spy).toHaveBeenCalledWith(cellValue);
		});
	});

	describe('Class bindings', () => {
		enum ElClass {
			/** Class that disabled navigation button has. */
			navBtnDisabled = 'datepicker__nav-btn--disabled',

			/** Class that disabled cell has. */
			cellDisabled = 'table__cell--disabled',

			/** Class that selected cell has. */
			cellSelected = 'table__cell--selected',
		}

		it('if previous set of date cannot be generated, the button should have a class that indicates the button is disabled', () => {
			spyOnProperty(component, 'canGeneratePrev').and.returnValue(false);
			fixture.detectChanges();
			const de = fixture.debugElement.query(
				By.css('.datepicker__nav-btn--prev')
			);

			expect(de.classes[ElClass.navBtnDisabled]).toBeTruthy();
		});

		it('if next set of data cannot be generated, the button should have a class that indicates that the button is disabled', () => {
			spyOnProperty(component, 'canGenerateNext').and.returnValue(false);
			fixture.detectChanges();
			const de = fixture.debugElement.query(
				By.css('.datepicker__nav-btn--next')
			);

			expect(de.classes[ElClass.navBtnDisabled]).toBeTruthy();
		});

		it('if a cell contains a value that cannot be selected, it should have a class that indicates it', () => {
			spyOnProperty(component, 'data').and.returnValue([[0, 0, 1, 2, 3, 4, 5]]);
			fixture.detectChanges();
			const de = fixture.debugElement.queryAll(By.css('td.table__cell'));
			const [cell1, cell2] = de;

			expect(cell1.classes[ElClass.cellDisabled]).toBeTruthy();
			expect(cell2.classes[ElClass.cellDisabled]).toBeTruthy();
		});

		it('if a cell contains a value that is currently selected, it should have a class that indicates it', () => {
			spyOnProperty(component, 'data').and.returnValue([[0, 0, 1, 2, 3, 4, 5]]);
			component.date = new Date(2021, 0, 3);
			fixture.detectChanges();

			const de = fixture.debugElement.queryAll(By.css('td.table__cell'));
			const cell = de[4];

			expect(cell.classes[ElClass.cellSelected]).toBeTruthy();
		});
	});

	describe('Bindings', () => {
		it('should display date in `dd MM yyyy` format in the button', () => {
			const date = new Date(2021, 0, 1);
			component.date = date;
			fixture.detectChanges();
			const de = fixture.debugElement.query(By.css('.datepicker__choose-date'));
			const el: HTMLElement = de.nativeElement;
			const transformedDate = new DatePipe('en').transform(date, 'dd MMM yyyy');

			expect(el.textContent.toLowerCase()).toContain(
				transformedDate.toLowerCase()
			);
		});
	});
});
