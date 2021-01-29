import { Subject } from 'rxjs';
import { OverlayService } from './../../services/overlay/overlay.service';
import { FormFieldComponent } from './../form-field/form-field/form-field.component';
import { Component, Provider, TemplateRef } from '@angular/core';
import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SelectOptionComponent } from '../select-option/select-option.component';
import {
	SelectComponent,
	SelectComponentControlDirective,
	SELECT_OPTION_VISIBLE_COUNT,
} from './select.component';

@Component({
	template: `
		<app-select [formControl]="formControl">
			<select-option value="value1">Option 1</select-option>
			<select-option value="value2">Option 2</select-option>
			<select-option value="value3">Option 3</select-option>
		</app-select>
	`,
})
class TestComponent {
	formControl = new FormControl('');
}

class MockedOverlayService {
	onClick$ = new Subject();

	open = jasmine.createSpy('open').and.returnValue({
		rootNodes: [document.createElement('div')],
	});

	close = jasmine.createSpy('close').and.resolveTo();
}

fdescribe('SelectComponent', () => {
	let component: SelectComponent;
	let fixture: ComponentFixture<TestComponent>;
	const providers: Provider[] = [
		{
			provide: NgControl,
			useValue: new FormControl(''),
		},
		{
			provide: OverlayService,
			useClass: MockedOverlayService,
		},
	];

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [
				FormFieldComponent,
				SelectComponent,
				SelectComponentControlDirective,
				SelectOptionComponent,
				TestComponent,
			],
			imports: [ReactiveFormsModule, BrowserAnimationsModule],
			providers,
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(TestComponent);
		component = fixture.debugElement.children[0].componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('open()', () => {
		it('should focus current option', () => {
			const spy = spyOn(component, 'focusOption');

			component.open();

			expect(spy).toHaveBeenCalled();
		});

		it('should open transparent overlay with dropdown reference', inject(
			[OverlayService],
			(overlay: OverlayService) => {
				component['dropdownRef'] = 'a' as any;
				component.open();

				expect(overlay.open).toHaveBeenCalledWith(component.dropdownRef, null, {
					transparent: true,
				});
			}
		));
	});

	describe('close()', () => {
		it('should close overlay', inject(
			[OverlayService],
			(overlay: OverlayService) => {
				component['_isOpened'] = true;
				component['_currentlyFocusedOption'] = component.options.first;
				component.close();

				expect(overlay.close).toHaveBeenCalled();
			}
		));

		it('should remove focus from currently focused option', () => {
			component['_isOpened'] = true;
			component['_currentlyFocusedOption'] = component.options.first;
			component['_currentlyFocusedOption'].focus();

			component.close();

			expect(component['_currentlyFocusedOption'].isFocused).toBeFalse();
		});
	});

	describe('moveFocus()', () => {
		it('should focus next option below if requested direction is `down`', () => {
			const spy = spyOn(component, 'focusOption');
			component['_currentlyFocusedOption'] = component.options.first;

			component.moveFocus('down');

			expect(spy).toHaveBeenCalledWith(component.options.toArray()[1]);
		});

		it('should focus option above if requested direction is `up`', () => {
			const spy = spyOn(component, 'focusOption');
			component['_currentlyFocusedOption'] = component.options.toArray()[1];

			component.moveFocus('up');

			expect(spy).toHaveBeenCalledWith(component.options.first);
		});

		it('should not move focus if currently focused option is at the edge of the dropdown', () => {
			const spy = spyOn(component, 'focusOption');

			component['_currentlyFocusedOption'] = component.options.first;
			component.moveFocus('up');
			expect(spy).not.toHaveBeenCalled();

			component['_currentlyFocusedOption'] = component.options.last;
			component.moveFocus('down');
			expect(spy).not.toHaveBeenCalled();
		});
	});

	describe('choose()', () => {
		it('should unselect current option before settings passed option as chosen', () => {
			const spy = spyOn(component.currentOption, 'unselect');

			component.choose(component.options.last);

			expect(spy).toHaveBeenCalled();
		});

		it('should inform NgControl that select was `touched`', () => {
			const spy = spyOn(component as any, '_onTouched');

			component.choose(component.options.first);
			component.choose(component.options.last);

			expect(spy).toHaveBeenCalled();
		});

		it('should give newly chosen option `selected` status', () => {
			const spy = spyOn(component.options.last, 'select');

			component.choose(component.options.last);

			expect(spy).toHaveBeenCalled();
		});

		it('should throw an error if passed option`s value is invalid, error message should contain passed value', () => {
			const fakeOptionID = 'sjfpoiejtgienr[giawNRngo';

			expect(() => component.choose(fakeOptionID)).toThrowMatching(
				(error: Error) => {
					return error.message.includes(fakeOptionID);
				}
			);
		});

		it('should inform NgControl that select changed its value', () => {
			const spy = spyOn(component as any, '_onChange');

			component.choose(component.options.last);

			expect(spy).toHaveBeenCalled();
		});
	});

	describe('_determineFirstOption()', () => {
		it('should return option without value if there is such', () => {
			Object.defineProperty(component.options.last, 'value', {
				get: () => '',
				configurable: false,
			});

			const result = component['_determineFirstOption']();

			expect(result).toEqual(component.options.last);
		});
	});

	describe('_positionDropdown()', () => {
		it('should stick dropdown to top left corner of the select', () => {
			const styles = [
				['width', '500px'],
				['top', '80px'],
				['left', '150px'],
			];
			const nativeElement = document.createElement('div');

			spyOn(
				component['_hostRef'].nativeElement,
				'getBoundingClientRect'
			).and.returnValue({
				width: 500,
				top: 80,
				left: 150,
			} as any);

			spyOn(component as any, '_fallsOffScreen').and.returnValue({
				offscreenTop: 0,
				offsetTop: 0,
				offsetBottom: 0,
			});

			component['_positionDropdown'](nativeElement);

			styles.forEach(([style, expectedValue]) => {
				expect(nativeElement.style.getPropertyValue(style)).toEqual(
					expectedValue
				);
			});
		});
	});

	describe('_fallsOffScreen()', () => {
		it('should properly determine if element falls offscreen on the top', () => {
			const topSideResult = component['_fallsOffScreen']({
				top: -90,
			} as any);
			expect(topSideResult).toEqual({
				offscreen: true,
				offsetTop: 90,
				offsetBottom: 0,
				offscreenTop: true,
				offscreenBottom: false,
			});
		});

		it('should properly determine if element falls offscreen on the bottom', () => {
			const dropdownHeight = 5 * SELECT_OPTION_VISIBLE_COUNT;
			spyOnProperty(window, 'outerHeight').and.returnValue(dropdownHeight - 1);
			spyOn(component as any, '_transformEmToPx').and.returnValue(5);
			// (20) This spy ensures that dropdown will always have the same height

			const topSideResult = component['_fallsOffScreen']({
				top: 0,
			} as any);
			expect(topSideResult).toEqual({
				offscreen: true,
				offsetTop: 0,
				offsetBottom: 1,
				offscreenTop: false,
				offscreenBottom: true,
			});
		});
	});
});
